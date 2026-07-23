import base64
import json

import cloudinary
import cloudinary.uploader
import httpx

from fastapi import APIRouter, UploadFile, File, HTTPException
from google import genai
from google.genai import types

from config import settings
from database import crop_history_collection
from models import DetectionResult


router = APIRouter()


# ======================================================
# CLOUDINARY CONFIGURATION
# ======================================================

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


# ======================================================
# API CONFIGURATION
# ======================================================

PLANT_ID_URL = "https://api.plant.id/v3/health_assessment"

GEMINI_MODEL = "gemini-3.5-flash-lite"

gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# HELPER: CLEAN GEMINI JSON
# ======================================================

def clean_json_response(text: str):
    """
    Convert Gemini JSON text into a Python dictionary.
    """

    if not text:
        raise ValueError("Gemini returned an empty response.")

    cleaned = (
        text
        .replace("```json", "")
        .replace("```JSON", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)


# ======================================================
# HELPER: GEMINI IMAGE ANALYSIS
# ======================================================

def analyze_image_with_gemini(
    image_bytes: bytes,
    mime_type: str,
):
    """
    Ask Gemini to independently identify:
    - crop
    - disease
    - confidence
    - visible symptoms
    """

    prompt = """
You are an expert agricultural scientist and plant pathologist.

Carefully analyze the uploaded crop or plant image.

Your job is to independently identify:

1. The crop or plant visible in the image.
2. The most likely disease or health problem.
3. Whether the plant appears healthy.
4. The visible symptoms supporting your conclusion.
5. Your confidence in the visual identification.

IMPORTANT RULES:

- Identify the crop from the IMAGE itself.
- Do not assume the crop name.
- Do not invent information.
- If the crop cannot be identified reliably, return "Unknown Crop".
- If no disease is visible, return "Healthy".
- If the exact disease cannot be identified, describe the most likely
  disease category rather than inventing a specific disease.
- confidence must be a number between 0 and 1.
- Keep the reason concise.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use ```json.

Return exactly this JSON structure:

{
  "crop_name": "Tomato",
  "disease_name": "Possible disease name",
  "confidence": 0.85,
  "reason": "Short explanation of visible symptoms"
}
"""

    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )

    parsed = clean_json_response(
        response.text
    )

    confidence = parsed.get(
        "confidence",
        0.0,
    )

    try:
        confidence = float(confidence)
    except (TypeError, ValueError):
        confidence = 0.0

    confidence = max(
        0.0,
        min(confidence, 1.0),
    )

    return {
        "crop_name": (
            parsed.get("crop_name")
            or "Unknown Crop"
        ),
        "disease_name": (
            parsed.get("disease_name")
            or "Unknown Disease"
        ),
        "confidence": confidence,
        "reason": (
            parsed.get("reason")
            or ""
        ),
    }


# ======================================================
# HELPER: RECONCILE PLANT.ID + GEMINI
# ======================================================

def reconcile_diagnosis(
    plant_disease: str,
    plant_confidence: float,
    gemini_result: dict,
):
    """
    Gemini receives both diagnostic opinions and decides
    on a final disease label.

    Crop identification still comes primarily from
    Gemini's image analysis.
    """

    crop_name = gemini_result.get(
        "crop_name",
        "Unknown Crop",
    )

    gemini_disease = gemini_result.get(
        "disease_name",
        "Unknown Disease",
    )

    gemini_confidence = gemini_result.get(
        "confidence",
        0.0,
    )

    gemini_reason = gemini_result.get(
        "reason",
        "",
    )

    prompt = f"""
You are an expert agricultural plant pathologist.

A crop image has been independently analyzed by:

1. Plant.id, a plant disease recognition system.
2. Gemini vision, which directly inspected the image.

Here are the results.

CROP IDENTIFIED FROM IMAGE BY GEMINI:
{crop_name}

PLANT.ID DISEASE:
{plant_disease}

PLANT.ID CONFIDENCE:
{plant_confidence}

GEMINI DISEASE:
{gemini_disease}

GEMINI VISUAL CONFIDENCE:
{gemini_confidence}

GEMINI VISUAL OBSERVATIONS:
{gemini_reason}

Determine the most reasonable final disease diagnosis.

Rules:

- Plant.id is a specialist plant-health model, so give its
  disease prediction meaningful weight.
- However, do NOT blindly accept Plant.id when its confidence
  is low.
- Use Gemini's visual observations as supporting evidence.
- Do not invent a very specific disease when evidence is weak.
- If both systems broadly agree, use the more useful specific
  disease name.
- If they disagree and Plant.id confidence is low, use a
  cautious disease label.
- If the image appears healthy, return "Healthy".
- Do not change the crop name in this step.
- Return ONLY JSON.
- No markdown.

Return:

{{
  "disease_name": "...",
  "reason": "..."
}}
"""

    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )

    parsed = clean_json_response(
        response.text
    )

    return {
        "disease_name": (
            parsed.get("disease_name")
            or plant_disease
            or gemini_disease
            or "Unknown Disease"
        ),
        "reason": (
            parsed.get("reason")
            or gemini_reason
        ),
    }


# ======================================================
# DETECTION ENDPOINT
# ======================================================

@router.post(
    "/detect",
    response_model=DetectionResult,
    status_code=201,
)
async def detect_disease(
    file: UploadFile = File(...),
    user_id: str = "anonymous",
):

    # ==================================================
    # 1. READ IMAGE
    # ==================================================

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    mime_type = (
        file.content_type
        if file.content_type
        and file.content_type.startswith("image/")
        else "image/jpeg"
    )


    # ==================================================
    # 2. UPLOAD IMAGE TO CLOUDINARY
    # ==================================================

    try:

        upload_result = cloudinary.uploader.upload(
            image_bytes,
            folder="smart-farming/crop-images",
        )

        image_url = upload_result[
            "secure_url"
        ]

        print("=" * 60)
        print("Cloudinary Upload Successful")
        print(image_url)
        print("=" * 60)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Cloudinary upload failed: "
                f"{e}"
            ),
        )


    # ==================================================
    # 3. GEMINI IMAGE ANALYSIS
    # ==================================================

    gemini_result = {
        "crop_name": "Unknown Crop",
        "disease_name": "Unknown Disease",
        "confidence": 0.0,
        "reason": "",
    }

    try:

        gemini_result = (
            analyze_image_with_gemini(
                image_bytes=image_bytes,
                mime_type=mime_type,
            )
        )

        print("=" * 60)
        print("Gemini Image Analysis")
        print(
            json.dumps(
                gemini_result,
                indent=2,
                ensure_ascii=False,
            )
        )
        print("=" * 60)

    except Exception as e:

        # Do NOT kill the whole detection request.
        # Plant.id can still provide a diagnosis.

        print("=" * 60)
        print("Gemini Vision Error:")
        print(e)
        print("=" * 60)


    # ==================================================
    # 4. PREPARE PLANT.ID REQUEST
    # ==================================================

    b64_image = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    headers = {
        "Api-Key":
            settings.PLANT_ID_API_KEY,

        "Content-Type":
            "application/json",
    }

    payload = {
        "images": [
            b64_image
        ],
        "similar_images": True,
    }


    # ==================================================
    # 5. CALL PLANT.ID
    # ==================================================

    try:

        async with httpx.AsyncClient(
            timeout=30
        ) as client:

            resp = await client.post(
                PLANT_ID_URL,
                headers=headers,
                json=payload,
            )

    except httpx.RequestError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Plant.id connection failed: "
                f"{e}"
            ),
        )


    print("=" * 60)
    print(
        "Plant.id Status:",
        resp.status_code,
    )
    print(resp.text)
    print("=" * 60)


    if resp.status_code not in (
        200,
        201,
    ):

        try:
            detail = resp.json()

        except Exception:
            detail = resp.text

        raise HTTPException(
            status_code=resp.status_code,
            detail=detail,
        )


    data = resp.json()


    # ==================================================
    # 6. PARSE PLANT.ID
    # ==================================================

    plant_disease = "Unknown Disease"
    plant_confidence = 0.0

    try:

        result = data.get(
            "result",
            {},
        )

        disease = result.get(
            "disease",
            {},
        )

        suggestions = disease.get(
            "suggestions",
            [],
        )

        if suggestions:

            top = suggestions[0]

            plant_disease = top.get(
                "name",
                "Unknown Disease",
            )

            plant_confidence = float(
                top.get(
                    "probability",
                    0.0,
                )
            )

        else:

            # Some responses may indicate that
            # the plant is healthy.

            is_healthy = result.get(
                "is_healthy",
                {}
            )

            healthy_probability = float(
                is_healthy.get(
                    "probability",
                    0.0,
                )
                or 0.0
            )

            if healthy_probability >= 0.5:
                plant_disease = "Healthy"
                plant_confidence = (
                    healthy_probability
                )

    except Exception as e:

        print(
            "Plant.id Parse Error:",
            e,
        )


    print("=" * 60)
    print("Plant.id Parsed Result")
    print("Disease:", plant_disease)
    print(
        "Confidence:",
        plant_confidence,
    )
    print("=" * 60)


    # ==================================================
    # 7. CROP NAME COMES FROM GEMINI
    # ==================================================

    crop_name = gemini_result.get(
        "crop_name",
        "Unknown Crop",
    )

    if not crop_name:
        crop_name = "Unknown Crop"


    # ==================================================
    # 8. RECONCILE DISEASE RESULTS
    # ==================================================

    final_disease = plant_disease

    try:

        reconciled = reconcile_diagnosis(
            plant_disease=plant_disease,
            plant_confidence=plant_confidence,
            gemini_result=gemini_result,
        )

        final_disease = reconciled.get(
            "disease_name",
            plant_disease,
        )

        print("=" * 60)
        print("Final AI Diagnosis")
        print("Crop:", crop_name)
        print(
            "Disease:",
            final_disease,
        )
        print(
            "Plant.id Confidence:",
            plant_confidence,
        )
        print(
            "Gemini Disease:",
            gemini_result.get(
                "disease_name"
            ),
        )
        print(
            "Gemini Confidence:",
            gemini_result.get(
                "confidence"
            ),
        )
        print(
            "Reason:",
            reconciled.get(
                "reason"
            ),
        )
        print("=" * 60)

    except Exception as e:

        # If reconciliation fails, keep
        # Plant.id disease result.

        print("=" * 60)
        print(
            "Reconciliation Error:",
            e,
        )
        print(
            "Using Plant.id disease instead."
        )
        print("=" * 60)


    # ==================================================
    # 9. FINAL CONFIDENCE
    # ==================================================
    #
    # Keep Plant.id probability as the displayed
    # confidence because it comes from the specialist
    # disease model.
    #
    # We deliberately DO NOT average Gemini confidence
    # and Plant.id probability.
    # ==================================================

    confidence = plant_confidence


    # ==================================================
    # 10. CREATE RESPONSE
    # ==================================================

    detection = DetectionResult(
        crop_name=crop_name,
        disease_name=final_disease,
        confidence=confidence,
        image_url=image_url,
    )


    # ==================================================
    # 11. SAVE HISTORY
    # ==================================================

    try:

        await crop_history_collection.insert_one(
            {
                "user_id":
                    user_id,

                "crop_name":
                    crop_name,

                "disease_name":
                    final_disease,

                "confidence":
                    confidence,

                "image_url":
                    image_url,

                # Extra debugging / future ML fields

                "plant_id_disease":
                    plant_disease,

                "plant_id_confidence":
                    plant_confidence,

                "gemini_crop":
                    gemini_result.get(
                        "crop_name"
                    ),

                "gemini_disease":
                    gemini_result.get(
                        "disease_name"
                    ),

                "gemini_confidence":
                    gemini_result.get(
                        "confidence"
                    ),

                "gemini_reason":
                    gemini_result.get(
                        "reason"
                    ),
            }
        )

    except Exception as e:

        # History failure should not prevent
        # the farmer from receiving diagnosis.

        print(
            "MongoDB History Error:",
            e,
        )


    # ==================================================
    # 12. RETURN RESULT
    # ==================================================

    return detection
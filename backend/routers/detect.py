import base64
import json
from datetime import datetime, timezone

import cloudinary
import cloudinary.uploader
import httpx

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from google import genai
from google.genai import types

from config import settings
from database import crop_history_collection
from models import DetectionResult


router = APIRouter()


# ======================================================
# CLOUDINARY
# ======================================================

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


# ======================================================
# SERVICES
# ======================================================

PLANT_ID_URL = (
    "https://api.plant.id/v3/health_assessment"
)

GEMINI_MODEL = "gemini-3.5-flash-lite"

gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# JSON HELPER
# ======================================================

def clean_json_response(text: str):

    if not text:
        raise ValueError(
            "Gemini returned an empty response."
        )

    cleaned = (
        text
        .replace("```json", "")
        .replace("```JSON", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)


# ======================================================
# GEMINI IMAGE ANALYSIS
# ======================================================

def analyze_image_with_gemini(
    image_bytes: bytes,
    mime_type: str,
):

    prompt = """
You are an expert agricultural scientist and plant
pathologist.

Carefully analyze the uploaded crop or plant image.

Identify:

1. The crop or plant visible in the image.
2. The most likely disease or health problem.
3. Whether the plant appears healthy.
4. Visible symptoms supporting your conclusion.
5. Your confidence in the visual identification.

Rules:

- Identify the crop from the image itself.
- Do not assume the crop.
- Do not invent information.
- If crop identification is uncertain, return
  "Unknown Crop".
- If no disease is visible, return "Healthy".
- If an exact disease cannot be reliably identified,
  use a broader disease category.
- confidence must be between 0 and 1.
- Return ONLY valid JSON.
- Do not return markdown.

Required JSON:

{
  "crop_name": "...",
  "disease_name": "...",
  "confidence": 0.0,
  "reason": "..."
}
"""

    response = (
        gemini_client.models.generate_content(
            model=GEMINI_MODEL,

            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
                prompt,
            ],

            config=types.GenerateContentConfig(
                response_mime_type=(
                    "application/json"
                ),
                temperature=0.1,
            ),
        )
    )

    parsed = clean_json_response(
        response.text
    )

    try:
        confidence = float(
            parsed.get(
                "confidence",
                0.0,
            )
        )

    except (TypeError, ValueError):
        confidence = 0.0

    confidence = max(
        0.0,
        min(confidence, 1.0),
    )

    return {
        "crop_name":
            parsed.get("crop_name")
            or "Unknown Crop",

        "disease_name":
            parsed.get("disease_name")
            or "Unknown Disease",

        "confidence":
            confidence,

        "reason":
            parsed.get("reason")
            or "",
    }


# ======================================================
# RECONCILE PLANT.ID + GEMINI
# ======================================================

def reconcile_diagnosis(
    plant_disease: str,
    plant_confidence: float,
    gemini_result: dict,
):

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

A crop image was analyzed independently by Plant.id
and Gemini vision.

Crop identified by Gemini:
{crop_name}

Plant.id disease:
{plant_disease}

Plant.id confidence:
{plant_confidence}

Gemini disease:
{gemini_disease}

Gemini confidence:
{gemini_confidence}

Gemini visual observations:
{gemini_reason}

Determine the most reasonable final disease diagnosis.

Rules:

- Give Plant.id meaningful weight because it is a
  specialist plant-health system.
- Do not blindly accept Plant.id when confidence is low.
- Use visible symptoms from Gemini as supporting evidence.
- If both systems agree, return the useful disease name.
- If evidence is weak, use a cautious broader diagnosis.
- Do not invent a specific disease.
- If the plant appears healthy, return "Healthy".
- Do not change the crop name.
- Return ONLY JSON.

Required JSON:

{{
  "disease_name": "...",
  "reason": "..."
}}
"""

    response = (
        gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,

            config=types.GenerateContentConfig(
                response_mime_type=(
                    "application/json"
                ),
                temperature=0.1,
            ),
        )
    )

    parsed = clean_json_response(
        response.text
    )

    return {
        "disease_name":
            parsed.get("disease_name")
            or plant_disease
            or gemini_disease
            or "Unknown Disease",

        "reason":
            parsed.get("reason")
            or gemini_reason,
    }


# ======================================================
# DETECT
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
    # READ IMAGE
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
        and file.content_type.startswith(
            "image/"
        )
        else "image/jpeg"
    )


    # ==================================================
    # CLOUDINARY
    # ==================================================

    try:

        upload_result = (
            cloudinary.uploader.upload(
                image_bytes,
                folder=(
                    "smart-farming/crop-images"
                ),
            )
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
    # GEMINI IMAGE ANALYSIS
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
                image_bytes,
                mime_type,
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

        # Gemini failure should not prevent
        # Plant.id from running.

        print("=" * 60)
        print("Gemini Vision Error:")
        print(e)
        print("=" * 60)


    # ==================================================
    # PLANT.ID PAYLOAD
    # ==================================================

    b64_image = (
        base64.b64encode(
            image_bytes
        ).decode("utf-8")
    )

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
    # CALL PLANT.ID
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
    # PARSE PLANT.ID
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

            is_healthy = result.get(
                "is_healthy",
                {},
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


    # ==================================================
    # CROP NAME
    # ==================================================

    crop_name = (
        gemini_result.get(
            "crop_name"
        )
        or "Unknown Crop"
    )


    # ==================================================
    # FINAL DISEASE
    # ==================================================

    final_disease = plant_disease
    final_reason = ""

    try:

        reconciled = (
            reconcile_diagnosis(
                plant_disease,
                plant_confidence,
                gemini_result,
            )
        )

        final_disease = (
            reconciled.get(
                "disease_name"
            )
            or plant_disease
        )

        final_reason = (
            reconciled.get(
                "reason"
            )
            or ""
        )

    except Exception as e:

        print(
            "Reconciliation Error:",
            e,
        )

        print(
            "Using Plant.id disease."
        )


    # ==================================================
    # CONFIDENCE
    # ==================================================

    # Keep Plant.id's probability rather than
    # mathematically averaging unrelated model scores.

    confidence = plant_confidence


    # ==================================================
    # SAVE HISTORY
    # ==================================================

    history_id = None

    try:

        history_result = (
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

                    # Treatment is populated later.
                    "treatment":
                        None,

                    "created_at":
                        datetime.now(
                            timezone.utc
                        ),

                    # Additional AI information

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

                    "final_reason":
                        final_reason,
                }
            )
        )

        history_id = str(
            history_result.inserted_id
        )

        print("=" * 60)
        print(
            "History saved:",
            history_id,
        )
        print("=" * 60)

    except Exception as e:

      
        print(
            "MongoDB History Error:",
            e,
        )


    # ==================================================
    # RESPONSE
    # ==================================================

    return DetectionResult(
        history_id=history_id,
        crop_name=crop_name,
        disease_name=final_disease,
        confidence=confidence,
        image_url=image_url,
    )

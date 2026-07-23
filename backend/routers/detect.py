import base64
import json

import cloudinary
import cloudinary.uploader
import httpx

from datetime import datetime

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
# GEMINI
# ======================================================

gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# PLANT.ID
# ======================================================

PLANT_ID_URL = (
    "https://api.plant.id/v3/health_assessment"
)


# ======================================================
# GEMINI IMAGE ANALYSIS
# ======================================================

async def analyze_image_with_gemini(
    image_bytes: bytes,
    mime_type: str,
):

    prompt = """
You are an expert agricultural plant pathologist.

Analyze this crop image carefully.

Your job is to determine:

1. The crop/plant name.
2. Whether the crop is healthy.
3. If unhealthy, determine the most likely problem.
4. Classify the problem.

Allowed problem_type values:

"disease"
"pest"
"nutrient_deficiency"
"environmental_stress"
"physical_damage"
"healthy"
"other"

Return ONLY valid JSON.

Required JSON structure:

{
  "crop_name": "Maize",
  "problem_type": "disease",
  "problem_name": "Sorghum Downy Mildew",
  "confidence": 0.85,
  "reason": "Visible symptoms support this diagnosis."
}

confidence must be between 0 and 1.

If uncertain, lower the confidence.

Do not use markdown.
Do not use ```json.
Return ONLY JSON.
"""


    response = gemini_client.models.generate_content(

        model="gemini-3.5-flash-lite",

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


    if not response.text:
        raise ValueError(
            "Gemini returned empty image analysis."
        )


    text = (
        response.text
        .replace("```json", "")
        .replace("```JSON", "")
        .replace("```", "")
        .strip()
    )


    print("=" * 60)
    print("Gemini Image Analysis")
    print(text)
    print("=" * 60)


    return json.loads(text)


# ======================================================
# RECONCILE GEMINI + PLANT.ID
# ======================================================

async def reconcile_diagnosis(
    crop_name,
    gemini_problem_type,
    gemini_problem_name,
    gemini_confidence,
    gemini_reason,
    plant_disease,
    plant_confidence,
):

    # If Plant.id gives no useful result, trust Gemini.
    if not plant_disease:

        return {
            "problem_type":
                gemini_problem_type,

            "problem_name":
                gemini_problem_name,
        }


    prompt = f"""
You are an expert agricultural plant pathologist.

Two AI systems analyzed the same crop image.

Crop identified by Gemini:
{crop_name}

Gemini diagnosis:
{gemini_problem_name}

Gemini problem type:
{gemini_problem_type}

Gemini confidence:
{gemini_confidence}

Gemini visual reasoning:
{gemini_reason}

Plant.id diagnosis:
{plant_disease}

Plant.id confidence:
{plant_confidence}

Your job is to reconcile these results.

Important:

Plant.id may sometimes return broad categories such as:

"Bacteria"
"Fungi"
"Potyvirus"
"Abiotic"
"Water-related issue"

Gemini may provide a more crop-specific diagnosis.

Prefer a specific crop-compatible diagnosis when the
visual evidence reasonably supports it.

Do NOT blindly choose the diagnosis with the higher
confidence.

Return ONLY valid JSON.

Required JSON:

{{
  "problem_type": "{gemini_problem_type}",
  "problem_name": "...",
  "reason": "..."
}}

Do not write markdown.
Return ONLY JSON.
"""


    try:

        response = (
            gemini_client.models.generate_content(

                model="gemini-3.5-flash-lite",

                contents=prompt,

                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
        )


        if not response.text:
            raise ValueError(
                "Empty reconciliation response."
            )


        text = (
            response.text
            .replace("```json", "")
            .replace("```JSON", "")
            .replace("```", "")
            .strip()
        )


        print("=" * 60)
        print("Gemini Reconciliation")
        print(text)
        print("=" * 60)


        parsed = json.loads(text)


        return {
            "problem_type":
                parsed.get(
                    "problem_type",
                    gemini_problem_type,
                ),

            "problem_name":
                parsed.get(
                    "problem_name",
                    gemini_problem_name,
                ),
        }


    except Exception as e:

        print(
            "Reconciliation Error:",
            e,
        )


        # Prefer specific Gemini diagnosis when Plant.id
        # only returns a broad category.

        broad_labels = {
            "bacteria",
            "fungi",
            "fungus",
            "potyvirus",
            "virus",
            "abiotic",
            "pest",
        }


        if (
            plant_disease
            and plant_disease.lower()
            not in broad_labels
            and plant_confidence >
                gemini_confidence
        ):

            return {
                "problem_type": "disease",
                "problem_name":
                    plant_disease,
            }


        return {
            "problem_type":
                gemini_problem_type,

            "problem_name":
                gemini_problem_name,
        }


# ======================================================
# DETECT ENDPOINT
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

    image_bytes = await file.read()


    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )


    mime_type = (
        file.content_type
        or "image/jpeg"
    )


    # ==================================================
    # CLOUDINARY
    # ==================================================

    try:

        upload_result = (
            cloudinary.uploader.upload(
                image_bytes,
                folder=(
                    "smart-farming/"
                    "crop-images"
                ),
            )
        )


        image_url = (
            upload_result["secure_url"]
        )


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

    gemini_data = {}


    try:

        gemini_data = (
            await analyze_image_with_gemini(
                image_bytes,
                mime_type,
            )
        )


    except Exception as e:

        print(
            "Gemini image analysis error:",
            e,
        )


    crop_name = (
        gemini_data.get(
            "crop_name",
            "Unknown Crop",
        )
    )


    gemini_problem_type = (
        gemini_data.get(
            "problem_type",
            "disease",
        )
    )


    gemini_problem_name = (
        gemini_data.get(
            "problem_name",
            "Unknown Problem",
        )
    )


    try:

        gemini_confidence = float(
            gemini_data.get(
                "confidence",
                0,
            )
        )

    except (TypeError, ValueError):

        gemini_confidence = 0.0


    gemini_reason = (
        gemini_data.get(
            "reason",
            "",
        )
    )


    # ==================================================
    # PLANT.ID
    # ==================================================

    b64_image = (
        base64.b64encode(
            image_bytes
        ).decode()
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

        "similar_images":
            True,
    }


    plant_disease = None
    plant_confidence = 0.0


    try:

        async with httpx.AsyncClient(
            timeout=30
        ) as client:

            resp = await client.post(
                PLANT_ID_URL,
                headers=headers,
                json=payload,
            )


        print("=" * 60)
        print(
            "Plant.id Status:",
            resp.status_code,
        )

        print(resp.text)
        print("=" * 60)


        if resp.status_code in (
            200,
            201,
        ):

            plant_data = resp.json()


            result = plant_data.get(
                "result",
                {},
            )


            disease_data = (
                result.get(
                    "disease",
                    {},
                )
            )


            suggestions = (
                disease_data.get(
                    "suggestions",
                    [],
                )
            )


            if suggestions:

                top = suggestions[0]


                plant_disease = (
                    top.get(
                        "name"
                    )
                )


                plant_confidence = float(
                    top.get(
                        "probability",
                        0,
                    )
                )


        else:

            print(
                "Plant.id returned:",
                resp.status_code,
            )


    except Exception as e:

        # Gemini can still provide diagnosis if Plant.id
        # temporarily fails.

        print(
            "Plant.id error:",
            e,
        )


    # ==================================================
    # RECONCILE RESULTS
    # ==================================================

    final_result = (
        await reconcile_diagnosis(

            crop_name,

            gemini_problem_type,
            gemini_problem_name,
            gemini_confidence,
            gemini_reason,

            plant_disease,
            plant_confidence,
        )
    )


    problem_type = (
        final_result.get(
            "problem_type",
            gemini_problem_type,
        )
    )


    problem_name = (
        final_result.get(
            "problem_name",
            gemini_problem_name,
        )
    )


    # Keep disease_name so your existing frontend and
    # history continue working.

    disease_name = problem_name


    # Plant.id confidence remains useful when available.
    # Otherwise use Gemini confidence.

    if plant_confidence > 0:
        confidence = plant_confidence
    else:
        confidence = gemini_confidence


    # ==================================================
    # SAVE HISTORY
    # ==================================================

    history_document = {

        "user_id":
            user_id,

        "crop_name":
            crop_name,

        "problem_type":
            problem_type,

        "problem_name":
            problem_name,

        "disease_name":
            disease_name,

        "confidence":
            confidence,

        "image_url":
            image_url,

        "gemini_analysis": {
            "problem_name":
                gemini_problem_name,

            "problem_type":
                gemini_problem_type,

            "confidence":
                gemini_confidence,

            "reason":
                gemini_reason,
        },

        "plant_id_analysis": {
            "disease_name":
                plant_disease,

            "confidence":
                plant_confidence,
        },

        "treatment":
            None,

        "created_at":
            datetime.utcnow(),
    }


    try:

        insert_result = (
            await crop_history_collection.insert_one(
                history_document
            )
        )


        history_id = str(
            insert_result.inserted_id
        )


        print("=" * 60)
        print(
            "History saved:",
            history_id,
        )
        print("=" * 60)


    except Exception as e:

        print(
            "MongoDB history save error:",
            e,
        )

        history_id = None


    # ==================================================
    # RESPONSE
    # ==================================================

    return DetectionResult(

        history_id=history_id,

        crop_name=crop_name,

        problem_type=problem_type,

        problem_name=problem_name,

        disease_name=disease_name,

        confidence=confidence,

        image_url=image_url,
    )
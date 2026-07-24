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

IMPORTANT:

Return the crop name and problem name in canonical English.

This canonical English diagnosis is used internally for
database storage, treatment matching and farmer-feedback
learning.

Return ONLY ONE JSON OBJECT.

Do NOT return a JSON array.

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

    # ==================================================
    # SAFE GEMINI JSON PARSING
    # ==================================================
    #
    # Gemini may occasionally return:
    #
    # {
    #   "crop_name": "Tomato"
    # }
    #
    # OR:
    #
    # [
    #   {
    #     "crop_name": "Tomato"
    #   }
    # ]
    #
    # We normalize both formats into a dictionary.
    # ==================================================

    parsed = json.loads(text)

    if isinstance(parsed, list):

        if not parsed:
            raise ValueError(
                "Gemini returned an empty analysis list."
            )

        parsed = parsed[0]

    if not isinstance(parsed, dict):

        raise ValueError(
            "Gemini analysis must be a JSON object."
        )

    return parsed


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

    # If Plant.id gives no useful result,
    # use Gemini result.

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

The final problem_name MUST remain in canonical English.

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

        # Safety in case Gemini wraps this
        # response in a list too.

        if isinstance(parsed, list):

            if not parsed:
                raise ValueError(
                    "Empty reconciliation list."
                )

            parsed = parsed[0]

        if not isinstance(parsed, dict):
            raise ValueError(
                "Reconciliation must return an object."
            )

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
# LOCALIZE FARMER-FACING DIAGNOSIS
# ======================================================

async def localize_diagnosis(
    crop_name: str,
    problem_name: str,
    problem_type: str,
    language: str,
):

    # --------------------------------------------------
    # ENGLISH
    # --------------------------------------------------

    if not language:
        language = "English"

    normalized_language = (
        language
        .strip()
        .lower()
    )

    if normalized_language in {
        "en",
        "english",
    }:

        return {
            "display_crop_name":
                crop_name,

            "display_problem_name":
                problem_name,
        }


    # --------------------------------------------------
    # OTHER LANGUAGES
    # --------------------------------------------------

    prompt = f"""
You are an agricultural terminology translator helping
Indian farmers understand crop diagnosis results.

Canonical crop name:
{crop_name}

Canonical problem type:
{problem_type}

Canonical crop problem:
{problem_name}

Target language:
{language}

Translate the crop name and crop problem into the target
language.

IMPORTANT RULES:

1. Preserve the agricultural/scientific meaning exactly.

2. Do NOT change the diagnosis.

3. Do NOT invent another disease, pest or crop.

4. Use natural terminology understandable to farmers who
   speak the target language.

5. Preserve useful scientific abbreviations.

For example:

Tomato spotted wilt virus (TSWV)

should preserve:

(TSWV)

after the translated disease name.

6. Scientific names may remain in English when translation
   would make them inaccurate.

7. Do NOT add explanations.

8. Return ONLY valid JSON.

Required JSON:

{{
  "display_crop_name": "...",
  "display_problem_name": "..."
}}

Do not use markdown.
Do not use ```json.
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
                "Empty localization response."
            )

        text = (
            response.text
            .replace("```json", "")
            .replace("```JSON", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(text)

        # Gemini may return [{...}]
        # instead of {...}.

        if isinstance(parsed, list):

            if not parsed:
                raise ValueError(
                    "Empty localization list."
                )

            parsed = parsed[0]

        if not isinstance(parsed, dict):
            raise ValueError(
                "Localization must return an object."
            )

        display_crop_name = (
            parsed.get(
                "display_crop_name"
            )
            or crop_name
        )

        display_problem_name = (
            parsed.get(
                "display_problem_name"
            )
            or problem_name
        )

        print("=" * 60)
        print("Localized Diagnosis")
        print("Language:", language)

        print(
            "Crop:",
            crop_name,
            "->",
            display_crop_name,
        )

        print(
            "Problem:",
            problem_name,
            "->",
            display_problem_name,
        )

        print("=" * 60)

        return {
            "display_crop_name":
                display_crop_name,

            "display_problem_name":
                display_problem_name,
        }

    except Exception as e:

        # Localization should NEVER cause
        # diagnosis to fail.

        print(
            "Diagnosis localization error:",
            e,
        )

        return {
            "display_crop_name":
                crop_name,

            "display_problem_name":
                problem_name,
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
    language: str = "English",
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
            upload_result[
                "secure_url"
            ]
        )

        print("=" * 60)
        print(
            "Cloudinary Upload Successful"
        )
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


    # ==================================================
    # SAFE EXTRACTION
    # ==================================================

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

    except (
        TypeError,
        ValueError,
    ):

        gemini_confidence = 0.0


    # Clamp confidence to 0-1

    gemini_confidence = max(
        0.0,
        min(
            gemini_confidence,
            1.0,
        ),
    )


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

            plant_data = (
                resp.json()
            )


            result = (
                plant_data.get(
                    "result",
                    {},
                )
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

                top = (
                    suggestions[0]
                )


                plant_disease = (
                    top.get(
                        "name"
                    )
                )


                try:

                    plant_confidence = float(
                        top.get(
                            "probability",
                            0,
                        )
                    )

                except (
                    TypeError,
                    ValueError,
                ):

                    plant_confidence = 0.0


                plant_confidence = max(
                    0.0,
                    min(
                        plant_confidence,
                        1.0,
                    ),
                )

        else:

            print(
                "Plant.id returned:",
                resp.status_code,
            )


    except Exception as e:

        # Gemini can still provide diagnosis if
        # Plant.id temporarily fails.

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


    # Keep disease_name for existing
    # frontend and history compatibility.

    disease_name = (
        problem_name
    )


    # ==================================================
    # LOCALIZE FARMER-FACING RESULT
    # ==================================================

    localized = (
        await localize_diagnosis(

            crop_name=crop_name,

            problem_name=
                problem_name,

            problem_type=
                problem_type,

            language=
                language,
        )
    )


    display_crop_name = (
        localized.get(
            "display_crop_name"
        )
        or crop_name
    )


    display_problem_name = (
        localized.get(
            "display_problem_name"
        )
        or problem_name
    )


    # ==================================================
    # FINAL CONFIDENCE
    # ==================================================
    # ==================================================
    # FINAL CONFIDENCE
    # ==================================================

    # Use the higher confidence from Gemini or Plant.id
    confidence = max(
        gemini_confidence,
        plant_confidence,
    )

    # Safety clamp between 0 and 1
    confidence = max(
        0.0,
        min(
            confidence,
            1.0,
        ),
    )

    print("=" * 60)
    print("CONFIDENCE COMPARISON")

    print(
        "Gemini:",
        f"{gemini_confidence * 100:.1f}%"
    )

    print(
        "Plant.id:",
        f"{plant_confidence * 100:.1f}%"
    )

    print(
        "Final:",
        f"{confidence * 100:.1f}%"
    )

    print("=" * 60)


    # ==================================================
    # SAVE HISTORY
    # ==================================================

    # ==================================================
    # SAVE HISTORY
    # ==================================================
    #
    # IMPORTANT:
    #
    # Canonical English values are saved.
    #
    # Hindi/Gujarati/etc. are ONLY display values.
    #
    # This keeps feedback learning consistent.
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


        # ----------------------------------------------
        # GEMINI DETAILS
        # ----------------------------------------------

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


        # ----------------------------------------------
        # PLANT.ID DETAILS
        # ----------------------------------------------

        "plant_id_analysis": {

            "disease_name":
                plant_disease,

            "confidence":
                plant_confidence,
        },


        # Treatment will be added later by
        # /treatment.

        "treatment":
            None,


        "created_at":
            datetime.utcnow(),
    }


    try:

        insert_result = (
            await crop_history_collection
            .insert_one(
                history_document
            )
        )


        history_id = str(
            insert_result
            .inserted_id
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
    # FINAL RESPONSE
    # ==================================================

    return DetectionResult(

        history_id=
            history_id,


        # ----------------------------------------------
        # INTERNAL / CANONICAL VALUES
        # ----------------------------------------------

        crop_name=
            crop_name,

        problem_type=
            problem_type,

        problem_name=
            problem_name,

        disease_name=
            disease_name,

        confidence=
            confidence,

        image_url=
            image_url,


        # ----------------------------------------------
        # TRANSLATED FARMER-FACING VALUES
        # ----------------------------------------------

        display_crop_name=
            display_crop_name,

        display_problem_name=
            display_problem_name,
    )
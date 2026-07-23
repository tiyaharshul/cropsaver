import json

from bson import ObjectId

from fastapi import (
    APIRouter,
    HTTPException,
)

from google import genai
from google.genai import types

from config import settings
from database import crop_history_collection

from models import (
    TreatmentRequest,
    TreatmentResponse,
)


router = APIRouter()


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# PROMPT
# ======================================================

PROMPT_TEMPLATE = """
You are an expert agricultural scientist.

A crop image has been analyzed by an AI crop disease
detection system.

Crop:
{crop_name}

Disease:
{disease_name}

Confidence:
{confidence}

Provide useful and cautious treatment guidance for the
farmer.

Generate treatment ONLY as valid JSON.

Required JSON format:

{{
  "explanation": "...",
  "organic_treatment": "...",
  "chemical_treatment": "...",
  "dosage": "...",
  "spray_schedule": "...",
  "recovery_time": "...",
  "prevention": "..."
}}

Important:

- Do not invent a treatment when the diagnosis is uncertain.
- Take the confidence level into account.
- When chemical treatment is relevant, advise following the
  registered product label and applicable local agricultural
  guidance.
- Do not write markdown.
- Do not write ```json.
- Return ONLY JSON.

Language:
{language}
"""


# ======================================================
# TREATMENT ENDPOINT
# ======================================================

@router.post(
    "/treatment",
    response_model=TreatmentResponse,
)
async def get_treatment(
    req: TreatmentRequest,
):

    print("=" * 60)
    print("Treatment Request")
    print(req.model_dump())
    print("=" * 60)


    # ==================================================
    # BUILD PROMPT
    # ==================================================

    prompt = PROMPT_TEMPLATE.format(
        crop_name=req.crop_name,
        disease_name=req.disease_name,
        confidence=req.confidence,
        language=req.language,
    )


    try:

        # ==============================================
        # GEMINI
        # ==============================================

        response = (
            client.models.generate_content(
                model=(
                    "gemini-3.5-flash-lite"
                ),

                contents=prompt,

                config=(
                    types.GenerateContentConfig(
                        response_mime_type=(
                            "application/json"
                        ),
                        temperature=0.2,
                    )
                ),
            )
        )


        text = response.text.strip()


        print("=" * 60)
        print("Gemini Raw Response")
        print(text)
        print("=" * 60)


        # ==============================================
        # CLEAN RESPONSE
        # ==============================================

        text = (
            text
            .replace("```json", "")
            .replace("```JSON", "")
            .replace("```", "")
            .strip()
        )


        parsed = json.loads(text)


        # ==============================================
        # BUILD TREATMENT
        # ==============================================

        treatment = TreatmentResponse(

            explanation=parsed.get(
                "explanation",
                "No explanation available.",
            ),

            organic_treatment=parsed.get(
                "organic_treatment",
                "Not available.",
            ),

            chemical_treatment=parsed.get(
                "chemical_treatment",
                "Not available.",
            ),

            dosage=parsed.get(
                "dosage",
                "Follow product label.",
            ),

            spray_schedule=parsed.get(
                "spray_schedule",
                "Not specified.",
            ),

            recovery_time=parsed.get(
                "recovery_time",
                "Unknown.",
            ),

            prevention=parsed.get(
                "prevention",
                (
                    "Maintain good crop "
                    "hygiene."
                ),
            ),
        )


        # ==============================================
        # SAVE TREATMENT INTO HISTORY
        # ==============================================

        if req.history_id:

            try:

                if ObjectId.is_valid(
                    req.history_id
                ):

                    update_result = (
                        await crop_history_collection.update_one(
                            {
                                "_id":
                                    ObjectId(
                                        req.history_id
                                    )
                            },

                            {
                                "$set": {
                                    "treatment":
                                        treatment.model_dump()
                                }
                            },
                        )
                    )


                    print("=" * 60)
                    print(
                        "Treatment history ID:",
                        req.history_id,
                    )

                    print(
                        "Matched:",
                        update_result.matched_count,
                    )

                    print(
                        "Modified:",
                        update_result.modified_count,
                    )

                    print("=" * 60)

                else:

                    print(
                        "Invalid history_id:",
                        req.history_id,
                    )

            except Exception as e:

                # Do not fail treatment generation just
                # because history storage failed.

                print(
                    "Treatment history save error:",
                    e,
                )


      

        return treatment


    except json.JSONDecodeError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini returned invalid JSON: "
                f"{e}"
            ),
        )


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini treatment generation "
                f"failed: {e}"
            ),
        )

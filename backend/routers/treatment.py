import json

from bson import ObjectId
from fastapi import APIRouter, HTTPException

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
You are an expert agricultural scientist helping farmers.

A crop image has already been analyzed by an AI crop
diagnostic system.

Crop:
{crop_name}

Problem type:
{problem_type}

Problem:
{problem_name}

Detection confidence:
{confidence}

The problem may be a:

- disease
- pest
- nutrient deficiency
- environmental stress
- physical damage
- healthy crop
- other agricultural problem

Provide practical and cautious guidance for the farmer.

If the diagnosis confidence is low, clearly explain that
the diagnosis should be verified before applying treatment.

If the problem has no chemical cure, clearly say so.

Generate ONLY valid JSON.

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

Important rules:

- Do not invent treatments.
- Take the confidence level into account.
- Do not recommend unnecessary pesticides.
- If chemical treatment is relevant, advise the farmer to
  follow the registered product label and applicable local
  agricultural guidance.
- If the diagnosis is uncertain, recommend verification by
  an agricultural expert.
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
    # DETERMINE PROBLEM
    # ==================================================

    problem_type = (
        req.problem_type
        or "disease"
    )

    problem_name = (
        req.problem_name
        or req.disease_name
        or "Unknown crop problem"
    )


    # ==================================================
    # BUILD PROMPT
    # ==================================================

    prompt = PROMPT_TEMPLATE.format(
        crop_name=req.crop_name,
        problem_type=problem_type,
        problem_name=problem_name,
        confidence=req.confidence,
        language=req.language,
    )


    try:

        # ==============================================
        # GEMINI
        # ==============================================

        response = client.models.generate_content(

            model="gemini-3.5-flash-lite",

            contents=prompt,

            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )


        if not response.text:
            raise ValueError(
                "Gemini returned an empty response."
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
        # BUILD TREATMENT RESPONSE
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
                "Follow registered product label.",
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
                "Maintain good crop hygiene.",
            ),
        )


        # ==============================================
        # SAVE TREATMENT TO HISTORY
        # ==============================================

        if req.history_id:

            try:

                if ObjectId.is_valid(
                    req.history_id
                ):

                    update_result = (
                        await crop_history_collection.update_one(

                            {
                                "_id": ObjectId(
                                    req.history_id
                                )
                            },

                            {
                                "$set": {

                                    "problem_type":
                                        problem_type,

                                    "problem_name":
                                        problem_name,

                                    "treatment":
                                        treatment.model_dump(),
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


            except Exception as history_error:

                # Treatment should still be returned even if
                # MongoDB history update fails.

                print(
                    "Treatment history save error:",
                    history_error,
                )


        # ==============================================
        # RETURN
        # ==============================================

        return treatment


    # ==================================================
    # INVALID JSON
    # ==================================================

    except json.JSONDecodeError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini returned invalid JSON: "
                f"{e}"
            ),
        )


    # ==================================================
    # OTHER ERROR
    # ==================================================

    except HTTPException:
        raise


    except Exception as e:

        print(
            "Treatment generation error:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini treatment generation "
                f"failed: {e}"
            ),
        )
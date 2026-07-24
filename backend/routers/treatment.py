import json

from bson import ObjectId

from fastapi import (
    APIRouter,
    HTTPException,
)

from google import genai
from google.genai import types

from config import settings

from database import (
    crop_history_collection,
)

from models import (
    TreatmentRequest,
    TreatmentResponse,
)

from services.feedback_learning import (
    get_feedback_insights,
    build_feedback_context,
)


router = APIRouter()


# ======================================================
# GEMINI CLIENT
# ======================================================

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# PROMPT
# ======================================================

PROMPT_TEMPLATE = """
You are an expert agricultural scientist helping
farmers make safe crop-management decisions.

An AI crop-analysis system has analyzed a crop image.

Crop:
{crop_name}

Problem type:
{problem_type}

Detected problem:
{problem_name}

Detection confidence:
{confidence}

{feedback_context}

Generate useful and cautious treatment guidance for
the farmer.

The diagnosis confidence must be taken into account.

If confidence is low, clearly explain that the
diagnosis should be verified before treatment is
applied.

Farmer feedback is supplementary information only.
It must never override established agricultural
safety guidance.

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

IMPORTANT SAFETY RULES:

- Do not invent treatment information.

- Do not treat farmer feedback as scientific proof.

- Do not recommend a chemical solely because previous
  farmers reported success.

- When chemical treatment is relevant, advise the
  farmer to follow the registered product label and
  applicable local agricultural guidance.

- If the diagnosis confidence is low, recommend
  verification before chemical treatment.

- Do not write markdown.

- Do not write ```json.

- Return ONLY valid JSON.

Response language:
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

    problem_name = (
        req.problem_name
        or req.disease_name
    )


    problem_type = (
        req.problem_type
        or "disease"
    )


    # ==================================================
    # GET PREVIOUS FARMER OUTCOMES
    # ==================================================

    try:

        feedback_insights = (
            await get_feedback_insights(
                crop_name=req.crop_name,
                problem_name=problem_name,
            )
        )


        print("=" * 60)
        print("Feedback Learning")

        if feedback_insights:

            print(
                "Historical farmer data found:"
            )

            print(
                feedback_insights
            )

        else:

            print(
                "Not enough matching feedback yet."
            )

        print("=" * 60)


    except Exception as e:

        # ------------------------------------------------
        # Feedback analytics must NEVER prevent
        # treatment generation.
        # ------------------------------------------------

        print(
            "Feedback learning error:",
            e,
        )

        feedback_insights = None


    # ==================================================
    # BUILD FEEDBACK CONTEXT
    # ==================================================

    feedback_context = (
        build_feedback_context(
            feedback_insights
        )
    )


    # ==================================================
    # BUILD GEMINI PROMPT
    # ==================================================

    prompt = PROMPT_TEMPLATE.format(

        crop_name=
            req.crop_name,

        problem_type=
            problem_type,

        problem_name=
            problem_name,

        confidence=
            req.confidence,

        feedback_context=
            feedback_context,

        language=
            req.language,

    )


    try:

        # ==================================================
        # GEMINI
        # ==================================================

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


        # ==================================================
        # CHECK RESPONSE
        # ==================================================

        if not response.text:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Gemini returned an empty "
                    "treatment response."
                ),
            )


        text = response.text.strip()


        print("=" * 60)
        print("Gemini Raw Response")
        print(text)
        print("=" * 60)


        # ==================================================
        # CLEAN RESPONSE
        # ==================================================

        text = (
            text
            .replace(
                "```json",
                "",
            )
            .replace(
                "```JSON",
                "",
            )
            .replace(
                "```",
                "",
            )
            .strip()
        )


        # ==================================================
        # PARSE JSON
        # ==================================================

        parsed = json.loads(
            text
        )


        # ==================================================
        # BUILD TREATMENT RESPONSE
        # ==================================================

        treatment = TreatmentResponse(

            explanation=parsed.get(
                "explanation",
                (
                    "No explanation "
                    "available."
                ),
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
                (
                    "Follow the registered "
                    "product label."
                ),
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


        # ==================================================
        # SAVE TREATMENT INTO CROP HISTORY
        # ==================================================

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
                                        treatment.model_dump(),

                                    # ----------------------------------
                                    # Useful metadata showing whether
                                    # feedback learning was used.
                                    # ----------------------------------

                                    "feedback_learning": {

                                        "used":
                                            bool(
                                                feedback_insights
                                            ),

                                        "sample_size":
                                            (
                                                feedback_insights.get(
                                                    "sample_size"
                                                )
                                                if feedback_insights
                                                else 0
                                            ),

                                        "success_rate":
                                            (
                                                feedback_insights.get(
                                                    "success_rate"
                                                )
                                                if feedback_insights
                                                else None
                                            ),

                                        "average_rating":
                                            (
                                                feedback_insights.get(
                                                    "average_rating"
                                                )
                                                if feedback_insights
                                                else None
                                            ),

                                        "average_recovery_days":
                                            (
                                                feedback_insights.get(
                                                    "average_recovery_days"
                                                )
                                                if feedback_insights
                                                else None
                                            ),
                                    },
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

                    print(
                        "Feedback learning used:",
                        bool(
                            feedback_insights
                        ),
                    )

                    print("=" * 60)


                else:

                    print(
                        "Invalid history_id:",
                        req.history_id,
                    )


            except Exception as e:

                # ------------------------------------------
                # Treatment should still be returned even
                # if history storage fails.
                # ------------------------------------------

                print(
                    "Treatment history save error:",
                    e,
                )


        # ==================================================
        # RETURN TREATMENT
        # ==================================================

        return treatment


    # ======================================================
    # INVALID GEMINI JSON
    # ======================================================

    except json.JSONDecodeError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini returned invalid JSON: "
                f"{e}"
            ),
        )


    # ======================================================
    # OTHER ERRORS
    # ======================================================

    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini treatment generation "
                f"failed: {e}"
            ),
        )
from datetime import datetime, timezone

from bson import ObjectId

from fastapi import (
    APIRouter,
    HTTPException,
)

from database import (
    feedback_collection,
    crop_history_collection,
)

from models import (
    FeedbackRequest,
    FeedbackResponse,
)


router = APIRouter()


# ======================================================
# HELPER
# ======================================================

def feedback_to_response(
    feedback: dict,
) -> FeedbackResponse:

    return FeedbackResponse(
        id=str(feedback["_id"]),
        user_id=feedback["user_id"],
        crop_history_id=feedback[
            "crop_history_id"
        ],
        treatment_worked=feedback[
            "treatment_worked"
        ],
        rating=feedback["rating"],
        comments=feedback.get(
            "comments"
        ),
        recovery_days=feedback.get(
            "recovery_days"
        ),
        created_at=feedback[
            "created_at"
        ],
        updated_at=feedback[
            "updated_at"
        ],
    )


# ======================================================
# SUBMIT / UPDATE FEEDBACK
# ======================================================

@router.post(
    "/feedback",
    response_model=FeedbackResponse,
)
async def submit_feedback(
    req: FeedbackRequest,
):

    # --------------------------------------------------
    # VALIDATE HISTORY ID
    # --------------------------------------------------

    if not ObjectId.is_valid(
        req.crop_history_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid crop history ID.",
        )


    history_object_id = ObjectId(
        req.crop_history_id
    )


    # --------------------------------------------------
    # MAKE SURE DIAGNOSIS EXISTS
    # --------------------------------------------------

    history = (
        await crop_history_collection.find_one(
            {
                "_id": history_object_id,
                "user_id": req.user_id,
            }
        )
    )


    if not history:

        raise HTTPException(
            status_code=404,
            detail=(
                "Crop history record "
                "not found."
            ),
        )


    # --------------------------------------------------
    # REQUIRE TREATMENT
    # --------------------------------------------------

    if not history.get("treatment"):

        raise HTTPException(
            status_code=400,
            detail=(
                "Feedback can only be "
                "submitted for a diagnosis "
                "with a saved treatment."
            ),
        )


    # --------------------------------------------------
    # CURRENT TIME
    # --------------------------------------------------

    now = datetime.now(
        timezone.utc
    )


    # --------------------------------------------------
    # CHECK EXISTING FEEDBACK
    # --------------------------------------------------

    existing_feedback = (
        await feedback_collection.find_one(
            {
                "user_id": req.user_id,
                "crop_history_id":
                    req.crop_history_id,
            }
        )
    )


    feedback_data = {
        "user_id":
            req.user_id,

        "crop_history_id":
            req.crop_history_id,

        "treatment_worked":
            req.treatment_worked,

        "rating":
            req.rating,

        "comments":
            req.comments,

        "recovery_days":
            req.recovery_days,

        "updated_at":
            now,
    }


    # --------------------------------------------------
    # UPDATE EXISTING FEEDBACK
    # --------------------------------------------------

    if existing_feedback:

        await feedback_collection.update_one(
            {
                "_id":
                    existing_feedback["_id"]
            },
            {
                "$set":
                    feedback_data
            },
        )


        updated_feedback = (
            await feedback_collection.find_one(
                {
                    "_id":
                        existing_feedback["_id"]
                }
            )
        )


        return feedback_to_response(
            updated_feedback
        )


    # --------------------------------------------------
    # CREATE NEW FEEDBACK
    # --------------------------------------------------

    feedback_data["created_at"] = now


    result = (
        await feedback_collection.insert_one(
            feedback_data
        )
    )


    created_feedback = (
        await feedback_collection.find_one(
            {
                "_id":
                    result.inserted_id
            }
        )
    )


    return feedback_to_response(
        created_feedback
    )


# ======================================================
# GET FEEDBACK FOR ONE DIAGNOSIS
# ======================================================

@router.get(
    "/feedback/{crop_history_id}",
    response_model=FeedbackResponse,
)
async def get_feedback(
    crop_history_id: str,
    user_id: str,
):

    # --------------------------------------------------
    # VALIDATE HISTORY ID
    # --------------------------------------------------

    if not ObjectId.is_valid(
        crop_history_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid crop history ID.",
        )


    # --------------------------------------------------
    # FIND FEEDBACK
    # --------------------------------------------------

    feedback = (
        await feedback_collection.find_one(
            {
                "crop_history_id":
                    crop_history_id,

                "user_id":
                    user_id,
            }
        )
    )


    if not feedback:

        raise HTTPException(
            status_code=404,
            detail="Feedback not found.",
        )


    return feedback_to_response(
        feedback
    )


# ======================================================
# DELETE FEEDBACK
# ======================================================

@router.delete(
    "/feedback/{crop_history_id}",
)
async def delete_feedback(
    crop_history_id: str,
    user_id: str,
):

    if not ObjectId.is_valid(
        crop_history_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid crop history ID.",
        )


    result = (
        await feedback_collection.delete_one(
            {
                "crop_history_id":
                    crop_history_id,

                "user_id":
                    user_id,
            }
        )
    )


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Feedback not found.",
        )


    return {
        "status": "deleted",
        "crop_history_id":
            crop_history_id,
    }
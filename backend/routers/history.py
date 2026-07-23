from bson import ObjectId

from fastapi import (
    APIRouter,
    HTTPException,
)

from database import crop_history_collection


router = APIRouter()


# ======================================================
# GET CROP HISTORY
# ======================================================

@router.get("/history")
async def get_history(
    user_id: str,
):
    """
    Return the farmer's crop-health history.
    """

    cursor = (
        crop_history_collection
        .find(
            {
                "user_id": user_id,
            }
        )
        .sort("_id", -1)
    )

    items = []

    async for doc in cursor:

        doc["_id"] = str(
            doc["_id"]
        )

        items.append(doc)

    return {
        "history": items
    }


# ======================================================
# DELETE ONE HISTORY RECORD
# ======================================================

@router.delete(
    "/history/{history_id}"
)
async def delete_history(
    history_id: str,
    user_id: str,
):
    """
    Delete one crop-history record belonging
    to the current user.
    """

    # Validate MongoDB ObjectId
    if not ObjectId.is_valid(
        history_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid history ID.",
        )


    try:

        result = (
            await crop_history_collection.delete_one(
                {
                    "_id": ObjectId(
                        history_id
                    ),

                    "user_id": user_id,
                }
            )
        )


    except Exception as e:

        print(
            "History delete error:",
            e,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not delete "
                "history record."
            ),
        )


    # Nothing was deleted
    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail=(
                "History record not found."
            ),
        )


    return {
        "success": True,
        "message": (
            "History deleted successfully."
        ),
        "history_id": history_id,
    }
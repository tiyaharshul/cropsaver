from fastapi import APIRouter

from database import crop_history_collection

router = APIRouter()


@router.get("/history")
async def get_history(user_id: str):
    """Returns the farmer's crop-health timeline: previous diseases, images, treatments, recovery."""
    cursor = crop_history_collection.find({"user_id": user_id}).sort("_id", -1)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return {"history": items}

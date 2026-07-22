from fastapi import APIRouter
from bson import ObjectId

from database import feedback_collection
from models import FeedbackRequest

router = APIRouter()


@router.post("/feedback")
async def submit_feedback(req: FeedbackRequest):
    """
    Stores farmer feedback (did treatment work, rating, comments, recovery days).
    This data can later be used to fine-tune / prompt-condition Gemini for
    better future recommendations (see Feature 5 in the spec).
    """
    doc = req.model_dump()
    result = await feedback_collection.insert_one(doc)
    return {"id": str(result.inserted_id), "status": "saved"}

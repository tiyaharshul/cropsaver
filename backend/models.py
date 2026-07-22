from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class DetectionResult(BaseModel):
    crop_name: str
    disease_name: str
    confidence: float
    image_url: Optional[str] = None


class TreatmentRequest(BaseModel):
    crop_name: str
    disease_name: str
    confidence: float
    language: str = "en"  # e.g. "en", "hi"


class TreatmentResponse(BaseModel):
    explanation: str
    organic_treatment: str
    chemical_treatment: str
    dosage: str
    spray_schedule: str
    recovery_time: str
    prevention: str


class FeedbackRequest(BaseModel):
    user_id: str
    crop_history_id: str
    treatment_worked: bool
    rating: int = Field(ge=1, le=5)
    comments: Optional[str] = None
    recovery_days: Optional[int] = None


class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "en"


class ChatResponse(BaseModel):
    reply: str


class CropHistoryItem(BaseModel):
    user_id: str
    crop_name: str
    disease_name: str
    confidence: float
    image_url: Optional[str] = None
    treatment: Optional[TreatmentResponse] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NearbyCenter(BaseModel):
    name: str
    category: str  # KVK, Agriculture Office, Soil Lab, Fertilizer Shop
    latitude: float
    longitude: float
    address: Optional[str] = None
    distance_km: Optional[float] = None

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ======================================================
# AUTHENTICATION
# ======================================================

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    identifier: str
    password: str = Field(min_length=6, max_length=128)
    state: str
    language: str = "en"


class LoginRequest(BaseModel):
    identifier: str
    password: str


class GoogleLoginRequest(BaseModel):
    credential: str


class GoogleCompleteProfileRequest(BaseModel):
    state: str
    language: str = "en"


class LanguageUpdateRequest(BaseModel):
    language: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    state: str
    language: str
    auth_provider: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ======================================================
# DISEASE / CROP PROBLEM DETECTION
# ======================================================

class DetectionResult(BaseModel):
    history_id: Optional[str] = None

    crop_name: str

    # General problem classification
    problem_type: str = "disease"
    problem_name: Optional[str] = None

    # Kept for compatibility with existing frontend/history
    disease_name: str

    confidence: float
    image_url: Optional[str] = None


# ======================================================
# TREATMENT
# ======================================================

class TreatmentRequest(BaseModel):
    crop_name: str

    # Kept for backwards compatibility
    disease_name: str

    confidence: float
    language: str = "en"

    # Connect treatment with MongoDB history
    history_id: Optional[str] = None

    # New generalized crop-problem fields
    problem_type: str = "disease"
    problem_name: Optional[str] = None


class TreatmentResponse(BaseModel):
    explanation: str
    organic_treatment: str
    chemical_treatment: str
    dosage: str
    spray_schedule: str
    recovery_time: str
    prevention: str


# ======================================================
# FEEDBACK
# ======================================================

class FeedbackRequest(BaseModel):
    user_id: str
    crop_history_id: str
    treatment_worked: bool

    rating: int = Field(
        ge=1,
        le=5,
    )

    comments: Optional[str] = None
    recovery_days: Optional[int] = None


# ======================================================
# CHAT
# ======================================================

class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "en"


class ChatResponse(BaseModel):
    reply: str


# ======================================================
# CROP HISTORY
# ======================================================

class CropHistoryItem(BaseModel):
    user_id: str

    crop_name: str

    problem_type: str = "disease"
    problem_name: Optional[str] = None

    disease_name: str
    confidence: float

    image_url: Optional[str] = None

    treatment: Optional[TreatmentResponse] = None

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )


# ======================================================
# NEARBY CENTERS
# ======================================================

class NearbyCenter(BaseModel):
    name: str
    category: str
    latitude: float
    longitude: float

    address: Optional[str] = None
    distance_km: Optional[float] = None
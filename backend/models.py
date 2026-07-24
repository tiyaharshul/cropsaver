from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


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

    # Canonical/internal names.
    # Keep these in English for history, treatment,
    # feedback learning and API matching.
    crop_name: str

    problem_type: str = "disease"
    problem_name: Optional[str] = None

    # Kept for compatibility with existing frontend/history
    disease_name: str

    confidence: float
    image_url: Optional[str] = None

    # Localized names shown to the farmer.
    # Example:
    # crop_name = "Tomato"
    # display_crop_name = "टमाटर"
    display_crop_name: Optional[str] = None

    # Example:
    # problem_name = "Tomato spotted wilt virus"
    # display_problem_name =
    # "टमाटर स्पॉटेड विल्ट वायरस (TSWV)"
    display_problem_name: Optional[str] = None

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

    # Generalized crop-problem fields
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
# FARMER FEEDBACK
# ======================================================

class FeedbackRequest(BaseModel):
    user_id: str
    crop_history_id: str

    treatment_worked: bool

    rating: int = Field(
        ge=1,
        le=5,
    )

    comments: Optional[str] = Field(
        default=None,
        max_length=1000,
    )

    recovery_days: Optional[int] = Field(
        default=None,
        ge=0,
        le=365,
    )


class FeedbackResponse(BaseModel):
    id: str

    user_id: str
    crop_history_id: str

    treatment_worked: bool
    rating: int

    comments: Optional[str] = None
    recovery_days: Optional[int] = None

    created_at: datetime
    updated_at: datetime


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


# ======================================================
# CROP CALENDAR
# ======================================================

class CropCalendarCreateRequest(BaseModel):
    """
    Data required when a farmer creates a new crop calendar.
    """

    user_id: str

    crop_name: str = Field(
        min_length=2,
        max_length=100,
    )

    state: str = Field(
        min_length=2,
        max_length=100,
    )

    season: str = Field(
        min_length=2,
        max_length=50,
    )

    sowing_date: date


class CropCalendarTaskUpdateRequest(BaseModel):
    """
    Used when the farmer marks a calendar task
    completed or incomplete.
    """

    completed: bool


class CropCalendarTask(BaseModel):
    """
    Individual farming activity inside a crop calendar.
    """

    task_id: str

    title: str

    description: Optional[str] = None

    task_type: str

    scheduled_date: date

    completed: bool = False

    completed_at: Optional[datetime] = None


class CropCalendarResponse(BaseModel):
    """
    Complete crop calendar returned by the API.
    """

    id: str

    user_id: str

    crop_name: str

    state: str

    season: str

    sowing_date: date

    expected_harvest_date: date

    tasks: List[CropCalendarTask]

    created_at: datetime

    updated_at: datetime
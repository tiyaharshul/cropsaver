from datetime import datetime, timedelta, timezone
import re

import jwt

from bson import ObjectId

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from pwdlib import PasswordHash

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from config import settings
from database import users_collection

from models import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    UserResponse,
    LanguageUpdateRequest,
    GoogleLoginRequest,
    GoogleCompleteProfileRequest,
)


router = APIRouter(prefix="/auth")

password_hash = PasswordHash.recommended()

security = HTTPBearer(auto_error=False)


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def normalize_identifier(value: str):

    value = value.strip()

    if "@" in value:
        return "email", value.lower()

    digits = re.sub(r"\D", "", value)

    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]

    if len(digits) == 10:
        return "phone", digits

    raise HTTPException(
        400,
        "Enter a valid email address or 10-digit mobile number.",
    )


def create_token(user_id: str):

    now = datetime.now(timezone.utc)

    return jwt.encode(
        {
            "sub": user_id,
            "iat": now,
            "exp": now + timedelta(days=7),
        },
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def user_response(user):

    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user.get("email"),
        phone=user.get("phone"),
        state=user.get("state", ""),
        language=user.get("language", "en"),
        auth_provider=user.get(
            "auth_provider",
            "local",
        ),
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        security
    ),
):

    if not credentials:

        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Not authenticated.",
        )

    try:

        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )

        user = await users_collection.find_one(
            {
                "_id": ObjectId(
                    payload["sub"]
                )
            }
        )

        if not user:
            raise ValueError()

        return user

    except Exception:

        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid or expired login.",
        )


# ---------------------------------------------------------
# Local registration
# ---------------------------------------------------------

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=201,
)
async def register(req: RegisterRequest):

    kind, identifier = normalize_identifier(
        req.identifier
    )

    if await users_collection.find_one(
        {kind: identifier}
    ):

        raise HTTPException(
            409,
            "An account already exists with this email or mobile number.",
        )

    doc = {
        "name": req.name.strip(),

        "email": (
            identifier
            if kind == "email"
            else None
        ),

        "phone": (
            identifier
            if kind == "phone"
            else None
        ),

        "password_hash": password_hash.hash(
            req.password
        ),

        "auth_provider": "local",

        "state": req.state.strip(),

        "language": req.language,

        "created_at": datetime.now(
            timezone.utc
        ),
    }

    result = await users_collection.insert_one(
        doc
    )

    doc["_id"] = result.inserted_id

    return AuthResponse(
        access_token=create_token(
            str(result.inserted_id)
        ),
        user=user_response(doc),
    )


# ---------------------------------------------------------
# Local login
# ---------------------------------------------------------

@router.post(
    "/login",
    response_model=AuthResponse,
)
async def login(req: LoginRequest):

    kind, identifier = normalize_identifier(
        req.identifier
    )

    user = await users_collection.find_one(
        {kind: identifier}
    )

    if (
        not user
        or not user.get("password_hash")
        or not password_hash.verify(
            req.password,
            user["password_hash"],
        )
    ):

        raise HTTPException(
            401,
            "Incorrect email/mobile number or password.",
        )

    return AuthResponse(
        access_token=create_token(
            str(user["_id"])
        ),
        user=user_response(user),
    )


# ---------------------------------------------------------
# Google login
# ---------------------------------------------------------

@router.post("/google")
async def google_login(
    req: GoogleLoginRequest,
):

    if not settings.GOOGLE_CLIENT_ID:

        raise HTTPException(
            500,
            "Google authentication is not configured.",
        )

    try:

        google_user = id_token.verify_oauth2_token(
            req.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except Exception as e:

        print("Google verification error:", e)

        raise HTTPException(
            401,
            "Google authentication failed.",
        )

    google_sub = google_user.get("sub")

    email = google_user.get("email")

    name = google_user.get(
        "name",
        "Farmer",
    )

    email_verified = google_user.get(
        "email_verified",
        False,
    )

    if not google_sub or not email:

        raise HTTPException(
            400,
            "Google account information is incomplete.",
        )

    if not email_verified:

        raise HTTPException(
            401,
            "Google email is not verified.",
        )

    email = email.lower()

    # -------------------------------------
    # Existing Google account
    # -------------------------------------

    user = await users_collection.find_one(
        {
            "google_sub": google_sub
        }
    )

    if user:

        return {
            "needs_setup": False,

            "access_token": create_token(
                str(user["_id"])
            ),

            "token_type": "bearer",

            "user": user_response(user),
        }

    # -------------------------------------
    # Check whether email already exists
    # -------------------------------------

    existing_email_user = (
        await users_collection.find_one(
            {
                "email": email
            }
        )
    )

    if existing_email_user:

        # Link Google identity to the
        # existing CropSaver account.

        await users_collection.update_one(
            {
                "_id": existing_email_user[
                    "_id"
                ]
            },
            {
                "$set": {
                    "google_sub": google_sub,
                }
            },
        )

        existing_email_user[
            "google_sub"
        ] = google_sub

        return {
            "needs_setup": False,

            "access_token": create_token(
                str(
                    existing_email_user[
                        "_id"
                    ]
                )
            ),

            "token_type": "bearer",

            "user": user_response(
                existing_email_user
            ),
        }

    # -------------------------------------
    # New Google user
    # -------------------------------------

    doc = {
        "name": name,
        "email": email,
        "phone": None,

        "google_sub": google_sub,

        "password_hash": None,

        "auth_provider": "google",

        # User chooses these next
        "state": "",
        "language": "en",

        "profile_complete": False,

        "created_at": datetime.now(
            timezone.utc
        ),
    }

    result = await users_collection.insert_one(
        doc
    )

    doc["_id"] = result.inserted_id

    return {
        "needs_setup": True,

        "access_token": create_token(
            str(result.inserted_id)
        ),

        "token_type": "bearer",

        "user": user_response(doc),
    }


# ---------------------------------------------------------
# Complete Google profile
# ---------------------------------------------------------

@router.patch(
    "/google/complete-profile",
    response_model=AuthResponse,
)
async def complete_google_profile(
    req: GoogleCompleteProfileRequest,
    user=Depends(get_current_user),
):

    if not user.get("google_sub"):

        raise HTTPException(
            400,
            "This is not a Google account.",
        )

    await users_collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "state": req.state.strip(),
                "language": req.language,
                "profile_complete": True,
            }
        },
    )

    user["state"] = req.state.strip()

    user["language"] = req.language

    user["profile_complete"] = True

    return AuthResponse(
        access_token=create_token(
            str(user["_id"])
        ),
        user=user_response(user),
    )


# ---------------------------------------------------------
# Current user
# ---------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
)
async def me(
    user=Depends(get_current_user),
):

    return user_response(user)


# ---------------------------------------------------------
# Update language
# ---------------------------------------------------------

@router.patch(
    "/language",
    response_model=UserResponse,
)
async def update_language(
    req: LanguageUpdateRequest,
    user=Depends(get_current_user),
):

    await users_collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "language": req.language
            }
        },
    )

    user["language"] = req.language

    return user_response(user)
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings


client = AsyncIOMotorClient(settings.MONGODB_URI)

db = client[settings.MONGODB_DB_NAME]


# ======================================================
# COLLECTIONS
# ======================================================

users_collection = db["users"]

crop_history_collection = db["crop_history"]

feedback_collection = db["feedback"]

government_notices_collection = db["government_notices"]

reports_collection = db["reports"]

crop_calendars_collection = db["crop_calendars"]
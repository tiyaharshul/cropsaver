from datetime import datetime, timedelta, date
from uuid import uuid4

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query

from database import crop_calendars_collection
from models import (
    CropCalendarCreateRequest,
    CropCalendarTaskUpdateRequest,
)


router = APIRouter(prefix="/calendar")


# ======================================================
# CROP DURATIONS
# ======================================================

CROP_DURATIONS = {
    "maize": 100,
    "corn": 100,
    "wheat": 120,
    "rice": 130,
    "paddy": 130,
    "tomato": 110,
    "potato": 100,
    "soybean": 105,
    "groundnut": 120,
    "mustard": 110,
    "cotton": 170,
    "sugarcane": 365,
    "onion": 120,
    "chilli": 150,
    "chili": 150,
    "bajra": 85,
    "pearl millet": 85,
    "barley": 120,
    "gram": 110,
    "chickpea": 110,
}


# ======================================================
# DATE HELPERS
# ======================================================

def date_to_datetime(value):
    """
    MongoDB BSON supports datetime but not Python date.
    Convert date objects before saving them.
    """

    if isinstance(value, datetime):
        return value

    if isinstance(value, date):
        return datetime.combine(
            value,
            datetime.min.time(),
        )

    return value


def datetime_to_date_string(value):
    """
    Convert MongoDB datetime values back to YYYY-MM-DD
    for the frontend.
    """

    if isinstance(value, datetime):
        return value.date().isoformat()

    if isinstance(value, date):
        return value.isoformat()

    return value


# ======================================================
# SERIALIZE CALENDAR
# ======================================================

def serialize_calendar(document):
    if not document:
        return None

    result = document.copy()

    result["_id"] = str(result["_id"])

    result["sowing_date"] = datetime_to_date_string(
        result.get("sowing_date")
    )

    result["expected_harvest_date"] = datetime_to_date_string(
        result.get("expected_harvest_date")
    )

    serialized_tasks = []

    for task in result.get("tasks", []):
        serialized_task = task.copy()

        serialized_task["scheduled_date"] = datetime_to_date_string(
            serialized_task.get("scheduled_date")
        )

        serialized_tasks.append(serialized_task)

    result["tasks"] = serialized_tasks

    return result


# ======================================================
# CROP DURATION
# ======================================================

def get_crop_duration(crop_name: str):
    normalized = crop_name.strip().lower()

    return CROP_DURATIONS.get(
        normalized,
        120,
    )


# ======================================================
# CREATE SINGLE TASK
# ======================================================

def create_task(
    title,
    description,
    task_type,
    scheduled_date,
):
    return {
        "task_id": str(uuid4()),
        "title": title,
        "description": description,
        "task_type": task_type,
        "scheduled_date": scheduled_date,
        "completed": False,
        "completed_at": None,
    }


# ======================================================
# GENERATE CALENDAR TASKS
# ======================================================

def generate_tasks(
    crop_name,
    sowing_date,
    duration_days,
):
    harvest_date = sowing_date + timedelta(
        days=duration_days
    )

    tasks = []

    # Sowing
    tasks.append(
        create_task(
            title="Sowing",
            description=(
                f"Sow {crop_name} using recommended seed rate, "
                "spacing and field preparation practices."
            ),
            task_type="sowing",
            scheduled_date=sowing_date,
        )
    )

    # Irrigation
    tasks.append(
        create_task(
            title="Irrigation Check",
            description=(
                "Check soil moisture and irrigate only if required."
            ),
            task_type="irrigation",
            scheduled_date=sowing_date + timedelta(days=7),
        )
    )

    # Germination
    tasks.append(
        create_task(
            title="Germination Check",
            description=(
                "Inspect germination and identify areas "
                "with poor crop establishment."
            ),
            task_type="inspection",
            scheduled_date=sowing_date + timedelta(days=10),
        )
    )

    # Weed management
    tasks.append(
        create_task(
            title="Weed Management",
            description=(
                "Inspect the field for weeds and carry out "
                "suitable weed management."
            ),
            task_type="weeding",
            scheduled_date=sowing_date + timedelta(days=20),
        )
    )

    # Fertilizer
    tasks.append(
        create_task(
            title="Fertilizer Application",
            description=(
                "Review crop growth and apply recommended "
                "nutrients according to crop and local guidance."
            ),
            task_type="fertilizer",
            scheduled_date=sowing_date + timedelta(days=25),
        )
    )

    # Pest inspection
    tasks.append(
        create_task(
            title="Pest Inspection",
            description=(
                "Inspect leaves, stems and nearby plants "
                "for visible pest activity."
            ),
            task_type="pest",
            scheduled_date=sowing_date + timedelta(days=35),
        )
    )

    # Disease inspection
    tasks.append(
        create_task(
            title="Disease Inspection",
            description=(
                "Check the crop for spots, lesions, wilting, "
                "discoloration or other disease symptoms."
            ),
            task_type="disease",
            scheduled_date=sowing_date + timedelta(days=45),
        )
    )

    # Mid-season irrigation
    middle_day = max(
        50,
        int(duration_days * 0.50),
    )

    tasks.append(
        create_task(
            title="Mid-Season Irrigation Check",
            description=(
                "Check soil moisture and crop water stress "
                "during the active growth stage."
            ),
            task_type="irrigation",
            scheduled_date=(
                sowing_date + timedelta(days=middle_day)
            ),
        )
    )

    # Growth check
    growth_day = int(
        duration_days * 0.65
    )

    tasks.append(
        create_task(
            title="Crop Growth Check",
            description=(
                "Inspect crop growth, flowering or fruit "
                "development and look for nutrient or stress symptoms."
            ),
            task_type="growth",
            scheduled_date=(
                sowing_date + timedelta(days=growth_day)
            ),
        )
    )

    # Harvest preparation
    pre_harvest_date = harvest_date - timedelta(days=10)

    tasks.append(
        create_task(
            title="Harvest Preparation",
            description=(
                "Check crop maturity and prepare equipment, "
                "labour and storage for harvesting."
            ),
            task_type="harvest",
            scheduled_date=pre_harvest_date,
        )
    )

    # Expected harvest
    tasks.append(
        create_task(
            title="Expected Harvest",
            description=(
                f"Expected harvest period for {crop_name}. "
                "Confirm crop maturity before harvesting."
            ),
            task_type="harvest",
            scheduled_date=harvest_date,
        )
    )

    tasks.sort(
        key=lambda item: item["scheduled_date"]
    )

    return tasks, harvest_date


# ======================================================
# CREATE CALENDAR
# ======================================================

@router.post("")
async def create_calendar(
    request: CropCalendarCreateRequest,
):
    crop_name = request.crop_name.strip()
    state = request.state.strip()
    season = request.season.strip()

    if not crop_name:
        raise HTTPException(
            status_code=400,
            detail="Crop name is required.",
        )

    if not state:
        raise HTTPException(
            status_code=400,
            detail="State is required.",
        )

    if not season:
        raise HTTPException(
            status_code=400,
            detail="Season is required.",
        )

    duration_days = get_crop_duration(
        crop_name
    )

    tasks, harvest_date = generate_tasks(
        crop_name=crop_name,
        sowing_date=request.sowing_date,
        duration_days=duration_days,
    )

    # --------------------------------------------------
    # Convert Python date objects to MongoDB datetime
    # --------------------------------------------------

    mongo_tasks = []

    for task in tasks:
        mongo_task = task.copy()

        mongo_task["scheduled_date"] = date_to_datetime(
            mongo_task["scheduled_date"]
        )

        mongo_tasks.append(
            mongo_task
        )

    now = datetime.utcnow()

    document = {
        "user_id": request.user_id,
        "crop_name": crop_name,
        "state": state,
        "season": season,

        # Important MongoDB conversion
        "sowing_date": date_to_datetime(
            request.sowing_date
        ),

        "expected_harvest_date": date_to_datetime(
            harvest_date
        ),

        "tasks": mongo_tasks,

        "created_at": now,
        "updated_at": now,
    }

    result = await crop_calendars_collection.insert_one(
        document
    )

    created_calendar = await crop_calendars_collection.find_one(
        {
            "_id": result.inserted_id
        }
    )

    return {
        "message": "Crop calendar created successfully.",
        "calendar": serialize_calendar(
            created_calendar
        ),
    }


# ======================================================
# GET ALL USER CALENDARS
# ======================================================

@router.get("")
async def get_calendars(
    user_id: str = Query(...),
):
    cursor = (
        crop_calendars_collection
        .find(
            {
                "user_id": user_id
            }
        )
        .sort(
            "created_at",
            -1,
        )
    )

    calendars = []

    async for document in cursor:
        calendars.append(
            serialize_calendar(
                document
            )
        )

    return {
        "calendars": calendars
    }


# ======================================================
# GET SINGLE CALENDAR
# ======================================================

@router.get("/{calendar_id}")
async def get_calendar(
    calendar_id: str,
    user_id: str = Query(...),
):
    if not ObjectId.is_valid(
        calendar_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid calendar ID.",
        )

    document = await crop_calendars_collection.find_one(
        {
            "_id": ObjectId(calendar_id),
            "user_id": user_id,
        }
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Crop calendar not found.",
        )

    return {
        "calendar": serialize_calendar(
            document
        )
    }


# ======================================================
# UPDATE TASK
# ======================================================

@router.patch(
    "/{calendar_id}/tasks/{task_id}"
)
async def update_calendar_task(
    calendar_id: str,
    task_id: str,
    request: CropCalendarTaskUpdateRequest,
    user_id: str = Query(...),
):
    if not ObjectId.is_valid(
        calendar_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid calendar ID.",
        )

    calendar = await crop_calendars_collection.find_one(
        {
            "_id": ObjectId(calendar_id),
            "user_id": user_id,
        }
    )

    if not calendar:
        raise HTTPException(
            status_code=404,
            detail="Crop calendar not found.",
        )

    task_exists = any(
        task.get("task_id") == task_id
        for task in calendar.get(
            "tasks",
            [],
        )
    )

    if not task_exists:
        raise HTTPException(
            status_code=404,
            detail="Calendar task not found.",
        )

    completed_at = (
        datetime.utcnow()
        if request.completed
        else None
    )

    await crop_calendars_collection.update_one(
        {
            "_id": ObjectId(calendar_id),
            "user_id": user_id,
            "tasks.task_id": task_id,
        },
        {
            "$set": {
                "tasks.$.completed": request.completed,
                "tasks.$.completed_at": completed_at,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    updated_calendar = await crop_calendars_collection.find_one(
        {
            "_id": ObjectId(calendar_id),
            "user_id": user_id,
        }
    )

    return {
        "message": "Task updated successfully.",
        "calendar": serialize_calendar(
            updated_calendar
        ),
    }


# ======================================================
# DELETE CALENDAR
# ======================================================

@router.delete("/{calendar_id}")
async def delete_calendar(
    calendar_id: str,
    user_id: str = Query(...),
):
    if not ObjectId.is_valid(
        calendar_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid calendar ID.",
        )

    result = await crop_calendars_collection.delete_one(
        {
            "_id": ObjectId(calendar_id),
            "user_id": user_id,
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Crop calendar not found.",
        )

    return {
        "message": "Crop calendar deleted successfully."
    }
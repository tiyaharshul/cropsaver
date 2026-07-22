import base64
import cloudinary
import cloudinary.uploader
import httpx

from fastapi import APIRouter, UploadFile, File, HTTPException

from config import settings
from database import crop_history_collection
from models import DetectionResult

router = APIRouter()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

PLANT_ID_URL = "https://api.plant.id/v3/health_assessment"


@router.post("/detect", response_model=DetectionResult, status_code=201)
async def detect_disease(
    file: UploadFile = File(...),
    user_id: str = "anonymous",
):
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

   
    # Upload image to Cloudinary
  
    try:
        upload_result = cloudinary.uploader.upload(
            image_bytes,
            folder="smart-farming/crop-images",
        )

        image_url = upload_result["secure_url"]

        print("=" * 60)
        print("Cloudinary Upload Successful")
        print(image_url)
        print("=" * 60)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {e}",
        )

  
    # Prepare Plant.id request

    b64_image = base64.b64encode(image_bytes).decode()

    headers = {
        "Api-Key": settings.PLANT_ID_API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "images": [b64_image],
        "similar_images": True,
    }


    # Call Plant.id
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                PLANT_ID_URL,
                headers=headers,
                json=payload,
            )

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Plant.id connection failed: {e}",
        )

    print("=" * 60)
    print("Plant.id Status:", resp.status_code)
    print(resp.text)
    print("=" * 60)

    # Plant.id returns 201
    if resp.status_code not in (200, 201):
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text

        raise HTTPException(
            status_code=resp.status_code,
            detail=detail,
        )

    data = resp.json()

    
    # Parse response

    crop_name = "Unknown Crop"
    disease_name = "Healthy"
    confidence = 0.0

    try:
        result = data.get("result", {})

        disease = result.get("disease", {})
        suggestions = disease.get("suggestions", [])

        if suggestions:
            top = suggestions[0]

            disease_name = top.get(
                "name",
                "Unknown Disease",
            )

            confidence = float(
                top.get("probability", 0.0)
            )

    except Exception as e:
        print("Parse Error:", e)

    detection = DetectionResult(
        crop_name=crop_name,
        disease_name=disease_name,
        confidence=confidence,
        image_url=image_url,
    )

    
    # Save history
   
    try:
        await crop_history_collection.insert_one(
            {
                "user_id": user_id,
                "crop_name": crop_name,
                "disease_name": disease_name,
                "confidence": confidence,
                "image_url": image_url,
            }
        )

    except Exception as e:
        print("MongoDB Error:", e)

    return detection

import httpx
from fastapi import APIRouter, HTTPException
from math import radians, sin, cos, sqrt, atan2

from config import settings
from models import NearbyCenter

router = APIRouter()


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


SEARCH_TERMS = [
    ("Krishi Vigyan Kendra", "KVK"),
    ("Agriculture Office", "Agriculture Office"),
    ("Soil Testing Laboratory", "Soil Lab"),
    ("Fertilizer Shop", "Fertilizer Shop"),
]


@router.get("/nearby-centers")
async def nearby_centers(
    lat: float,
    lon: float,
    radius_km: int = 30000,
):

    results = []

    async with httpx.AsyncClient(timeout=20) as client:

        for term, category in SEARCH_TERMS:

            try:
                response = await client.get(
                    settings.NOMINATIM_API_URL,
                    params={
                        "q": term,
                        "format": "jsonv2",
                        "limit": 5,
                        "addressdetails": 1,
                    },
                    headers={
                        "User-Agent": "SmartFarmingAssistant/1.0"
                    },
                )

            except httpx.RequestError:
                continue

            if response.status_code != 200:
                continue

            places = response.json()

            for place in places:

                plat = float(place["lat"])
                plon = float(place["lon"])

                distance = haversine_km(
                    lat,
                    lon,
                    plat,
                    plon,
                )

                if distance > radius_km:
                    continue

                results.append(
                    NearbyCenter(
                        name=place.get("display_name", term),
                        category=category,
                        latitude=plat,
                        longitude=plon,
                        address=place.get("display_name"),
                        distance_km=round(distance, 2),
                    )
                )

    results.sort(key=lambda x: x.distance_km)

    return {
        "centers": results[:20]
    }
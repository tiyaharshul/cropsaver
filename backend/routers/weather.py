import httpx
from fastapi import APIRouter, HTTPException

from config import settings

router = APIRouter()

OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"


@router.get("/weather")
async def get_weather(lat: float, lon: float):
    """Weather / humidity / rain prediction — useful for spray advisories."""
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.OPENWEATHER_API_KEY,
        "units": "metric",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(OPENWEATHER_URL, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="OpenWeather API error")

    data = resp.json()
    return {
        "temperature_c": data.get("main", {}).get("temp"),
        "humidity_pct": data.get("main", {}).get("humidity"),
        "condition": data.get("weather", [{}])[0].get("description"),
        "wind_speed_mps": data.get("wind", {}).get("speed"),
        "rain_last_hour_mm": data.get("rain", {}).get("1h", 0),
    }

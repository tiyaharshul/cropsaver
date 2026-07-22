"""
Central configuration. All secrets are read from environment variables (.env).

"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "smart_farming"

    # AI services
    PLANT_ID_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""  # used for Whisper speech-to-text

    # Cloud storage
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Weather
    OPENWEATHER_API_KEY: str = ""

    # Maps — Leaflet + OpenStreetMap (no API key needed).
    # Nearby-center search uses the free Overpass API (OpenStreetMap data).
    OVERPASS_API_URL: str = "https://overpass-api.de/api/interpreter"
    NOMINATIM_API_URL: str = "https://nominatim.openstreetmap.org"

    # News / govt schemes
    NEWS_API_KEY: str = ""

    # Auth
    JWT_SECRET: str = "change-this-secret-in-production"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import detect, treatment, voice, feedback, history, government, nearby, chat, weather

app = FastAPI(
    title="Smart Farming Assistant API",
    description="AI-powered crop disease detection, treatment advice, voice assistant, "
    "government scheme summaries, and nearby-expert lookup via Leaflet + OpenStreetMap.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect.router, tags=["Disease Detection"])
app.include_router(treatment.router, tags=["Treatment Recommendation"])
app.include_router(voice.router, tags=["Voice Assistant"])
app.include_router(feedback.router, tags=["Feedback"])
app.include_router(history.router, tags=["Crop History"])
app.include_router(government.router, tags=["Government Notices"])
app.include_router(nearby.router, tags=["Nearby Experts (OpenStreetMap)"])
app.include_router(chat.router, tags=["AI Chatbot"])
app.include_router(weather.router, tags=["Weather"])


@app.get("/")
async def root():
    return {"status": "ok", "message": "Smart Farming Assistant API is running"}

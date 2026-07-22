from google import genai
from google.genai import types
from fastapi import APIRouter, HTTPException

from config import settings
from models import ChatRequest, ChatResponse

router = APIRouter()


client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_CONTEXT = (
    "You are a friendly, knowledgeable agriculture assistant for farmers. "
    "You can answer questions about crop diseases, fertilizers, government schemes, "
    "irrigation, weather, and pest management. Keep answers practical and concise."
)


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Respond in {req.language} language.\n\nFarmer's question: {req.message}",
            config=types.GenerateContentConfig(system_instruction=SYSTEM_CONTEXT),
        )
        return ChatResponse(reply=response.text.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {e}")

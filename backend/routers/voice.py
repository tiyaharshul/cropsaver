from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai

from config import settings

router = APIRouter()

genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)


class VoiceRequest(BaseModel):
    message: str
    language: str = "hi-IN"


@router.post("/voice")
async def voice_assistant(request: VoiceRequest):
    """
    Receives speech converted to text by the browser.
    Gemini generates the farming response.
    The frontend converts the response back to speech.
    """

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    try:
        prompt = f"""
You are CropSaver, a helpful AI farming assistant for Indian farmers.

The farmer may speak in Hindi, English, Hinglish, or another Indian language.

Rules:
- Answer in the same language used by the farmer.
- Use simple and easy-to-understand language.
- Keep answers concise but useful.
- Focus on agriculture and farming.
- You can help with crops, crop diseases, fertilizers, irrigation,
  soil, pests, weather-related farming questions and government
  agriculture schemes.
- If the farmer uses Hinglish, you may respond naturally in Hinglish.
- Do not invent pesticide or fertilizer dosages.
- For potentially dangerous chemicals, recommend following the
  product label or consulting an agricultural expert.
- If symptoms are not enough to confidently identify a crop disease,
  explain that more information or a crop image may be needed.

Farmer's question:
{request.message}
"""

        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = response.text.strip()

        return {
            "question": request.message,
            "answer": answer,
            "language": request.language,
        }

    except Exception as e:
        print(f"Voice assistant error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate a response right now."
        )
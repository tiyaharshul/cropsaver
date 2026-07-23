import base64
import io

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from gtts import gTTS

from config import settings

router = APIRouter()

genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)


class VoiceRequest(BaseModel):
    message: str
    language: str = "Hindi"


# Gemini language name -> gTTS language code.
# Regional languages without a dedicated gTTS voice use Hindi as a fallback.
TTS_LANGUAGE_CODES = {
    "Hindi": "hi",
    "English": "en",
    "Marwari/Rajasthani": "hi",
    "Bhojpuri": "hi",
    "Haryanvi": "hi",
    "Gujarati": "gu",
    "Marathi": "mr",
    "Punjabi": "pa",
    "Bengali": "bn",
    "Tamil": "ta",
    "Telugu": "te",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Odia": "or",
    "Assamese": "as",
}


@router.post("/voice")
async def voice_assistant(request: VoiceRequest):
    """
    Browser converts the farmer's speech to text.
    Gemini creates the farming answer.
    gTTS creates MP3 audio on the backend.
    The frontend receives both text and base64 audio.
    """

    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured."
        )

    try:
        prompt = f"""
You are CropSaver, an AI farming assistant designed for Indian farmers.

The farmer's selected language is:
{request.language}

The farmer said:
{message}

Follow these rules:

1. Understand informal speech, regional dialects, Hindi-English mixed
   language, farming terminology, and small speech-to-text mistakes.

2. Respond primarily in the selected language: {request.language}.

3. For Marwari/Rajasthani, Bhojpuri, or Haryanvi, use simple natural
   regional language that a farmer can understand.

4. Keep the answer concise, practical, and farmer-friendly.

5. Help with crops, diseases, pests, soil, irrigation, fertilizers,
   crop management, weather-related farming decisions, and government
   agriculture schemes.

6. Do not invent pesticide, insecticide, herbicide, or fertilizer
   dosages. For exact chemical dosage, tell the farmer to follow the
   product label or consult a local agricultural expert.

7. Do not make a certain disease diagnosis when the information is
   insufficient. When useful, suggest CropSaver Disease Detection.

8. This answer will be converted directly to speech.
   Return plain text only.

9. Do not use Markdown, asterisks, hashtags, headings, backticks,
   Markdown tables, Markdown links, or unnecessary symbols.

10. Do not unnecessarily switch to English.

Answer the farmer directly.
"""

        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="CropSaver could not generate a response."
            )

        answer_text = response.text.strip()

    except HTTPException:
        raise
    except Exception as e:
        print(f"Gemini error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate a response right now."
        )

    # Generate speech separately so a TTS failure does not lose the text answer.
    audio_b64 = None
    tts_error = None

    try:
        tts_language = TTS_LANGUAGE_CODES.get(request.language, "hi")

        audio_buffer = io.BytesIO()

        tts = gTTS(
            text=answer_text,
            lang=tts_language,
            slow=False,
        )

        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        audio_b64 = base64.b64encode(
            audio_buffer.read()
        ).decode("utf-8")

    except Exception as e:
        print(f"TTS error for {request.language}: {e}")
        tts_error = (
            f"Voice could not be generated for {request.language}, "
            "but the text answer is available."
        )

    return {
        "question": message,
        "answer": answer_text,
        "language": request.language,
        "audio_base64": audio_b64,
        "tts_error": tts_error,
    }

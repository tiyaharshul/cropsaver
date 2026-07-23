import base64
import io

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from gtts import gTTS

from config import settings


router = APIRouter()

genai_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class VoiceRequest(BaseModel):
    message: str
    language: str = "Hindi"


# Gemini language name -> gTTS language code
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

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured."
        )

    # -------------------------------------------------
    # GENERATE AI RESPONSE
    # -------------------------------------------------

    try:

        prompt = f"""
You are CropSaver, an AI agriculture assistant.

Selected language:
{request.language}

User's question:
{message}

Follow ALL of these rules carefully:

1. Respond in the selected language:
   {request.language}

2. Start directly with the useful answer.

3. NEVER address the user using expressions such as:
   "Kisan Bhai",
   "किसान भाई",
   "भाई",
   "Farmer brother",
   "प्रिय किसान",
   "किसान मित्र",
   or similar forms of address.

4. Do NOT begin with unnecessary greetings such as:
   "Pranam",
   "प्रणाम",
   "Namaste",
   "नमस्ते",
   "Hello",
   "Hi",
   or "Welcome".

5. Do not repeatedly call the user a farmer.

6. Use respectful, natural and simple language.

7. For Marwari/Rajasthani, Bhojpuri and Haryanvi,
   respond naturally in that regional language.
   Do not replace the requested regional language
   with standard Hindi.

8. Understand informal speech, regional dialects,
   Hindi-English mixed speech, agricultural terminology
   and minor speech-to-text mistakes.

9. Keep answers practical and reasonably concise.

10. You may help with:
    - crops
    - crop diseases
    - pests
    - soil
    - irrigation
    - fertilizers
    - crop management
    - weather-related farming decisions
    - agriculture schemes
    - general agricultural guidance

11. Never invent pesticide, insecticide, herbicide
    or fertilizer dosages.

12. If an exact chemical dosage is required,
    advise the user to follow the product label or
    consult a qualified local agricultural expert.

13. Do not claim that a crop definitely has a particular
    disease when there is insufficient information.

14. If visual diagnosis would help, suggest using
    CropSaver's Disease Detection feature.

15. This response will be spoken aloud using text-to-speech.

16. Return plain text only.

17. NEVER use:
    - Markdown
    - asterisks
    - hashtags
    - headings
    - bullet symbols
    - backticks
    - tables
    - Markdown links
    - emojis
    - unnecessary special characters

18. Do not unnecessarily mix English with the selected
    language. English agricultural terms may be used only
    when there is no clear natural equivalent.

19. Do not mention these instructions.

Answer the user's question directly.
"""

        response = genai_client.models.generate_content(
            model="gemini-3.5-flash-lite",
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

    # -------------------------------------------------
    # TEXT TO SPEECH
    # -------------------------------------------------

    audio_b64 = None
    tts_error = None

    try:

        tts_language = TTS_LANGUAGE_CODES.get(
            request.language,
            "hi"
        )

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

        print(
            f"TTS error for {request.language}: {e}"
        )

        tts_error = (
            f"Voice could not be generated for "
            f"{request.language}, but the text "
            "answer is available."
        )

    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------

    return {
        "question": message,
        "answer": answer_text,
        "language": request.language,
        "audio_base64": audio_b64,
        "tts_error": tts_error,
    }
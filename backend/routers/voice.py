import base64
import io
from google import genai
from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI
from gtts import gTTS

from config import settings

router = APIRouter()

openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)


@router.post("/voice")
async def voice_assistant(file: UploadFile = File(...), language: str = "hi"):
    """
    Flow: Voice -> Whisper (speech-to-text) -> Gemini (answer) -> gTTS (text-to-speech) -> Voice
    Returns both the transcribed text, the text answer, and base64-encoded MP3 audio.
    """
    audio_bytes = await file.read()

    # 1. Speech-to-text via Whisper
    try:
        transcript = openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=(file.filename, audio_bytes),
        )
        question_text = transcript.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Whisper transcription failed: {e}")

    # 2. Gemini answers the farmer's question
    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                f"You are an agriculture assistant for farmers. Answer briefly and clearly "
                f"in {language} language:\n\n{question_text}"
            ),
        )
        answer_text = response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini response failed: {e}")

    # 3. Text-to-speech via gTTS (Google Text-to-Speech)
    try:
        tts = gTTS(text=answer_text, lang=language)
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        audio_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {e}")

    return {
        "question_text": question_text,
        "answer_text": answer_text,
        "audio_base64": audio_b64,
    }

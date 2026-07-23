import json
from fastapi import APIRouter, HTTPException
from google import genai
from google.genai import types

from config import settings
from models import TreatmentRequest, TreatmentResponse

router = APIRouter()

client = genai.Client(api_key=settings.GEMINI_API_KEY)

PROMPT_TEMPLATE = """
You are an expert agricultural scientist.

A crop image has been analyzed by an AI crop disease detection system.

Crop:
{crop_name}

Disease:
{disease_name}

Confidence:
{confidence}

Generate treatment ONLY as valid JSON.

Required JSON format:

{{
  "explanation": "...",
  "organic_treatment": "...",
  "chemical_treatment": "...",
  "dosage": "...",
  "spray_schedule": "...",
  "recovery_time": "...",
  "prevention": "..."
}}

Do not write markdown.
Do not write ```json.
Return ONLY JSON.
Language: {language}
"""


@router.post("/treatment", response_model=TreatmentResponse)
async def get_treatment(req: TreatmentRequest):

    print("=" * 60)
    print("Treatment Request")
    print(req.model_dump())
    print("=" * 60)

    prompt = PROMPT_TEMPLATE.format(
        crop_name=req.crop_name,
        disease_name=req.disease_name,
        confidence=req.confidence,
        language=req.language,
    )

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        text = response.text.strip()

        print("=" * 60)
        print("Gemini Raw Response")
        print(text)
        print("=" * 60)

        text = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(text)

        return TreatmentResponse(
            explanation=parsed.get(
                "explanation",
                "No explanation available.",
            ),
            organic_treatment=parsed.get(
                "organic_treatment",
                "Not available.",
            ),
            chemical_treatment=parsed.get(
                "chemical_treatment",
                "Not available.",
            ),
            dosage=parsed.get(
                "dosage",
                "Follow product label.",
            ),
            spray_schedule=parsed.get(
                "spray_schedule",
                "Not specified.",
            ),
            recovery_time=parsed.get(
                "recovery_time",
                "Unknown.",
            ),
            prevention=parsed.get(
                "prevention",
                "Maintain good crop hygiene.",
            ),
        )

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini returned invalid JSON: {e}",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini treatment generation failed: {e}",
        )
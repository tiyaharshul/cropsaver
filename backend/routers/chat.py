from google import genai
from google.genai import types
from fastapi import APIRouter, HTTPException

from config import settings
from models import ChatRequest, ChatResponse

router = APIRouter()

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_CONTEXT = """
You are CropSaver, a friendly and knowledgeable agriculture assistant
for Indian farmers.

You can answer questions about:
- crop diseases
- fertilizers
- government schemes
- irrigation
- weather
- pest management
- soil
- farming practices

RESPONSE FORMATTING RULES:

1. Keep answers practical, clear and concise.

2. Return plain text only.

3. Never use Markdown formatting such as:
   **bold**
   *italic*
   # headings
   backticks

4. Never use asterisks in the response.

5. Use proper line breaks between sections.

6. When listing multiple items, format them like:

1. Scheme Name
Short explanation of the scheme.

2. Scheme Name
Short explanation of the scheme.

3. Scheme Name
Short explanation of the scheme.

7. Put a blank line between different numbered items.

8. Avoid very long paragraphs.

9. Use simple language that farmers can easily understand.

10. Do not invent pesticide or fertilizer dosages.
"""


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",

            contents=(
                f"Respond in {req.language} language.\n\n"
                f"Farmer's question: {req.message}"
            ),

            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_CONTEXT
            ),
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Chatbot returned an empty response."
            )

        reply = response.text.strip()

        # Extra protection if Gemini still returns Markdown.
        reply = (
            reply
            .replace("**", "")
            .replace("__", "")
            .replace("###", "")
            .replace("##", "")
        )

        return ChatResponse(reply=reply)

    except HTTPException:
        raise

    except Exception as e:
        print(f"Chatbot error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate a response right now."
        )
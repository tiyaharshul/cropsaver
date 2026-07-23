import httpx
from google import genai
from fastapi import APIRouter, HTTPException, Query

from config import settings
from database import government_notices_collection

router = APIRouter()

genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

NEWS_API_URL = "https://newsapi.org/v2/everything"


LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "raj": "Rajasthani / Marwari",
    "bho": "Bhojpuri",
    "har": "Haryanvi",
    "gu": "Gujarati",
    "mr": "Marathi",
    "pa": "Punjabi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "or": "Odia",
    "as": "Assamese",
}


@router.get("/government-notices")
async def get_government_notices(
    language: str = Query(default="en")
):
    """
    Flow:
    NewsAPI -> agriculture news -> Gemini translates/summarizes
    -> cached per language in MongoDB -> returned to frontend.
    """

    language_name = LANGUAGE_NAMES.get(language, "English")

    # ----------------------------------------
    # Check cache for selected language
    # ----------------------------------------

    cached = (
        await government_notices_collection
        .find({"language": language})
        .sort("_id", -1)
        .to_list(length=10)
    )

    if cached:
        for notice in cached:
            notice["_id"] = str(notice["_id"])

        return {
            "notices": cached,
            "language": language,
        }

    # ----------------------------------------
    # Get agriculture news
    # ----------------------------------------

    params = {
        "q": (
            "India agriculture scheme OR MSP OR subsidy "
            "OR farm loan OR agriculture government"
        ),
        "language": "en",
        "sortBy": "publishedAt",
        "apiKey": settings.NEWS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(
            NEWS_API_URL,
            params=params,
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=resp.status_code,
            detail="News API error",
        )

    articles = resp.json().get("articles", [])[:10]

    notices = []

    # ----------------------------------------
    # Translate + summarize with Gemini
    # ----------------------------------------

    for article in articles:

        title = article.get("title", "")
        description = article.get("description", "") or ""

        try:

            response = genai_client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=f"""
You are an agriculture expert helping Indian farmers.

Translate EVERYTHING into {language_name}.

Requirements:

- Simple words
- No markdown
- No bullets
- No asterisks
- Maximum 2 short sentences
- Farmer friendly

Return exactly:

TITLE:
SUMMARY:

Title:
{title}

Description:
{description}
""",
            )

            generated = response.text.strip()

            translated_title = title
            summary = description

            if "TITLE:" in generated:
                title_part = generated.split(
                    "TITLE:", 1
                )[1]

                if "SUMMARY:" in title_part:
                    translated_title = (
                        title_part
                        .split("SUMMARY:", 1)[0]
                        .strip()
                    )

                    summary = (
                        title_part
                        .split("SUMMARY:", 1)[1]
                        .strip()
                    )

            translated_title = (
                translated_title
                .replace("**", "")
                .replace("*", "")
            )

            summary = (
                summary
                .replace("**", "")
                .replace("*", "")
            )

        except Exception as e:

            print(
                "Gemini government notice error:",
                e,
            )

            translated_title = title
            summary = description

        notice = {
            "title": translated_title,
            "summary": summary,
            "url": article.get("url"),
            "published_at": article.get("publishedAt"),
            "language": language,
        }

        notices.append(notice)

    # ----------------------------------------
    # Cache translated version
    # ----------------------------------------

    if notices:
        await government_notices_collection.insert_many(
            [notice.copy() for notice in notices]
        )

    return {
        "notices": notices,
        "language": language,
    }
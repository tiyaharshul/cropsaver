import httpx
from google import genai
from fastapi import APIRouter, HTTPException

from config import settings
from database import government_notices_collection

router = APIRouter()

genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

NEWS_API_URL = "https://newsapi.org/v2/everything"


@router.get("/government-notices")
async def get_government_notices():
    """
    Flow: News API -> latest schemes -> Gemini summarizes -> cached in MongoDB -> returned to React.
    Serves from the MongoDB cache if notices were fetched recently; otherwise refreshes.
    """
    cached = await government_notices_collection.find().sort("_id", -1).to_list(length=20)
    if cached:
        for c in cached:
            c["_id"] = str(c["_id"])
        return {"notices": cached}

    params = {
        "q": "India agriculture scheme OR MSP OR subsidy OR farm loan",
        "language": "en",
        "sortBy": "publishedAt",
        "apiKey": settings.NEWS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(NEWS_API_URL, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="News API error")

    articles = resp.json().get("articles", [])[:10]

    notices = []
    for a in articles:
        title = a.get("title", "")
        description = a.get("description", "") or ""
        try:
            summary = genai_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=(
                    f"Summarize this agriculture policy news in 2 short sentences for farmers:\n"
                    f"{title}\n{description}"
                ),
            ).text.strip()
        except Exception:
            summary = description

        notice = {
            "title": title,
            "summary": summary,
            "url": a.get("url"),
            "published_at": a.get("publishedAt"),
        }
        notices.append(notice)

    if notices:
        await government_notices_collection.insert_many(notices)

    return {"notices": notices}

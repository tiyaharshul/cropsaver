import re

import httpx

from google import genai

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
)

from config import settings

from database import (
    government_notices_collection,
)


# ======================================================
# ROUTER
# ======================================================

router = APIRouter()


# ======================================================
# GEMINI
# ======================================================

genai_client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# ======================================================
# NEWS API
# ======================================================

NEWS_API_URL = (
    "https://newsapi.org/v2/everything"
)


# ======================================================
# SUPPORTED LANGUAGES
# ======================================================

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


# ======================================================
# FARMER-RELEVANT KEYWORDS
# ======================================================

FARMER_KEYWORDS = [

    # General agriculture
    "agriculture",
    "agricultural",
    "farmer",
    "farmers",
    "farming",
    "farm",
    "crop",
    "crops",

    # Government schemes
    "pm kisan",
    "pm-kisan",
    "pm kisan samman nidhi",

    "pmfby",
    "pradhan mantri fasal bima",
    "fasal bima",
    "crop insurance",

    "kisan credit card",
    "kcc",

    "soil health card",

    "pm kusum",
    "pm-kusum",

    "agriculture scheme",
    "farmer scheme",
    "government scheme",

    # Financial support
    "subsidy",
    "farm subsidy",
    "agriculture subsidy",

    "farm loan",
    "farmer loan",
    "agriculture loan",

    "loan waiver",

    "agriculture credit",

    # MSP / procurement
    "msp",
    "minimum support price",

    "procurement",
    "crop procurement",

    "mandi",
    "mandis",

    "agriculture market",
    "agricultural market",

    "e-nam",
    "enam",

    # Inputs
    "fertilizer",
    "fertiliser",

    "urea",

    "seed",
    "seeds",

    "pesticide",
    "pesticides",

    "insecticide",
    "insecticides",

    # Crop problems
    "crop disease",
    "plant disease",

    "pest",
    "pests",

    "locust",

    "crop damage",
    "crop loss",

    # Weather
    "monsoon",
    "rainfall",

    "drought",

    "flood",

    "heatwave",
    "heat wave",

    "weather advisory",
    "agromet",
    "agrometeorological",

    # Irrigation
    "irrigation",

    "drip irrigation",

    "sprinkler",

    # Agriculture technology
    "farm machinery",

    "agricultural machinery",

    "tractor subsidy",

    "agriculture equipment",

    "farm equipment",

    # Crops
    "wheat",
    "rice",
    "paddy",
    "maize",
    "corn",

    "mustard",
    "cotton",
    "sugarcane",

    "soybean",
    "groundnut",

    "millet",
    "bajra",

    "barley",

    "gram",
    "chickpea",

    "onion",
    "potato",
    "tomato",

    # Institutions
    "ministry of agriculture",

    "agriculture ministry",

    "icar",

    "krishi vigyan kendra",

    "kvk",

    "nabard",

    "food corporation of india",

    "fci",

    # Rural agriculture
    "horticulture",

    "organic farming",

    "natural farming",

    "precision farming",

    "agri",
    "agritech",
]


# ======================================================
# HIGH VALUE FARMER KEYWORDS
#
# Articles containing these are especially useful.
# ======================================================

HIGH_VALUE_KEYWORDS = [

    "pm-kisan",
    "pm kisan",

    "pmfby",
    "fasal bima",

    "crop insurance",

    "kisan credit card",

    "msp",
    "minimum support price",

    "crop procurement",

    "farmer subsidy",
    "farm subsidy",

    "agriculture subsidy",

    "farm loan",
    "farmer loan",

    "crop disease",

    "pest outbreak",

    "weather advisory",

    "agromet",

    "fertilizer subsidy",

    "seed subsidy",

    "irrigation subsidy",

    "tractor subsidy",

    "agriculture scheme",

    "farmer scheme",
]


# ======================================================
# CLEARLY IRRELEVANT TOPICS
# ======================================================

BLOCKED_KEYWORDS = [

    "bollywood",

    "hollywood",

    "movie review",

    "celebrity",

    "film release",

    "box office",

    "cricket",

    "football",

    "ipl",

    "smartphone",

    "iphone",

    "gaming",

    "cryptocurrency",

    "bitcoin",

    "gold smuggling",

    "silver smuggling",

    "fashion",

    "beauty",

    "dating",

    "astrology",

    "horoscope",

    "university admission",

    "postgraduate studies",

    "engineering college",

    "ai hub",

    "artificial intelligence hub",
]


# ======================================================
# NORMALIZE TEXT
# ======================================================

def normalize_text(value):

    if not value:
        return ""

    value = str(value).lower()

    value = re.sub(
        r"\s+",
        " ",
        value,
    )

    return value.strip()


# ======================================================
# CALCULATE FARMER RELEVANCE
# ======================================================

def calculate_farmer_relevance(article):

    title = normalize_text(
        article.get("title")
    )

    description = normalize_text(
        article.get("description")
    )

    content = normalize_text(
        article.get("content")
    )


    combined = (
        f"{title} "
        f"{description} "
        f"{content}"
    )


    # --------------------------------------------------
    # Immediately reject clearly unrelated articles
    # --------------------------------------------------

    for blocked in BLOCKED_KEYWORDS:

        if blocked in combined:

            return 0


    score = 0


    # --------------------------------------------------
    # General farmer/agriculture keywords
    # --------------------------------------------------

    for keyword in FARMER_KEYWORDS:

        if keyword in combined:

            score += 1


    # --------------------------------------------------
    # High-value government/farmer keywords
    # --------------------------------------------------

    for keyword in HIGH_VALUE_KEYWORDS:

        if keyword in combined:

            score += 3


    # --------------------------------------------------
    # Title matches are more important
    # --------------------------------------------------

    for keyword in FARMER_KEYWORDS:

        if keyword in title:

            score += 2


    # --------------------------------------------------
    # Extra importance for farmers
    # --------------------------------------------------

    if (
        "farmer" in combined
        or
        "farmers" in combined
    ):

        score += 3


    # --------------------------------------------------
    # Government + agriculture together
    # --------------------------------------------------

    government_words = [

        "government",

        "ministry",

        "scheme",

        "subsidy",

        "policy",

        "cabinet",

        "minister",
    ]


    agriculture_words = [

        "farmer",

        "farmers",

        "agriculture",

        "agricultural",

        "crop",

        "farming",
    ]


    has_government = any(

        word in combined

        for word in government_words
    )


    has_agriculture = any(

        word in combined

        for word in agriculture_words
    )


    if (
        has_government
        and
        has_agriculture
    ):

        score += 5


    return score


# ======================================================
# CHECK FARMER RELEVANCE
# ======================================================

def is_farmer_relevant(article):

    score = calculate_farmer_relevance(
        article
    )

    # Require meaningful agriculture relevance.
    return score >= 4


# ======================================================
# CLEAN GEMINI OUTPUT
# ======================================================

def clean_generated_text(value):

    if not value:
        return ""

    value = (
        value
        .replace("**", "")
        .replace("*", "")
        .replace("###", "")
    )

    return value.strip()


# ======================================================
# GOVERNMENT NOTICES
# ======================================================

@router.get(
    "/government-notices"
)
async def get_government_notices(

    language: str = Query(
        default="en"
    ),

    state: str = Query(
        default=""
    ),

):
    """
    Farmer-focused government notice flow:

    NewsAPI
        ↓
    Agriculture search
        ↓
    Strict farmer relevance filter
        ↓
    Relevance ranking
        ↓
    Gemini farmer-friendly summary
        ↓
    Translation
        ↓
    MongoDB cache
        ↓
    Frontend
    """


    # ==================================================
    # LANGUAGE
    # ==================================================

    language = (
        language
        .strip()
        .lower()
    )


    language_name = (
        LANGUAGE_NAMES.get(
            language,
            "English",
        )
    )


    state = (
        state.strip()
        if state
        else ""
    )


    # ==================================================
    # CACHE
    # ==================================================

    cache_query = {

        "language":
            language,

        "farmer_focused":
            True,
    }


    # Keep state-specific cache separate

    if state:

        cache_query["state"] = state


    cached = (

        await government_notices_collection

        .find(
            cache_query
        )

        .sort(
            "_id",
            -1,
        )

        .to_list(
            length=10
        )
    )


    if cached:

        for notice in cached:

            notice["_id"] = str(
                notice["_id"]
            )


        return {

            "notices":
                cached,

            "language":
                language,

            "state":
                state,

            "source":
                "cache",
        }


    # ==================================================
    # BUILD NEWS SEARCH
    # ==================================================

    # Search for subjects directly useful to farmers.

    search_query = (
        '"Indian farmers" OR '
        '"agriculture scheme" OR '
        '"farmer scheme" OR '
        '"PM Kisan" OR '
        '"crop insurance" OR '
        '"PMFBY" OR '
        '"minimum support price" OR '
        '"MSP farmers" OR '
        '"agriculture subsidy" OR '
        '"farm subsidy" OR '
        '"Kisan Credit Card" OR '
        '"crop procurement" OR '
        '"agriculture advisory" OR '
        '"crop disease" OR '
        '"pest outbreak" OR '
        '"agriculture weather advisory"'
    )


    # If state is provided, add it to the query.

    if state:

        search_query = (
            f'({search_query}) '
            f'AND "{state}"'
        )


    params = {

        "q":
            search_query,

        "language":
            "en",

        "sortBy":
            "publishedAt",

        "pageSize":
            50,

        "apiKey":
            settings.NEWS_API_KEY,
    }


    # ==================================================
    # FETCH NEWS
    # ==================================================

    try:

        async with httpx.AsyncClient(
            timeout=25
        ) as client:

            resp = await client.get(
                NEWS_API_URL,
                params=params,
            )


    except httpx.RequestError as exc:

        print(
            "News API connection error:",
            exc,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to retrieve "
                "agriculture notices."
            ),
        )


    if resp.status_code != 200:

        print(
            "News API error:",
            resp.text,
        )

        raise HTTPException(
            status_code=resp.status_code,
            detail="News API error",
        )


    articles = (
        resp
        .json()
        .get(
            "articles",
            []
        )
    )


    # ==================================================
    # REMOVE INVALID ARTICLES
    # ==================================================

    valid_articles = []


    for article in articles:

        title = (
            article.get("title")
            or ""
        )


        if not title:

            continue


        # NewsAPI sometimes returns removed articles.

        if (
            title.strip()
            == "[Removed]"
        ):

            continue


        if not article.get("url"):

            continue


        valid_articles.append(
            article
        )


    # ==================================================
    # STRICT FARMER FILTER
    # ==================================================

    farmer_articles = []


    for article in valid_articles:

        score = (
            calculate_farmer_relevance(
                article
            )
        )


        if score >= 4:

            farmer_articles.append(

                (
                    score,
                    article,
                )

            )


    # ==================================================
    # SORT BY FARMER RELEVANCE
    # ==================================================

    farmer_articles.sort(
        key=lambda item: item[0],
        reverse=True,
    )


    # Keep best 10.

    farmer_articles = (
        farmer_articles[:10]
    )


    print("=" * 60)

    print(
        "NEWS ARTICLES RECEIVED:",
        len(articles),
    )

    print(
        "VALID ARTICLES:",
        len(valid_articles),
    )

    print(
        "FARMER RELEVANT ARTICLES:",
        len(farmer_articles),
    )


    for score, article in farmer_articles:

        print(
            f"[Score {score}]",
            article.get(
                "title",
                "",
            ),
        )


    print("=" * 60)


    # ==================================================
    # CREATE FARMER-FRIENDLY NOTICES
    # ==================================================

    notices = []


    for (
        relevance_score,
        article,
    ) in farmer_articles:


        title = (
            article.get("title")
            or ""
        )


        description = (
            article.get(
                "description"
            )
            or ""
        )


        # ----------------------------------------------
        # GEMINI
        # ----------------------------------------------

        try:

            response = (
                genai_client
                .models
                .generate_content(

                    model=(
                        "gemini-3.5-flash-lite"
                    ),

                    contents=f"""
You are Krishay, an agricultural information assistant for Indian farmers.

The following news article has already passed an agriculture relevance filter.

Your job is to rewrite it as a short farmer notice.

Target language:
{language_name}

Farmer state:
{state if state else "India / National"}

ARTICLE TITLE:
{title}

ARTICLE DESCRIPTION:
{description}


STRICT RULES:

1. Write everything in {language_name}.

2. The notice must focus ONLY on information useful to farmers.

3. Explain what the information means for a farmer.

4. Prioritize:
government agriculture schemes,
PM-KISAN,
crop insurance,
MSP,
crop procurement,
farmer subsidies,
agriculture loans,
Kisan Credit Card,
seeds,
fertilizers,
irrigation,
crop diseases,
pest alerts,
weather advisories,
farm machinery,
mandi information,
and government agriculture policies.

5. Do not add information that is not present in the article.

6. Do not invent eligibility, money amounts, deadlines, benefits or government announcements.

7. Use simple farmer-friendly language.

8. Avoid technical or bureaucratic wording.

9. No markdown.

10. No bullets.

11. No asterisks.

12. TITLE should be short.

13. SUMMARY should be maximum two short sentences.

Return EXACTLY:

TITLE:
<farmer-friendly translated title>

SUMMARY:
<farmer-friendly summary>
""",
                )
            )


            generated = (
                response.text.strip()
                if response.text
                else ""
            )


            translated_title = title

            summary = description


            # ------------------------------------------
            # PARSE GEMINI RESPONSE
            # ------------------------------------------

            if (
                "TITLE:"
                in generated
            ):

                title_part = (
                    generated.split(
                        "TITLE:",
                        1,
                    )[1]
                )


                if (
                    "SUMMARY:"
                    in title_part
                ):

                    translated_title = (

                        title_part

                        .split(
                            "SUMMARY:",
                            1,
                        )[0]

                        .strip()
                    )


                    summary = (

                        title_part

                        .split(
                            "SUMMARY:",
                            1,
                        )[1]

                        .strip()
                    )


            translated_title = (
                clean_generated_text(
                    translated_title
                )
            )


            summary = (
                clean_generated_text(
                    summary
                )
            )


        except Exception as exc:

            print(
                "Gemini government "
                "notice error:",
                exc,
            )


            translated_title = title

            summary = description


        # ----------------------------------------------
        # CREATE NOTICE
        # ----------------------------------------------

        notice = {

            "title":
                translated_title,

            "summary":
                summary,

            "url":
                article.get("url"),

            "source":
                (
                    article
                    .get(
                        "source",
                        {}
                    )
                    .get("name")
                ),

            "published_at":
                article.get(
                    "publishedAt"
                ),

            "language":
                language,

            "state":
                state,

            "farmer_focused":
                True,

            "relevance_score":
                relevance_score,
        }


        notices.append(
            notice
        )


    # ==================================================
    # CACHE
    # ==================================================

    if notices:

        try:

            await (
                government_notices_collection
                .insert_many(

                    [
                        notice.copy()
                        for notice
                        in notices
                    ]

                )
            )


        except Exception as exc:

            # Cache failure should not prevent
            # notices from reaching frontend.

            print(
                "Government notice "
                "cache error:",
                exc,
            )


    # ==================================================
    # RESPONSE
    # ==================================================

    return {

        "notices":
            notices,

        "language":
            language,

        "state":
            state,

        "source":
            "news_api",

        "total":
            len(notices),
    }
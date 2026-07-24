import httpx

from fastapi import (
    APIRouter,
    HTTPException,
)

from config import settings


router = APIRouter()


# ======================================================
# OPENWEATHER
# ======================================================

OPENWEATHER_URL = (
    "https://api.openweathermap.org/"
    "data/2.5/weather"
)


# ======================================================
# WEATHER RISK ANALYSIS
# ======================================================

def calculate_crop_risk(
    temperature: float,
    humidity: float,
    rain: float,
    wind_speed: float,
):

    disease_score = 0
    pest_score = 0

    disease_reasons = []
    pest_reasons = []

    recommendations = []


    # ==================================================
    # HUMIDITY
    # ==================================================

    if humidity >= 85:

        disease_score += 3

        disease_reasons.append(
            "Very high humidity can strongly favor "
            "fungal and bacterial crop diseases."
        )

    elif humidity >= 70:

        disease_score += 2

        disease_reasons.append(
            "High humidity may favor fungal disease "
            "development."
        )

    elif humidity >= 60:

        disease_score += 1


    # ==================================================
    # TEMPERATURE
    # ==================================================

    if 18 <= temperature <= 28:

        disease_score += 2

        disease_reasons.append(
            "The current temperature range can support "
            "development of several crop diseases."
        )


    if 20 <= temperature <= 35:

        pest_score += 2

        pest_reasons.append(
            "Warm temperatures may increase activity "
            "of common crop pests."
        )

    elif temperature > 35:

        pest_score += 1

        pest_reasons.append(
            "Hot conditions may increase activity of "
            "some heat-tolerant pests."
        )


    # ==================================================
    # RAIN
    # ==================================================

    if rain >= 5:

        disease_score += 3

        disease_reasons.append(
            "Recent rainfall creates wet conditions "
            "that can increase disease risk."
        )

    elif rain > 0:

        disease_score += 1

        disease_reasons.append(
            "Recent rainfall may increase leaf "
            "wetness and disease pressure."
        )


    # ==================================================
    # HUMID + TEMPERATURE COMBINATION
    # ==================================================

    if (
        humidity >= 75
        and
        18 <= temperature <= 30
    ):

        disease_score += 2

        disease_reasons.append(
            "Warm and humid conditions together are "
            "favorable for many fungal infections."
        )


    # ==================================================
    # PEST CONDITIONS
    # ==================================================

    if (
        humidity >= 55
        and
        20 <= temperature <= 32
    ):

        pest_score += 1

        pest_reasons.append(
            "Warm and moderately humid weather may "
            "support aphids, whiteflies and other "
            "crop pests."
        )


    # ==================================================
    # WIND
    # ==================================================

    if wind_speed >= 8:

        disease_score += 1

        disease_reasons.append(
            "Strong winds may help spread some "
            "airborne plant pathogens."
        )


    # ==================================================
    # CONVERT SCORE TO RISK LEVEL
    # ==================================================

    def get_risk_level(score):

        if score >= 6:
            return "high"

        if score >= 3:
            return "moderate"

        return "low"


    disease_risk = get_risk_level(
        disease_score
    )

    pest_risk = get_risk_level(
        pest_score
    )


    # ==================================================
    # FARMER RECOMMENDATIONS
    # ==================================================

    if disease_risk == "high":

        recommendations.append(
            "Inspect crops closely for spots, lesions, "
            "mildew, wilting or unusual discoloration."
        )

        recommendations.append(
            "Avoid unnecessary overhead irrigation "
            "and prolonged leaf wetness."
        )

    elif disease_risk == "moderate":

        recommendations.append(
            "Monitor leaves regularly for early "
            "disease symptoms."
        )


    if pest_risk == "high":

        recommendations.append(
            "Scout the crop for insects, eggs and "
            "feeding damage."
        )

    elif pest_risk == "moderate":

        recommendations.append(
            "Check the underside of leaves for aphids, "
            "whiteflies and other pests."
        )


    if rain > 0:

        recommendations.append(
            "Avoid spraying immediately before or "
            "during rainfall."
        )


    if wind_speed >= 5:

        recommendations.append(
            "Avoid pesticide spraying during strong "
            "winds to reduce spray drift."
        )


    if (
        disease_risk == "low"
        and
        pest_risk == "low"
    ):

        recommendations.append(
            "Current weather conditions indicate "
            "relatively low immediate crop risk. "
            "Continue regular monitoring."
        )


    return {
        "disease_risk": disease_risk,
        "disease_score": disease_score,

        "pest_risk": pest_risk,
        "pest_score": pest_score,

        "disease_reasons":
            disease_reasons,

        "pest_reasons":
            pest_reasons,

        "recommendations":
            recommendations,
    }


# ======================================================
# WEATHER ENDPOINT
# ======================================================

@router.get("/weather")
async def get_weather(
    lat: float,
    lon: float,
):

    """
    Returns current weather together with
    agricultural disease and pest risk analysis.
    """

    params = {
        "lat": lat,
        "lon": lon,
        "appid":
            settings.OPENWEATHER_API_KEY,
        "units": "metric",
    }


    # ==================================================
    # CALL OPENWEATHER
    # ==================================================

    try:

        async with httpx.AsyncClient(
            timeout=15
        ) as client:

            resp = await client.get(
                OPENWEATHER_URL,
                params=params,
            )

    except httpx.RequestError as e:

        raise HTTPException(
            status_code=503,
            detail=(
                "Could not connect to "
                f"OpenWeather: {e}"
            ),
        )


    # ==================================================
    # API ERROR
    # ==================================================

    if resp.status_code != 200:

        try:

            api_error = (
                resp.json().get(
                    "message"
                )
            )

        except Exception:

            api_error = (
                "OpenWeather API error"
            )


        raise HTTPException(
            status_code=resp.status_code,
            detail=api_error,
        )


    # ==================================================
    # WEATHER DATA
    # ==================================================

    data = resp.json()


    main = data.get(
        "main",
        {}
    )

    weather_list = data.get(
        "weather",
        []
    )

    wind = data.get(
        "wind",
        {}
    )

    rain_data = data.get(
        "rain",
        {}
    )


    temperature = float(
        main.get(
            "temp",
            0
        )
    )

    humidity = float(
        main.get(
            "humidity",
            0
        )
    )

    wind_speed = float(
        wind.get(
            "speed",
            0
        )
    )

    rain = float(
        rain_data.get(
            "1h",
            0
        )
    )


    condition = (
        weather_list[0].get(
            "description",
            "Unknown"
        )
        if weather_list
        else "Unknown"
    )


    # ==================================================
    # AGRICULTURAL RISK ANALYSIS
    # ==================================================

    risk = calculate_crop_risk(
        temperature=temperature,
        humidity=humidity,
        rain=rain,
        wind_speed=wind_speed,
    )


    # ==================================================
    # RESPONSE
    # ==================================================

    return {

        "location": {
            "name":
                data.get(
                    "name",
                    ""
                ),

            "country":
                data.get(
                    "sys",
                    {}
                ).get(
                    "country",
                    ""
                ),
        },


        "weather": {

            "temperature_c":
                temperature,

            "feels_like_c":
                main.get(
                    "feels_like"
                ),

            "humidity_pct":
                humidity,

            "condition":
                condition,

            "wind_speed_mps":
                wind_speed,

            "rain_last_hour_mm":
                rain,
        },


        "agricultural_risk": {

            "disease": {
                "level":
                    risk[
                        "disease_risk"
                    ],

                "score":
                    risk[
                        "disease_score"
                    ],

                "reasons":
                    risk[
                        "disease_reasons"
                    ],
            },


            "pest": {
                "level":
                    risk[
                        "pest_risk"
                    ],

                "score":
                    risk[
                        "pest_score"
                    ],

                "reasons":
                    risk[
                        "pest_reasons"
                    ],
            },


            "recommendations":
                risk[
                    "recommendations"
                ],
        },
    }
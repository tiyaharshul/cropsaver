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
            "veryHighHumidityDisease"
        )

    elif humidity >= 70:

        disease_score += 2

        disease_reasons.append(
            "highHumidityDisease"
        )

    elif humidity >= 60:

        disease_score += 1


    # ==================================================
    # TEMPERATURE
    # ==================================================

    if 18 <= temperature <= 28:

        disease_score += 2

        disease_reasons.append(
            "temperatureDiseaseRisk"
        )


    if 20 <= temperature <= 35:

        pest_score += 2

        pest_reasons.append(
            "warmTemperaturePest"
        )

    elif temperature > 35:

        pest_score += 1

        pest_reasons.append(
            "hotTemperaturePest"
        )


    # ==================================================
    # RAIN
    # ==================================================

    if rain >= 5:

        disease_score += 3

        disease_reasons.append(
            "heavyRainDisease"
        )

    elif rain > 0:

        disease_score += 1

        disease_reasons.append(
            "recentRainDisease"
        )


    # ==================================================
    # HUMIDITY + TEMPERATURE
    # ==================================================

    if (
        humidity >= 75
        and
        18 <= temperature <= 30
    ):

        disease_score += 2

        disease_reasons.append(
            "warmHumidFungalRisk"
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
            "warmHumidPestRisk"
        )


    # ==================================================
    # WIND
    # ==================================================

    if wind_speed >= 8:

        disease_score += 1

        disease_reasons.append(
            "strongWindDiseaseRisk"
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
            "inspectCropDisease"
        )

        recommendations.append(
            "avoidOverheadIrrigation"
        )

    elif disease_risk == "moderate":

        recommendations.append(
            "monitorDiseaseSymptoms"
        )


    if pest_risk == "high":

        recommendations.append(
            "scoutCropPests"
        )

    elif pest_risk == "moderate":

        recommendations.append(
            "checkLeafUnderside"
        )


    if rain > 0:

        recommendations.append(
            "avoidSprayingRain"
        )


    if wind_speed >= 5:

        recommendations.append(
            "avoidSprayingWind"
        )


    if (
        disease_risk == "low"
        and
        pest_risk == "low"
    ):

        recommendations.append(
            "lowWeatherRisk"
        )


    return {

        "disease_risk":
            disease_risk,

        "disease_score":
            disease_score,

        "pest_risk":
            pest_risk,

        "pest_score":
            pest_score,

        "disease_reasons":
            disease_reasons,

        "pest_reasons":
            pest_reasons,

        "recommendations":
            recommendations,
    }


# ======================================================
# WEATHER ALERTS
# ======================================================

def calculate_weather_alerts(
    temperature: float,
    humidity: float,
    rain: float,
    wind_speed: float,
):

    alerts = []


    # ==================================================
    # RAIN
    # ==================================================

    if rain >= 7.5:

        alerts.append({
            "type": "heavy_rain",
            "level": "high",
            "icon": "🌧️",
            "title_key":
                "weatherAlertHeavyRainTitle",
            "message_key":
                "weatherAlertHeavyRainMessage",
        })

    elif rain >= 2.5:

        alerts.append({
            "type": "rain",
            "level": "moderate",
            "icon": "🌦️",
            "title_key":
                "weatherAlertRainTitle",
            "message_key":
                "weatherAlertRainMessage",
        })


    # ==================================================
    # HEAT
    # ==================================================

    if temperature >= 40:

        alerts.append({
            "type": "extreme_heat",
            "level": "high",
            "icon": "🔥",
            "title_key":
                "weatherAlertExtremeHeatTitle",
            "message_key":
                "weatherAlertExtremeHeatMessage",
        })

    elif temperature >= 35:

        alerts.append({
            "type": "heat",
            "level": "moderate",
            "icon": "🌡️",
            "title_key":
                "weatherAlertHeatTitle",
            "message_key":
                "weatherAlertHeatMessage",
        })


    # ==================================================
    # COLD / FROST
    # ==================================================

    if temperature <= 2:

        alerts.append({
            "type": "frost",
            "level": "high",
            "icon": "❄️",
            "title_key":
                "weatherAlertFrostTitle",
            "message_key":
                "weatherAlertFrostMessage",
        })

    elif temperature <= 7:

        alerts.append({
            "type": "cold",
            "level": "moderate",
            "icon": "🥶",
            "title_key":
                "weatherAlertColdTitle",
            "message_key":
                "weatherAlertColdMessage",
        })


    # ==================================================
    # WIND
    # ==================================================

    if wind_speed >= 10:

        alerts.append({
            "type": "strong_wind",
            "level": "high",
            "icon": "💨",
            "title_key":
                "weatherAlertStrongWindTitle",
            "message_key":
                "weatherAlertStrongWindMessage",
        })

    elif wind_speed >= 6:

        alerts.append({
            "type": "wind",
            "level": "moderate",
            "icon": "🌬️",
            "title_key":
                "weatherAlertWindTitle",
            "message_key":
                "weatherAlertWindMessage",
        })


    # ==================================================
    # HUMIDITY
    # ==================================================

    if humidity >= 90:

        alerts.append({
            "type": "humidity",
            "level": "moderate",
            "icon": "💧",
            "title_key":
                "weatherAlertHumidityTitle",
            "message_key":
                "weatherAlertHumidityMessage",
        })


    # ==================================================
    # SAFE CONDITIONS
    # ==================================================

    if not alerts:

        alerts.append({
            "type": "safe",
            "level": "low",
            "icon": "✅",
            "title_key":
                "weatherAlertSafeTitle",
            "message_key":
                "weatherAlertSafeMessage",
        })


    return alerts


# ======================================================
# WEATHER CONDITION KEY
# ======================================================

def get_weather_condition_key(
    condition: str,
):

    condition = (
        condition
        .strip()
        .lower()
    )


    condition_map = {

        "clear sky":
            "weatherClearSky",

        "few clouds":
            "weatherFewClouds",

        "scattered clouds":
            "weatherScatteredClouds",

        "broken clouds":
            "weatherBrokenClouds",

        "overcast clouds":
            "weatherOvercastClouds",

        "light rain":
            "weatherLightRain",

        "moderate rain":
            "weatherModerateRain",

        "heavy intensity rain":
            "weatherHeavyRain",

        "very heavy rain":
            "weatherVeryHeavyRain",

        "extreme rain":
            "weatherExtremeRain",

        "shower rain":
            "weatherShowerRain",

        "light intensity shower rain":
            "weatherLightShowerRain",

        "thunderstorm":
            "weatherThunderstorm",

        "thunderstorm with rain":
            "weatherThunderstormRain",

        "thunderstorm with light rain":
            "weatherThunderstormLightRain",

        "mist":
            "weatherMist",

        "fog":
            "weatherFog",

        "haze":
            "weatherHaze",

        "smoke":
            "weatherSmoke",

        "dust":
            "weatherDust",
    }


    return condition_map.get(
        condition,
        "weatherUnknown"
    )


# ======================================================
# WEATHER ENDPOINT
# ======================================================

@router.get("/weather")
async def get_weather(
    lat: float,
    lon: float,
):

    """
    Returns current weather,
    agricultural disease/pest risk,
    recommendations,
    and farmer weather alerts.
    """


    params = {

        "lat":
            lat,

        "lon":
            lon,

        "appid":
            settings.OPENWEATHER_API_KEY,

        "units":
            "metric",
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


    # ==================================================
    # NORMALIZE VALUES
    # ==================================================

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


    # ==================================================
    # WEATHER CONDITION
    # ==================================================

    condition = (

        weather_list[0].get(
            "description",
            "Unknown"
        )

        if weather_list

        else "Unknown"
    )


    condition_key = (
        get_weather_condition_key(
            condition
        )
    )


    # ==================================================
    # AGRICULTURAL RISK
    # ==================================================

    risk = calculate_crop_risk(

        temperature=temperature,

        humidity=humidity,

        rain=rain,

        wind_speed=wind_speed,
    )


    # ==================================================
    # WEATHER ALERTS
    # ==================================================

    weather_alerts = (
        calculate_weather_alerts(

            temperature=temperature,

            humidity=humidity,

            rain=rain,

            wind_speed=wind_speed,
        )
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

            "condition_key":
                condition_key,

            "wind_speed_mps":
                wind_speed,

            "rain_last_hour_mm":
                rain,
        },


        "weather_alerts":
            weather_alerts,


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
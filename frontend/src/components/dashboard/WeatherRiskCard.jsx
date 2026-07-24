import {
  useEffect,
  useState,
} from 'react'

import api from '../../api/axios'
import { useLanguage } from '../../contexts/LanguageContext'


export default function WeatherRiskCard() {
  const { t } = useLanguage()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    let active = true

    const loadWeather = () => {
      if (!navigator.geolocation) {
        if (active) {
          setError(
            t.geolocationUnsupported ||
            'Location is not supported by your browser.'
          )
          setLoading(false)
        }

        return
      }


      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat =
              position.coords.latitude

            const lon =
              position.coords.longitude


            const response = await api.get(
              '/weather',
              {
                params: {
                  lat,
                  lon,
                },
              }
            )


            if (active) {
              setData(response.data)
              setError('')
            }

          } catch (err) {
            console.error(
              'Weather error:',
              err
            )

            if (active) {
              setError(
                err.response?.data?.detail ||
                t.weatherLoadError ||
                'Could not load weather information.'
              )
            }

          } finally {
            if (active) {
              setLoading(false)
            }
          }
        },

        (geoError) => {
          console.error(
            'Location error:',
            geoError
          )

          if (active) {
            setError(
              t.locationError ||
              'Please allow location access to view crop weather risks.'
            )

            setLoading(false)
          }
        },

        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      )
    }


    loadWeather()


    return () => {
      active = false
    }
  }, [
    t.geolocationUnsupported,
    t.locationError,
    t.weatherLoadError,
  ])


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <section className="weather-risk-card weather-loading">

        <div className="weather-loader" />

        <div>
          <strong>
            {t.checkingCropWeather ||
              'Checking crop weather...'}
          </strong>

          <p>
            {t.analyzingWeatherRisk ||
              'Analyzing local disease and pest conditions'}
          </p>
        </div>

      </section>
    )
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <section className="weather-risk-card weather-error">

        <div className="weather-error-icon">
          🌦️
        </div>

        <div>
          <strong>
            {t.weatherUnavailable ||
              'Weather risk unavailable'}
          </strong>

          <p>{error}</p>
        </div>

      </section>
    )
  }


  if (!data) {
    return null
  }


  const weather = data.weather || {}

  const agriculturalRisk =
    data.agricultural_risk || {}

  const disease =
    agriculturalRisk.disease || {}

  const pest =
    agriculturalRisk.pest || {}

  const recommendations =
    agriculturalRisk.recommendations || []

  const location =
    data.location || {}


  return (
    <section className="weather-risk-card">

      {/* HEADER */}

      <div className="weather-risk-header">

        <div>

          <span className="section-label">
            🌦️{' '}
            {t.cropWeatherAlert ||
              'CROP WEATHER ALERT'}
          </span>

          <h2>
            {t.weatherCropRisk ||
              'Weather & Crop Risk'}
          </h2>

          <p>
            {t.weatherRiskDescription ||
              'Live agricultural risk analysis based on your local weather conditions.'}
          </p>

        </div>


        {(location.name ||
          location.country) && (

          <div className="weather-location">

            <span>📍</span>

            <span>
              {location.name}

              {location.name &&
                location.country &&
                ', '}

              {location.country}
            </span>

          </div>

        )}

      </div>


      {/* WEATHER METRICS */}

      <div className="weather-metrics">

        <WeatherMetric
          icon="🌡️"
          value={
            weather.temperature_c != null
              ? `${Number(
                  weather.temperature_c
                ).toFixed(1)}°C`
              : '--'
          }
          label={
            t.temperature ||
            'Temperature'
          }
        />


        <WeatherMetric
          icon="💧"
          value={
            weather.humidity_pct != null
              ? `${Number(
                  weather.humidity_pct
                ).toFixed(0)}%`
              : '--'
          }
          label={
            t.humidity ||
            'Humidity'
          }
        />


        <WeatherMetric
          icon="🌧️"
          value={
            weather.rain_last_hour_mm != null
              ? `${Number(
                  weather.rain_last_hour_mm
                ).toFixed(2)} mm`
              : '--'
          }
          label={
            t.recentRain ||
            'Recent Rain'
          }
        />


        <WeatherMetric
          icon="💨"
          value={
            weather.wind_speed_mps != null
              ? `${Number(
                  weather.wind_speed_mps
                ).toFixed(1)} m/s`
              : '--'
          }
          label={
            t.windSpeed ||
            'Wind Speed'
          }
        />

      </div>


      {/* WEATHER CONDITION */}

      {weather.condition && (

        <div className="weather-condition">

          <span>☁️</span>

          <span>
            {weather.condition}
          </span>

        </div>

      )}


      {/* RISK CARDS */}

      <div className="weather-risk-grid">

        <RiskBox
          icon="🦠"
          title={
            t.diseaseRisk ||
            'Disease Risk'
          }
          risk={disease.level}
          reasons={disease.reasons}
          t={t}
        />


        <RiskBox
          icon="🐛"
          title={
            t.pestRisk ||
            'Pest Risk'
          }
          risk={pest.level}
          reasons={pest.reasons}
          t={t}
        />

      </div>


      {/* RECOMMENDATIONS */}

      {recommendations.length > 0 && (

        <div className="weather-recommendations">

          <div className="weather-recommendations-heading">

            <span>🌱</span>

            <h3>
              {t.recommendedActions ||
                'Recommended Actions'}
            </h3>

          </div>


          <div className="weather-recommendations-list">

            {recommendations.map(
              (recommendation, index) => (

                <div
                  key={index}
                  className="weather-recommendation"
                >

                  <span className="weather-check">
                    ✓
                  </span>

                  <p>
                    {recommendation}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </section>
  )
}


// ======================================================
// WEATHER METRIC
// ======================================================

function WeatherMetric({
  icon,
  value,
  label,
}) {
  return (
    <div className="weather-metric">

      <span className="weather-metric-icon">
        {icon}
      </span>

      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>
  )
}


// ======================================================
// RISK BOX
// ======================================================

function RiskBox({
  icon,
  title,
  risk,
  reasons = [],
  t,
}) {

  const normalizedRisk =
    String(risk || 'low')
      .toLowerCase()


  const getRiskLabel = () => {

    if (normalizedRisk === 'high') {
      return t.highRisk || 'High'
    }

    if (normalizedRisk === 'moderate') {
      return t.moderateRisk || 'Moderate'
    }

    return t.lowRisk || 'Low'
  }


  return (
    <div
      className={
        `weather-risk-box risk-${normalizedRisk}`
      }
    >

      <div className="weather-risk-box-header">

        <div className="weather-risk-title">

          <span>
            {icon}
          </span>

          <h3>
            {title}
          </h3>

        </div>


        <span
          className={
            `weather-risk-badge risk-${normalizedRisk}`
          }
        >
          {getRiskLabel()}
        </span>

      </div>


      {reasons.length > 0 ? (

        <ul className="weather-risk-reasons">

          {reasons.map(
            (reason, index) => (

              <li key={index}>
                {reason}
              </li>

            )
          )}

        </ul>

      ) : (

        <p className="weather-no-risk">

          {t.noMajorWeatherRisk ||
            'No major weather-related risk detected.'}

        </p>

      )}

    </div>
  )
}
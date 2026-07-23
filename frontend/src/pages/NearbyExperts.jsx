import { useEffect, useState } from 'react'
import api from '../api/axios'
import NearbyExpertsMap from '../components/NearbyExpertsMap.jsx'
import { useLanguage } from '../contexts/LanguageContext'

export default function NearbyExperts() {
  const { t } = useLanguage()

  const [position, setPosition] = useState(null)
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(t.geolocationUnsupported)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        setError(t.locationError)
      }
    )
  }, [t.geolocationUnsupported, t.locationError])

  useEffect(() => {
    if (!position) return

    setLoading(true)
    setError(null)

    api
      .get('/nearby-centers', {
        params: {
          lat: position.lat,
          lon: position.lon,
        },
      })
      .then((res) => {
        setCenters(res.data.centers || [])
      })
      .catch((err) => {
        console.error(err)

        const detail =
          err.response?.data?.detail

        setError(
          typeof detail === 'string'
            ? detail
            : t.nearbyFetchError
        )
      })
      .finally(() => {
        setLoading(false)
      })

  }, [position, t.nearbyFetchError])

  return (
    <div className="nearby-page">

      {/* PAGE HEADER */}
      <div className="nearby-header">

        <div>

          <span className="page-section-label">
            📍 {t.farmSupport}
          </span>

          <h1>
            {t.nearbyAgricultureExperts}
          </h1>

          <p>
            {t.nearbyDescription}
          </p>

        </div>

        {position && (
          <div className="location-active">

            <span className="location-active-dot"></span>

            {t.locationDetected}

          </div>
        )}

      </div>

      {/* ERROR */}
      {error && (
        <div className="nearby-error">

          <span>!</span>

          <p>
            {error}
          </p>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="nearby-loading">

          <div className="nearby-loader"></div>

          <span>
            {t.loadingCenters}
          </span>

        </div>
      )}

      {/* MAP */}
      {position && (
        <div className="nearby-map-card">

          <div className="nearby-map-header">

            <div>

              <span className="nearby-map-label">
                {t.yourArea}
              </span>

              <h2>
                {t.agricultureServicesNearYou}
              </h2>

            </div>

            {centers.length > 0 && (
              <span className="nearby-count">

                {centers.length}{' '}

                {centers.length === 1
                  ? t.location
                  : t.locations}

              </span>
            )}

          </div>

          <div className="nearby-map-wrapper">

            <NearbyExpertsMap
              userLat={position.lat}
              userLon={position.lon}
              centers={centers}
            />

          </div>

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        position &&
        centers.length === 0 && (
          <div className="nearby-empty">

            <span>
              📍
            </span>

            <div>

              <h3>
                {t.noCentersNearby}
              </h3>

              <p>
                {t.noCenters}
              </p>

            </div>

          </div>
        )}

      {/* CENTERS */}
      {centers.length > 0 && (
        <div className="nearby-results">

          <div className="nearby-results-heading">

            <div>

              <span className="page-section-label">
                {t.nearbyLocations}
              </span>

              <h2>
                {t.agricultureSupportCenters}
              </h2>

            </div>

          </div>

          <div className="nearby-centers-grid">

            {centers.map((center, index) => (
              <div
                key={index}
                className="nearby-center-card"
              >

                <div className="nearby-center-icon">
                  🌾
                </div>

                <div className="nearby-center-content">

                  <h3>
                    {center.name}
                  </h3>

                  <span className="nearby-category">
                    {center.category}
                  </span>

                  {center.address && (
                    <p className="nearby-address">
                      📍 {center.address}
                    </p>
                  )}

                </div>

                <div className="nearby-distance">

                  <strong>
                    {center.distance_km}
                  </strong>

                  <span>
                    {t.kmAway}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  )
}
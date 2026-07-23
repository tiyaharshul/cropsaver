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
        setCenters(
          res.data.centers || []
        )
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
    <div className="space-y-4">

      <h1 className="text-2xl font-bold text-leaf-700">
        {t.nearbyAgricultureExperts}
      </h1>

      <p className="text-sm text-gray-600">
        {t.nearbyDescription}
      </p>

      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {loading && (
        <p>{t.loadingCenters}</p>
      )}

      {!loading &&
        !error &&
        position &&
        centers.length === 0 && (
          <p className="text-gray-500">
            {t.noCenters}
          </p>
        )}

      {position && (
        <NearbyExpertsMap
          userLat={position.lat}
          userLon={position.lon}
          centers={centers}
        />
      )}

      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">

        {centers.map((center, index) => (
          <li
            key={index}
            className="p-3 flex justify-between items-center"
          >

            <div>
              <p className="font-medium">
                {center.name}
              </p>

              <p className="text-xs text-gray-500">
                {center.category}

                {center.address
                  ? ` · ${center.address}`
                  : ''}
              </p>
            </div>

            <span className="text-sm text-leaf-700 font-semibold">
              {center.distance_km} km
            </span>

          </li>
        ))}

      </ul>

    </div>
  )
}
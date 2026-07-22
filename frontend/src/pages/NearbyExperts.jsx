import { useEffect, useState } from 'react'
import api from '../api/axios'
import NearbyExpertsMap from '../components/NearbyExpertsMap.jsx'

export default function NearbyExperts() {
  const [position, setPosition] = useState(null)
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => setError('Could not get your location. Please allow location access.')
    )
  }, [])

  useEffect(() => {
    if (!position) return;

    setLoading(true);

    api
        .get("/nearby-centers", {
            params: {
                lat: position.lat,
                lon: position.lon,
            },
        })
        .then((res) => {
            setCenters(res.data.centers);
        })
        .catch((err) => {
            console.error(err);

            const detail = err.response?.data?.detail;

            setError(
                typeof detail === "string"
                    ? detail
                    : "Failed to fetch nearby centers."
            );
        })
        .finally(() => setLoading(false));

}, [position]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-leaf-700">Nearby Agriculture Experts</h1>
      <p className="text-sm text-gray-600">
        Powered by OpenStreetMap — showing Krishi Vigyan Kendras, agriculture offices, soil labs,
        and fertilizer shops near you.
      </p>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading nearby centers...</p>}
      {!loading && !error && position && centers.length === 0 && (
        <p className="text-gray-500">
          No agriculture centers found in OpenStreetMap data within range of your location yet.
          OSM coverage for these categories can be sparse in some areas — try increasing the
          search radius or check back later as OSM data is community-contributed.
        </p>
      )}

      {position && (
        <NearbyExpertsMap userLat={position.lat} userLon={position.lon} centers={centers} />
      )}

      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
        {centers.map((c, idx) => (
          <li key={idx} className="p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">
                {c.category} {c.address ? `· ${c.address}` : ''}
              </p>
            </div>
            <span className="text-sm text-leaf-700 font-semibold">{c.distance_km} km</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
 
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'


// ======================================================
// LEAFLET DEFAULT MARKER FIX
// ======================================================

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})


// ======================================================
// KEEP MAP CENTERED ON USER
// ======================================================

function Recenter({ lat, lon }) {
  const map = useMap()

  useEffect(() => {
    if (!lat || !lon) return

    // Keep map focused around the user's city.
    // DO NOT fit bounds using all expert markers.
    map.setView([lat, lon], 12)
  }, [lat, lon, map])

  return null
}


// ======================================================
// MAP
// ======================================================

export default function NearbyExpertsMap({
  userLat,
  userLon,
  centers = [],
}) {

  // Only show markers that are reasonably near the user.
  // This prevents 600–2000 km away results from ruining the map.
  const nearbyCenters = centers.filter((center) => {
    const distance = Number(center.distance_km)

    return (
      Number.isFinite(distance) &&
      distance <= 100 &&
      Number.isFinite(Number(center.latitude)) &&
      Number.isFinite(Number(center.longitude))
    )
  })


  return (
    <div
      style={{
        width: '100%',
        height: '445px',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >

      <MapContainer
        center={[userLat, userLon]}
        zoom={12}
        scrollWheelZoom={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      >

        {/* OPENSTREETMAP */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* KEEP MAP ON USER */}

        <Recenter
          lat={userLat}
          lon={userLon}
        />


        {/* USER LOCATION */}

        <Marker
          position={[
            Number(userLat),
            Number(userLon),
          ]}
        >
          <Popup>
            <strong>📍 You are here</strong>
          </Popup>
        </Marker>


        {/* NEARBY EXPERT MARKERS ONLY */}

        {nearbyCenters.map((center, index) => (

          <Marker
            key={
              center.id ||
              `${center.latitude}-${center.longitude}-${index}`
            }
            position={[
              Number(center.latitude),
              Number(center.longitude),
            ]}
          >

            <Popup>

              <strong>
                {center.name}
              </strong>

              <br />

              {center.category}

              {center.address && (
                <>
                  <br />
                  {center.address}
                </>
              )}

              {center.distance_km != null && (
                <>
                  <br />
                  <strong>
                    {center.distance_km} km away
                  </strong>
                </>
              )}

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>
  )
}
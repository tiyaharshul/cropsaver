import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const categoryColor = {
  KVK: 'green',
  'Agriculture Office': 'blue',
  'Soil Lab': 'orange',
  'Fertilizer Shop': 'violet',
}

function Recenter({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], map.getZoom())
  }, [lat, lon])
  return null
}


export default function NearbyExpertsMap({ userLat, userLon, centers = [] }) {
  return (
    <MapContainer
      center={[userLat, userLon]}
      zoom={12}
      scrollWheelZoom={true}
      className="leaflet-container"
    >
      {/* OpenStreetMap tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={userLat} lon={userLon} />

      <Marker position={[userLat, userLon]}>
        <Popup>You are here</Popup>
      </Marker>

      {centers.map((c, idx) => (
        <Marker key={idx} position={[c.latitude, c.longitude]}>
          <Popup>
            <strong>{c.name}</strong>
            <br />
            {c.category}
            <br />
            {c.address && (
              <>
                {c.address}
                <br />
              </>
            )}
            {c.distance_km != null && <>{c.distance_km} km away</>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

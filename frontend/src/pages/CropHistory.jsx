import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function CropHistory() {
  const [items, setItems] = useState([])
  const userId = localStorage.getItem('user_name') || 'anonymous'

  useEffect(() => {
    api.get('/history', { params: { user_id: userId } }).then((res) => setItems(res.data.history))
  }, [userId])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-leaf-700">Crop Health History</h1>
      {items.length === 0 && <p className="text-gray-600">No history yet — try Disease Detection first.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4">
            {item.image_url && (
              <img src={item.image_url} alt={item.disease_name} className="rounded-lg mb-2 max-h-40 w-full object-cover" />
            )}
            <p><strong>Crop:</strong> {item.crop_name}</p>
            <p><strong>Disease:</strong> {item.disease_name}</p>
            <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

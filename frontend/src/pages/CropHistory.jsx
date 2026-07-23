import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function CropHistory() {
  const [items, setItems] = useState([])
  const { t } = useLanguage()

  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || 'null'
  )

  const userId =
    user?.id ||
    localStorage.getItem('user_name') ||
    'anonymous'

  useEffect(() => {
    api
      .get('/history', {
        params: {
          user_id: userId,
        },
      })
      .then((res) => {
        setItems(
          res.data.history || []
        )
      })
      .catch((error) => {
        console.error(error)
      })
  }, [userId])

  return (
    <div className="space-y-4">

      <h1 className="text-2xl font-bold text-leaf-700">
        {t.cropHealthHistory}
      </h1>

      {items.length === 0 && (
        <p className="text-gray-600">
          {t.noHistory}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow p-4"
          >

            {item.image_url && (
              <img
                src={item.image_url}
                alt=""
                className="rounded-lg mb-2 max-h-40 w-full object-cover"
              />
            )}

            <p>
              <strong>{t.crop}:</strong>{' '}
              {item.crop_name}
            </p>

            <p>
              <strong>{t.disease}:</strong>{' '}
              {item.disease_name}
            </p>

            <p>
              <strong>{t.confidence}:</strong>{' '}
              {(item.confidence * 100).toFixed(1)}%
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}
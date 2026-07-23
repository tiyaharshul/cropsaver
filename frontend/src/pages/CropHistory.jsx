import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
        setItems(res.data.history || [])
      })
      .catch((error) => {
        console.error(error)
      })
  }, [userId])

  return (
    <div className="history-page">

      {/* PAGE HEADER */}
      <div className="history-header">

        <span className="page-section-label">
          🌿 {t.cropHealthLabel}
        </span>

        <h1>
          {t.cropHealthHistory}
        </h1>

        <p>
          {t.historyDescription}
        </p>

      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="history-empty">

          <div className="history-empty-icon">
            🌱
          </div>

          <h2>
            {t.noCropDiagnoses}
          </h2>

          <p>
            {t.noHistory}
          </p>

          <Link
            to="/detect"
            className="history-empty-button"
          >
            <span>✦</span>
            {t.detectCropDisease}
          </Link>

        </div>
      )}

      {/* HISTORY GRID */}
      {items.length > 0 && (
        <div className="history-grid">

          {items.map((item) => (
            <div
              key={item._id}
              className="history-card"
            >

              {/* IMAGE */}
              {item.image_url ? (
                <div className="history-image-wrapper">

                  <img
                    src={item.image_url}
                    alt={item.crop_name || ''}
                    className="history-image"
                  />

                  <span className="history-status">
                    ✓ {t.analyzed}
                  </span>

                </div>
              ) : (
                <div className="history-image-placeholder">
                  🌿
                </div>
              )}

              {/* CONTENT */}
              <div className="history-card-content">

                <span className="history-card-label">
                  {t.cropDiagnosis}
                </span>

                <h2>
                  {item.crop_name}
                </h2>

                <div className="history-info">

                  <div className="history-info-row">
                    <span>
                      {t.disease}
                    </span>

                    <strong>
                      {item.disease_name}
                    </strong>
                  </div>

                  <div className="history-info-row">
                    <span>
                      {t.confidence}
                    </span>

                    <strong className="history-confidence">
                      {(item.confidence * 100).toFixed(1)}%
                    </strong>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}
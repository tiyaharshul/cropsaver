import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function GovernmentNoticeBoard() {

  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { language, t } = useLanguage()

  useEffect(() => {

    setLoading(true)
    setError('')

    api
      .get('/government-notices', {
        params: {
          language: language,
        },
      })
      .then((res) => {

        setNotices(
          res.data.notices || []
        )

      })
      .catch((err) => {

        console.error(err)

        setError(
          err.response?.data?.detail ||
          t.noticesError
        )

      })
      .finally(() => {

        setLoading(false)

      })

  }, [language, t.noticesError])


  return (

    <div className="notices-page">

      {/* PAGE HEADER */}
      <div className="notices-header">

        <span className="page-section-label">
          🇮🇳 FARMER UPDATES
        </span>

        <h1>
          {t.governmentNoticeBoard}
        </h1>

        <p>
          Stay informed about government schemes,
          agricultural programs and important updates
          for farmers.
        </p>

      </div>


      {/* LOADING */}
      {loading && (

        <div className="notices-state">

          <div className="notices-loader"></div>

          <p>
            {t.loadingNotices}
          </p>

        </div>

      )}


      {/* ERROR */}
      {error && (

        <div className="notices-error">
          <span>!</span>

          <p>
            {error}
          </p>
        </div>

      )}


      {/* EMPTY */}
      {!loading &&
        !error &&
        notices.length === 0 && (

          <div className="notices-empty">

            <div className="notices-empty-icon">
              📋
            </div>

            <h2>
              No updates available
            </h2>

            <p>
              {t.noNotices}
            </p>

          </div>

        )}


      {/* NOTICES */}
      {!loading &&
        !error &&
        notices.length > 0 && (

          <div className="notices-list">

            {notices.map((notice, index) => (

              <a
                key={index}
                href={notice.url}
                target="_blank"
                rel="noreferrer"
                className="notice-card"
              >

               

                <div className="notice-card-content">

                  <span className="notice-type">
                    
                  </span>

                  <h2>
                    {notice.title}
                  </h2>

                  <p>
                    {notice.summary}
                  </p>


                  <span className="notice-read-more">
                    {t.readMore}

                    <span className="notice-arrow">
                      →
                    </span>
                  </span>

                </div>


                <div className="notice-external">
                  ↗
                </div>

              </a>

            ))}

          </div>

        )}

    </div>
  )
}
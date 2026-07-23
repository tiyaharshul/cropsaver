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

    <div className="space-y-4">

      <h1
        className="
          text-2xl
          font-bold
          text-leaf-700
        "
      >
        {t.governmentNoticeBoard}
      </h1>


      {loading && (

        <p className="text-gray-500">

          {t.loadingNotices}

        </p>

      )}


      {error && (

        <div
          className="
            bg-red-50
            text-red-700
            rounded-lg
            p-3
          "
        >
          {error}
        </div>

      )}


      {!loading &&
        !error &&
        notices.length === 0 && (

          <p className="text-gray-500">

            {t.noNotices}

          </p>

        )}


      <div className="space-y-3">

        {notices.map((notice, index) => (

          <a
            key={index}
            href={notice.url}
            target="_blank"
            rel="noreferrer"
            className="
              block
              bg-white
              rounded-xl
              shadow
              p-5
              hover:shadow-md
              transition
            "
          >

            <p
              className="
                font-semibold
                text-lg
              "
            >
              {notice.title}
            </p>


            <p
              className="
                text-sm
                text-gray-600
                mt-2
                leading-relaxed
              "
            >
              {notice.summary}
            </p>


            <p
              className="
                text-sm
                text-leaf-700
                mt-3
                font-medium
              "
            >
              {t.readMore} →
            </p>

          </a>

        ))}

      </div>

    </div>
  )
}
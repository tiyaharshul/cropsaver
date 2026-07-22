import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function GovernmentNoticeBoard() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/government-notices')
      .then((res) => setNotices(res.data.notices))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-leaf-700">Government Notice Board</h1>
      {loading && <p>Loading notices...</p>}
      <div className="space-y-3">
        {notices.map((n, idx) => (
          <a
            key={idx}
            href={n.url}
            target="_blank"
            rel="noreferrer"
            className="block bg-white rounded-lg shadow p-4 hover:shadow-md"
          >
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-gray-600 mt-1">{n.summary}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

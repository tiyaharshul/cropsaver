import { Link } from 'react-router-dom'

const cards = [
  { title: 'Disease Detection', desc: 'Upload a crop photo for instant diagnosis', to: '/detect', emoji: '🔬' },
  { title: 'Crop History', desc: 'View your saved diagnosis & treatment timeline', to: '/history', emoji: '📜' },
  { title: 'Government Notices', desc: 'Latest schemes, MSP, subsidies & deadlines', to: '/notices', emoji: '📢' },
  { title: 'Nearby Experts', desc: 'Find KVKs, soil labs & fertilizer shops nearby', to: '/nearby', emoji: '📍' },
  { title: 'AI Chatbot', desc: 'Ask anything about crops, pests & irrigation', to: '/chat', emoji: '💬' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf-700 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{c.emoji}</div>
            <h2 className="font-semibold text-lg">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

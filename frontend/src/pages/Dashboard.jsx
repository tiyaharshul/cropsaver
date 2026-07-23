import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export default function Dashboard() {
  const { t } = useLanguage()

  const cards = [
    {
      title: t.diseaseDetection,
      desc: t.diseaseCardDesc,
      to: '/detect',
      emoji: '🔬',
    },
    {
      title: t.cropHistory,
      desc: t.historyCardDesc,
      to: '/history',
      emoji: '📜',
    },
    {
      title: t.governmentNotices,
      desc: t.noticesCardDesc,
      to: '/notices',
      emoji: '📢',
    },
    {
      title: t.nearbyExperts,
      desc: t.expertsCardDesc,
      to: '/nearby',
      emoji: '📍',
    },
    {
      title: t.aiChatbot,
      desc: t.chatbotCardDesc,
      to: '/chat',
      emoji: '💬',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-leaf-700 mb-4">
        {t.dashboard}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{card.emoji}</div>

            <h2 className="font-semibold text-lg">
              {card.title}
            </h2>

            <p className="text-sm text-gray-600">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
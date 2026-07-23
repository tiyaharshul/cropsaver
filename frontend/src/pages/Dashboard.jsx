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
      color: 'from-leaf-500 to-leaf-700',
    },
    {
      title: t.cropHistory,
      desc: t.historyCardDesc,
      to: '/history',
      emoji: '📜',
      color: 'from-earth-400 to-earth-600',
    },
    {
      title: t.governmentNotices,
      desc: t.noticesCardDesc,
      to: '/notices',
      emoji: '📢',
      color: 'from-rose-400 to-rose-600',
    },
    {
      title: t.nearbyExperts,
      desc: t.expertsCardDesc,
      to: '/nearby',
      emoji: '📍',
      color: 'from-sky-400 to-sky-600',
    },
    {
      title: t.aiChatbot,
      desc: t.chatbotCardDesc,
      to: '/chat',
      emoji: '💬',
      color: 'from-violet-400 to-violet-600',
    },
  ]

  return (
    <div>

      {/* HERO */}
      <div
        className="
          relative rounded-2xl overflow-hidden mb-8
          shadow-soft h-64 sm:h-72
        "
      >
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
          alt="Farmland at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />

        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 text-white">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            {t.dashboard}
          </h1>
          <p className="text-white/90 max-w-md text-sm sm:text-base">
            {t.dashboardTagline || 'Healthier crops, smarter decisions — everything you need in one place.'}
          </p>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="
              group bg-white rounded-2xl shadow-card p-5
              hover:shadow-soft hover:-translate-y-1
              transition-all duration-200
            "
          >
            <div
              className={`
                w-12 h-12 rounded-xl mb-3
                bg-gradient-to-br ${card.color}
                flex items-center justify-center text-2xl
                shadow-card group-hover:scale-110 transition-transform
              `}
            >
              {card.emoji}
            </div>

            <h2 className="font-heading font-semibold text-lg text-leaf-900">
              {card.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
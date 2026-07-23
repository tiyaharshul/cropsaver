import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

export default function DashboardHero() {
  const { t } = useLanguage()

  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || '{}'
  )

  const firstName =
    user?.name?.split(' ')[0] ||
    localStorage.getItem('user_name') ||
    ''

  return (
    <section className="dashboard-hero">

      <img
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1800&q=88"
        alt="Agriculture"
        className="hero-image"
      />

      <div className="hero-overlay" />

      <div className="hero-content">

        <span className="hero-badge">
          ✨ {t.dashboardAiBadge}
        </span>

        <p className="hero-welcome">
          {t.dashboardWelcome}
          {firstName && `, ${firstName}`} 👋
        </p>

        <h1>{t.dashboardHeroTitle}</h1>

        <p className="hero-description">
          {t.dashboardHeroDescription}
        </p>

        <div className="hero-actions">

          <Link
            to="/detect"
            className="hero-primary-btn"
          >
            🔬 {t.detectDisease} →
          </Link>

          <Link
            to="/chat"
            className="hero-secondary-btn"
          >
            ✨ {t.askCropSaver}
          </Link>

        </div>

        <div className="hero-features">
          <span>✓ {t.aiDiagnosis}</span>
          <span>🌐 {t.localLanguages}</span>
          <span>🎧 {t.anytimeAssistance}</span>
        </div>

      </div>

    </section>
  )
}
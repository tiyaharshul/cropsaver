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

      {/* EXISTING FIELD BACKGROUND */}
      <img
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=90"
        alt="Agricultural field"
        className="hero-image"
      />

      {/* OVERLAY */}
      <div className="hero-overlay" />

      {/* DECORATIVE LIGHT */}
      <div className="hero-glow" />


      {/* ================= LEFT CONTENT ================= */}
      <div className="hero-content">

        <span className="hero-badge">
          <span className="hero-badge-dot" />
          {t.dashboardAiBadge}
        </span>

        <p className="hero-welcome">
          {t.dashboardWelcome}

          {firstName && (
            <strong>
              {' '}{firstName}
            </strong>
          )}

          {' '}👋
        </p>

        <h1>
          {t.dashboardHeroTitle}
        </h1>

        <p className="hero-description">
          {t.dashboardHeroDescription}
        </p>


        {/* BUTTONS */}
        <div className="hero-actions">

          <Link
            to="/detect"
            className="hero-primary-btn"
          >
            <span>🔬</span>

            <span>
              {t.detectDisease}
            </span>

            <span className="hero-button-arrow">
              →
            </span>
          </Link>

          <Link
            to="/chat"
            className="hero-secondary-btn"
          >
            <span>✨</span>

            <span>
              {t.askCropSaver}
            </span>
          </Link>

        </div>


        {/* FEATURES */}
        <div className="hero-features">

          <span>
            <span className="hero-feature-icon">
              ✓
            </span>
            {t.aiDiagnosis}
          </span>

          <span>
            <span className="hero-feature-icon">
              🌐
            </span>
            {t.localLanguages}
          </span>

          <span>
            <span className="hero-feature-icon">
              🎧
            </span>
            {t.anytimeAssistance}
          </span>

        </div>

      </div>


      {/* ================= FARMER ================= */}
      <div className="hero-farmer-area">
  <div className="farmer-image-frame">
    <img
      src="/public/images/farmer.png"
      alt="Farmer"
      className="farmer-image"
    />
  </div>
</div>
    </section>
  )
}
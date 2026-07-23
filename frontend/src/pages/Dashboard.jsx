import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

import DashboardHero from '../components/dashboard/DashboardHero'
import FeatureCard from '../components/dashboard/FeatureCard'
import QuickCard from '../components/dashboard/QuickCard'

import '../styles/dashboard.css'

export default function Dashboard() {
  const { t } = useLanguage()

  return (
    <div className="dashboard-page">

      {/* ================= HERO ================= */}

      <section className="dashboard-section hero-section">
        <DashboardHero />
      </section>


      {/* ================= TOOLKIT INTRO ================= */}

      <section className="dashboard-section toolkit-section">

        <div className="toolkit-heading">
          <span className="section-label">
            {t.farmingToolkit}
          </span>

          <h2>
            {t.toolkitTitle}
          </h2>
        </div>

        <p className="toolkit-description">
          {t.toolkitDescription}
        </p>

      </section>


      {/* ================= MAIN FEATURES ================= */}

      <section className="dashboard-section main-features">

        <FeatureCard
          type="disease"
          title={t.diseaseFeatureTitle}
          description={t.diseaseFeatureDescription}
          label={t.aiCropDoctor}
          button={t.startDiagnosis}
          to="/detect"
        />

        <FeatureCard
          type="chat"
          title={t.aiFeatureTitle}
          description={t.aiFeatureDescription}
          label={t.cropSaverAi}
          button={t.askCropSaver}
          to="/chat"
        />

      </section>


      {/* ================= QUICK TOOLS ================= */}

      <section className="dashboard-section quick-tools-section">

        <div className="quick-tools-heading">
          <span className="section-label">
            {t.quickTools || 'QUICK ACCESS'}
          </span>

          <h2>
            {t.exploreTools || 'Explore your farming tools'}
          </h2>
        </div>


        <div className="quick-features">

          <QuickCard
            icon="📜"
            title={t.cropHistory}
            description={t.historyCardDesc}
            to="/history"
          />

          <QuickCard
            icon="🏛️"
            title={t.governmentNotices}
            description={t.noticesCardDesc}
            to="/notices"
          />

          <QuickCard
            icon="📍"
            title={t.nearbyExperts}
            description={t.expertsCardDesc}
            to="/nearby"
          />

        </div>

      </section>


      {/* ================= AI CTA ================= */}

      <section className="dashboard-section dashboard-cta">

        <div className="cta-content">

          <span className="cta-label">
            ✨ {t.cropSaverAi}
          </span>

          <h2>
            {t.finalCtaTitle}
          </h2>

          <p>
            {t.finalCtaDescription}
          </p>

        </div>


        <Link
          to="/chat"
          className="cta-button"
        >
          <span>{t.askCropSaver}</span>
          <span className="cta-arrow">→</span>
        </Link>

      </section>

    </div>
  )
}
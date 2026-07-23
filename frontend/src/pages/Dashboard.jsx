import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import DashboardHero from '../components/dashboard/DashboardHero'
import FeatureCard from '../components/dashboard/FeatureCard'
import QuickCard from '../components/dashboard/FeatureCard'
import '../styles/dashboard.css'

export default function Dashboard() {
  const { t } = useLanguage()

  return (
    <div className="dashboard">

      <DashboardHero />

      <section className="dashboard-intro">
        <div>
          <span className="section-label">
            {t.farmingToolkit}
          </span>

          <h2>
            {t.toolkitTitle}
          </h2>
        </div>

        <p>{t.toolkitDescription}</p>
      </section>

      <section className="main-features">
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

      <section className="quick-features">
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
      </section>

      <section className="dashboard-cta">
        <div>
          <span>{t.cropSaverAi}</span>
          <h2>{t.finalCtaTitle}</h2>
          <p>{t.finalCtaDescription}</p>
        </div>

        <Link to="/chat">
          {t.askCropSaver} →
        </Link>
      </section>

    </div>
  )
}
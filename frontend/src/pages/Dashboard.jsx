import { Link } from 'react-router-dom'

import {
  useLanguage,
} from '../contexts/LanguageContext'

import DashboardHero from '../components/dashboard/DashboardHero'
import FeatureCard from '../components/dashboard/FeatureCard'
import QuickCard from '../components/dashboard/QuickCard'
import WeatherRiskCard from '../components/dashboard/WeatherRiskCard'

import '../styles/dashboard.css'


export default function Dashboard() {

  const { t } = useLanguage()


  // ======================================================
  // CURSOR BACKGROUND EFFECT
  // ======================================================

  const handleMouseMove = (e) => {

    const rect =
      e.currentTarget.getBoundingClientRect()

    e.currentTarget.style.setProperty(
      '--mouse-x',
      `${e.clientX - rect.left}px`
    )

    e.currentTarget.style.setProperty(
      '--mouse-y',
      `${e.clientY - rect.top}px`
    )

  }


  return (

    <div
      className="dashboard-page"
      onMouseMove={handleMouseMove}
    >

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          dashboard-section
          hero-section
        "
      >

        <DashboardHero />

      </section>


      {/* ==================================================
          WEATHER + CROP RISK
      ================================================== */}

      <section
        className="
          dashboard-section
          weather-risk-section
        "
      >

        <WeatherRiskCard />

      </section>


      {/* ==================================================
          TOOLKIT INTRO
      ================================================== */}

      <section
        className="
          dashboard-section
          toolkit-section
        "
      >

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


      {/* ==================================================
          MAIN FEATURES
      ================================================== */}

      <section
        className="
          dashboard-section
          main-features
        "
      >

        <FeatureCard
          type="disease"
          title={
            t.diseaseFeatureTitle
          }
          description={
            t.diseaseFeatureDescription
          }
          label={
            t.aiCropDoctor
          }
          button={
            t.startDiagnosis
          }
          to="/detect"
        />


        <FeatureCard
          type="chat"
          title={
            t.aiFeatureTitle
          }
          description={
            t.aiFeatureDescription
          }
          label={
            t.cropSaverAi
          }
          button={
            t.askCropSaver
          }
          to="/chat"
        />

      </section>


      {/* ==================================================
          QUICK TOOLS
      ================================================== */}

      <section
        className="
          dashboard-section
          quick-tools-section
        "
      >

        <div className="quick-tools-heading">

          <span className="section-label">
            {t.quickTools}
          </span>

          <h2>
            {t.exploreTools}
          </h2>

        </div>


        <div className="quick-features">

          <QuickCard
            icon="📜"
            title={
              t.cropHistory
            }
            description={
              t.historyCardDesc
            }
            to="/history"
          />


          <QuickCard
            icon="🏛️"
            title={
              t.governmentNotices
            }
            description={
              t.noticesCardDesc
            }
            to="/notices"
          />


          <QuickCard
            icon="📍"
            title={
              t.nearbyExperts
            }
            description={
              t.expertsCardDesc
            }
            to="/nearby"
          />

        </div>

      </section>


      {/* ==================================================
          CTA
      ================================================== */}

      <section
        className="
          dashboard-section
          dashboard-cta
        "
      >

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

          <span>
            {t.askCropSaver}
          </span>

          <span className="cta-arrow">
            →
          </span>

        </Link>

      </section>

    </div>

  )
}
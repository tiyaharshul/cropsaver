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


  // ======================================================
  // OPEN VOICE ASSISTANT
  // ======================================================

  const handleOpenVoiceAssistant = () => {

    window.dispatchEvent(
      new CustomEvent(
        'cropsaver:open-voice-assistant'
      )
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
          MAIN DASHBOARD AREA
          LEFT = FARMING TOOLS
          RIGHT = WEATHER
      ================================================== */}

      <div
        className="
          dashboard-section
          dashboard-main-layout
        "
      >

        {/* ================================================
            LEFT SIDE
        ================================================ */}

        <main className="dashboard-tools-column">

          {/* ==============================================
              TOOLKIT INTRO
          ============================================== */}

          <section
            className="
              toolkit-section
              dashboard-inner-section
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


          {/* ==============================================
              MAIN FEATURES
          ============================================== */}

          <section
            className="
              main-features
              dashboard-inner-section
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


          {/* ==============================================
              QUICK TOOLS
          ============================================== */}

          <section
            className="
              quick-tools-section
              dashboard-inner-section
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

        </main>


        {/* ================================================
            RIGHT SIDE — WEATHER SIDEBAR
        ================================================ */}

        <aside className="dashboard-weather-column">

          <div className="dashboard-weather-sticky">

            <WeatherRiskCard />

          </div>

        </aside>

      </div>


      {/* ==================================================
          CTA — OPENS VOICE ASSISTANT
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


        <button
          type="button"
          className="cta-button"
          onClick={handleOpenVoiceAssistant}
          aria-label="Open voice assistant"
        >

          <span>
            {t.askCropSaver}
          </span>

          <span className="cta-arrow">
            →
          </span>

        </button>

      </section>

    </div>

  )

}
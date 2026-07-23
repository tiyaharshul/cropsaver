import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="app-footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">🌱</span>

            <span>
              {t.appName || 'CropSaver'}
            </span>
          </Link>

          <p>
            {t.footerDescription ||
              'Smart farming assistance powered by AI — helping farmers protect crops, make better decisions and grow with confidence.'}
          </p>

          <div className="footer-badge">
            <span>🇮🇳</span>
            <span>
              {t.madeForFarmers || 'Built for Indian farmers'}
            </span>
          </div>

        </div>


        {/* FARMING TOOLS */}
        <div className="footer-column">

          <h3>
            {t.farmingTools || 'Farming Tools'}
          </h3>

          <Link to="/detect">
            {t.diseaseDetection}
          </Link>

          <Link to="/chat">
            {t.aiChatbot}
          </Link>

          <Link to="/history">
            {t.cropHistory}
          </Link>

        </div>


        {/* EXPLORE */}
        <div className="footer-column">

          <h3>
            {t.explore || 'Explore'}
          </h3>

          <Link to="/notices">
            {t.governmentNotices}
          </Link>

          <Link to="/nearby">
            {t.nearbyExperts}
          </Link>

          <Link to="/profile">
            {t.profile}
          </Link>

        </div>


        {/* SUPPORT */}
        <div className="footer-column">

          <h3>
            {t.needHelp || 'Need Help?'}
          </h3>

          <Link to="/chat">
            <span>💬</span>
            {t.askCropSaver}
          </Link>

          <Link to="/detect">
            <span>🔬</span>
            {t.detectDisease}
          </Link>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} CropSaver.
          {' '}
          {t.footerRights || 'All rights reserved.'}
        </p>

        <p className="footer-bottom-message">
          🌾 {t.footerMessage || 'Technology for better farming'}
        </p>

      </div>

    </footer>
  )
}
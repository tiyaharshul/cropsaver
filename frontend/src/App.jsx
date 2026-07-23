import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  Bot,
  FileClock,
  Home,
  Landmark,
  LogOut,
  MapPin,
  ScanLine,
  UserRound,
} from 'lucide-react'

// Pages
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LanguageSelect from './pages/LanguageSelect.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiseaseDetection from './pages/DiseaseDetection.jsx'
import CropHistory from './pages/CropHistory.jsx'
import GovernmentNoticeBoard from './pages/GovernmentNoticeBoard.jsx'
import NearbyExperts from './pages/NearbyExperts.jsx'
import AIChatbot from './pages/AIChatbot.jsx'
import Profile from './pages/Profile.jsx'
import GoogleSetup from './pages/GoogleSetup.jsx'

// Components
import VoiceAssistant from './components/VoiceAssistant.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Context
import {
  LanguageProvider,
  useLanguage,
} from './contexts/LanguageContext.jsx'


// ============================================================
// NAVBAR
// ============================================================

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  const token = localStorage.getItem('cropsaver_token')

  // Hide navbar when user is not logged in
  if (!token) {
    return null
  }

  const links = [
    [t.dashboard, '/', Home],
    [t.diseaseDetection, '/detect', ScanLine],
    [t.cropHistory, '/history', FileClock],
    [t.governmentNotices, '/notices', Landmark],
    [t.nearbyExperts, '/nearby', MapPin],
    [t.aiChatbot, '/chat', Bot],
    [t.profile, '/profile', UserRound],
  ]


  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  const logout = () => {
    localStorage.removeItem('cropsaver_token')
    localStorage.removeItem('cropsaver_user')
    localStorage.removeItem('user_name')

    navigate('/login')
  }


  return (
    <nav className="glass-nav sticky top-0 z-40">

      <div className="navbar-inner">

        {/* LOGO */}

        <Link
          to="/"
          className="brand-logo"
        >
          <span className="brand-symbol">
            🌱
          </span>

          <span>
            Crop<span>Saver</span>
          </span>
        </Link>


        {/* NAVIGATION */}

        <div className="nav-links">

          {links.map(([label, path, Icon]) => {
            const active = location.pathname === path

            return (
              <Link
                key={path}
                to={path}
                className={`
                  nav-link
                  ${active ? 'nav-link-active' : ''}
                `}
              >
                <Icon size={16} />

                <span>
                  {label}
                </span>
              </Link>
            )
          })}

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={logout}
          className="logout-button"
        >
          <LogOut size={16} />

          <span>
            {t.logout}
          </span>
        </button>

      </div>

    </nav>
  )
}


// ============================================================
// REQUIRE LANGUAGE SELECTION
// ============================================================

function RequireLanguage({ children }) {
  const chosen = localStorage.getItem(
    'cropsaver_language_chosen'
  )

  if (!chosen) {
    return (
      <Navigate
        to="/language"
        replace
      />
    )
  }

  return children
}


// ============================================================
// FLOATING AI CHAT BUTTON
// ============================================================

function FloatingChatButton() {
  const { t } = useLanguage()
  const location = useLocation()

  /*
   * Hide the floating chatbot button when the user
   * is already on the chatbot page.
   */
  if (location.pathname === '/chat') {
    return null
  }

  return (
    <Link
      to="/chat"
      title={t.aiChatbot}
      aria-label={t.aiChatbot}
      className="
        fixed
        bottom-6
        right-24
        z-50

        w-14
        h-14

        rounded-full

        bg-white
        text-leaf-800

        border
        border-leaf-100

        flex
        items-center
        justify-center

        shadow-floaty

        hover:-translate-y-1
        hover:scale-105

        transition-all
        duration-300
      "
    >
      <Bot size={26} />
    </Link>
  )
}


// ============================================================
// APP CONTENT
// ============================================================

function AppContent() {
  const token = localStorage.getItem(
    'cropsaver_token'
  )

  return (
    <div className="min-h-screen font-body">

      {/* NAVBAR */}

      <NavBar />


      {/* MAIN CONTENT */}

      <main className="px-4 sm:px-6 max-w-6xl mx-auto">

        <Routes>

          {/* --------------------------------------------------
              LANGUAGE
          -------------------------------------------------- */}

          <Route
            path="/language"
            element={
              <LanguageSelect />
            }
          />


          {/* --------------------------------------------------
              LOGIN
          -------------------------------------------------- */}

          <Route
            path="/login"
            element={
              <RequireLanguage>

                {token ? (
                  <Navigate
                    to="/"
                    replace
                  />
                ) : (
                  <Login />
                )}

              </RequireLanguage>
            }
          />


          {/* --------------------------------------------------
              REGISTER
          -------------------------------------------------- */}

          <Route
            path="/register"
            element={
              <RequireLanguage>

                {token ? (
                  <Navigate
                    to="/"
                    replace
                  />
                ) : (
                  <Register />
                )}

              </RequireLanguage>
            }
          />


          {/* --------------------------------------------------
              DASHBOARD
          -------------------------------------------------- */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              GOOGLE PROFILE SETUP
          -------------------------------------------------- */}

          <Route
            path="/google-setup"
            element={
              <ProtectedRoute>
                <GoogleSetup />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              DISEASE DETECTION
          -------------------------------------------------- */}

          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              CROP HISTORY
          -------------------------------------------------- */}

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <CropHistory />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              GOVERNMENT NOTICES
          -------------------------------------------------- */}

          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <GovernmentNoticeBoard />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              NEARBY EXPERTS
          -------------------------------------------------- */}

          <Route
            path="/nearby"
            element={
              <ProtectedRoute>
                <NearbyExperts />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              AI CHATBOT
          -------------------------------------------------- */}

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AIChatbot />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              PROFILE
          -------------------------------------------------- */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* --------------------------------------------------
              UNKNOWN ROUTES
          -------------------------------------------------- */}

          <Route
            path="*"
            element={
              <Navigate
                to={token ? '/' : '/language'}
                replace
              />
            }
          />

        </Routes>

      </main>


      {/* =====================================================
          GLOBAL FLOATING ASSISTANTS

          VoiceAssistant:
              bottom-right

          FloatingChatButton:
              immediately LEFT of VoiceAssistant
      ===================================================== */}

      {token && (
        <>
          <FloatingChatButton />
          <VoiceAssistant />
        </>
      )}

    </div>
  )
}


// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
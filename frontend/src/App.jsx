import {
  useEffect,
  useState,
} from 'react'

import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'


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
import CropCalendar from './pages/CropCalendar.jsx'


// Components
import VoiceAssistant from './components/VoiceAssistant.jsx'
import QuickChat from './components/QuickChat.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Footer from './components/Footer.jsx'


// Language
import {
  LanguageProvider,
  useLanguage,
} from './contexts/LanguageContext.jsx'


// ======================================================
// NAVBAR
// ======================================================

function NavBar({
  isAuthenticated,
  onLogout,
}) {

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const { t } =
    useLanguage()


  if (!isAuthenticated) {
    return null
  }


  const links = [

    [
      t.dashboard,
      '/',
      '⌂',
    ],

    [
      t.diseaseDetection,
      '/detect',
      '⌗',
    ],

    [
      t.cropHistory,
      '/history',
      '◴',
    ],

    [
      t.cropCalendar ||
        'Crop Calendar',
      '/calendar',
      '▦',
    ],

    [
      t.governmentNotices,
      '/notices',
      '▥',
    ],

    [
      t.nearbyExperts,
      '/nearby',
      '⌖',
    ],

    [
      t.aiChatbot,
      '/chat',
      '✦',
    ],

    [
      t.profile,
      '/profile',
      '♙',
    ],

  ]


  const logout = () => {

    localStorage.removeItem(
      'cropsaver_token'
    )

    localStorage.removeItem(
      'cropsaver_user'
    )

    localStorage.removeItem(
      'user_name'
    )


    onLogout()


    navigate(
      '/login',
      {
        replace: true,
      }
    )

  }


  return (

    <nav className="app-navbar">

      <div className="navbar-container">


        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <span className="navbar-logo-icon">
            🌱
          </span>

          <span>
            {t.appName ||
              'Krishay'}
          </span>

        </Link>


        {/* NAVIGATION */}

        <div className="navbar-links">

          {links.map(
            ([
              label,
              path,
              icon,
            ]) => {

              const active =
                location.pathname ===
                path


              return (

                <Link
                  key={path}
                  to={path}
                  className={
                    active
                      ? 'navbar-link active'
                      : 'navbar-link'
                  }
                >

                  <span className="navbar-link-icon">
                    {icon}
                  </span>

                  <span>
                    {label}
                  </span>

                </Link>

              )

            }
          )}

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={logout}
          className="navbar-logout"
        >

          <span>
            ↪
          </span>

          <span>
            {t.logout}
          </span>

        </button>

      </div>

    </nav>

  )
}


// ======================================================
// LANGUAGE REQUIREMENT
// ======================================================

function RequireLanguage({
  children,
}) {

  const chosen =
    localStorage.getItem(
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


// ======================================================
// APP CONTENT
// ======================================================

function AppContent() {

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(
    () =>
      Boolean(
        localStorage.getItem(
          'cropsaver_token'
        )
      )
  )


  // ====================================================
  // LOGIN / LOGOUT
  // ====================================================

  const handleLoginSuccess =
    () => {

      setIsAuthenticated(
        true
      )

    }


  const handleLogout =
    () => {

      setIsAuthenticated(
        false
      )

    }


  // ====================================================
  // CURSOR BACKGROUND GLOW
  // ====================================================

  useEffect(() => {

    const handleMouseMove =
      (event) => {

        const main =
          document.querySelector(
            '.app-main.authenticated'
          )


        if (!main) {
          return
        }


        const rect =
          main.getBoundingClientRect()


        const mouseX =
          event.clientX -
          rect.left


        const mouseY =
          event.clientY -
          rect.top


        main.style.setProperty(
          '--mouse-x',
          `${mouseX}px`
        )


        main.style.setProperty(
          '--mouse-y',
          `${mouseY}px`
        )

      }


    window.addEventListener(
      'mousemove',
      handleMouseMove
    )


    return () => {

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

    }

  }, [])


  // ====================================================
  // APP
  // ====================================================

  return (

    <div className="app-shell">


      <NavBar
        isAuthenticated={
          isAuthenticated
        }
        onLogout={
          handleLogout
        }
      />


      <main
        className={
          isAuthenticated
            ? 'app-main authenticated'
            : 'app-main public'
        }
      >

        <Routes>


          {/* LANGUAGE */}

          <Route
            path="/language"
            element={
              <LanguageSelect />
            }
          />


          {/* LOGIN */}

          <Route
            path="/login"
            element={

              <RequireLanguage>

                {isAuthenticated
                  ? (

                    <Navigate
                      to="/"
                      replace
                    />

                  )
                  : (

                    <Login
                      onLoginSuccess={
                        handleLoginSuccess
                      }
                    />

                  )}

              </RequireLanguage>

            }
          />


          {/* REGISTER */}

          <Route
            path="/register"
            element={

              <RequireLanguage>

                {isAuthenticated
                  ? (

                    <Navigate
                      to="/"
                      replace
                    />

                  )
                  : (

                    <Register />

                  )}

              </RequireLanguage>

            }
          />


          {/* DASHBOARD */}

          <Route
            path="/"
            element={

              <ProtectedRoute>

                <Dashboard />

              </ProtectedRoute>

            }
          />


          {/* GOOGLE SETUP */}

          <Route
            path="/google-setup"
            element={

              <ProtectedRoute>

                <GoogleSetup />

              </ProtectedRoute>

            }
          />


          {/* DISEASE DETECTION */}

          <Route
            path="/detect"
            element={

              <ProtectedRoute>

                <DiseaseDetection />

              </ProtectedRoute>

            }
          />


          {/* CROP HISTORY */}

          <Route
            path="/history"
            element={

              <ProtectedRoute>

                <CropHistory />

              </ProtectedRoute>

            }
          />


          {/* CROP CALENDAR */}

          <Route
            path="/calendar"
            element={

              <ProtectedRoute>

                <CropCalendar />

              </ProtectedRoute>

            }
          />


          {/* GOVERNMENT NOTICES */}

          <Route
            path="/notices"
            element={

              <ProtectedRoute>

                <GovernmentNoticeBoard />

              </ProtectedRoute>

            }
          />


          {/* NEARBY EXPERTS */}

          <Route
            path="/nearby"
            element={

              <ProtectedRoute>

                <NearbyExperts />

              </ProtectedRoute>

            }
          />


          {/* AI CHATBOT */}

          <Route
            path="/chat"
            element={

              <ProtectedRoute>

                <AIChatbot />

              </ProtectedRoute>

            }
          />


          {/* PROFILE */}

          <Route
            path="/profile"
            element={

              <ProtectedRoute>

                <Profile />

              </ProtectedRoute>

            }
          />


          {/* FALLBACK */}

          <Route
            path="*"
            element={

              <Navigate
                to={
                  isAuthenticated
                    ? '/'
                    : '/login'
                }
                replace
              />

            }
          />


        </Routes>

      </main>


      {/* FOOTER */}

      {isAuthenticated && (
        <Footer />
      )}


      {/* FLOATING AI TOOLS */}

      {isAuthenticated && (

        <>

          <QuickChat />

          <VoiceAssistant />

        </>

      )}


    </div>

  )
}


// ======================================================
// ROOT
// ======================================================

export default function App() {

  return (

    <LanguageProvider>

      <AppContent />

    </LanguageProvider>

  )
}
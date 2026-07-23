import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'

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

import VoiceAssistant from './components/VoiceAssistant.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GoogleSetup from './pages/GoogleSetup.jsx'
import {
  LanguageProvider,
  useLanguage,
} from './contexts/LanguageContext.jsx'


// ----------------------------------------------------
// NAVBAR
// ----------------------------------------------------

function NavBar() {

  const navigate = useNavigate()
  const { t } = useLanguage()

  const token =
    localStorage.getItem('cropsaver_token')

  // Don't show navbar before login
  if (!token) {
    return null
  }

  const links = [
    [t.dashboard, '/'],
    [t.diseaseDetection, '/detect'],
    [t.cropHistory, '/history'],
    [t.governmentNotices, '/notices'],
    [t.nearbyExperts, '/nearby'],
    [t.aiChatbot, '/chat'],
    [t.profile, '/profile'],
  ]


  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

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

    navigate('/login')
  }


  return (

    <nav
      className="
        bg-leaf-700
        text-white
        px-4
        py-3
        flex
        flex-wrap
        gap-4
        items-center
      "
    >

      <span className="font-bold text-lg mr-4">
        🌱 {t.appName}
      </span>


      {links.map(([label, path]) => (

        <Link
          key={path}
          to={path}
          className="hover:underline text-sm"
        >
          {label}
        </Link>

      ))}


      <button
        type="button"
        onClick={logout}
        className="
          ml-auto
          text-sm
          border
          border-white/40
          rounded-lg
          px-3
          py-1.5
          hover:bg-white/10
        "
      >
        {t.logout}
      </button>

    </nav>
  )
}


// ----------------------------------------------------
// REQUIRE LANGUAGE SELECTION
// ----------------------------------------------------

function RequireLanguage({ children }) {

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


// ----------------------------------------------------
// APP CONTENT
// ----------------------------------------------------

function AppContent() {

  const token =
    localStorage.getItem(
      'cropsaver_token'
    )

  return (

    <div className="min-h-screen bg-leaf-50">

      <NavBar />


      <main className="p-4 max-w-5xl mx-auto">

        <Routes>


          {/* LANGUAGE */}

          <Route
            path="/language"
            element={<LanguageSelect />}
          />


          {/* LOGIN */}

          <Route
            path="/login"
            element={

              <RequireLanguage>

                {token
                  ? (
                    <Navigate
                      to="/"
                      replace
                    />
                  )
                  : (
                    <Login />
                  )
                }

              </RequireLanguage>
            }
          />


          {/* REGISTER */}

          <Route
            path="/register"
            element={

              <RequireLanguage>

                {token
                  ? (
                    <Navigate
                      to="/"
                      replace
                    />
                  )
                  : (
                    <Register />
                  )
                }

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


          {/* HISTORY */}

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <CropHistory />
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


          {/* CHATBOT */}

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


          {/* UNKNOWN ROUTE */}

          <Route
            path="*"
            element={
              <Navigate
                to={
                  token
                    ? '/'
                    : '/language'
                }
                replace
              />
            }
          />

        </Routes>

      </main>


      {/* Voice assistant only after login */}

      {token && <VoiceAssistant />}

    </div>
  )
}


// ----------------------------------------------------
// MAIN APP
// ----------------------------------------------------

export default function App() {

  return (

    <LanguageProvider>

      <AppContent />

    </LanguageProvider>

  )
}
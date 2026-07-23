import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'

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
  const location = useLocation()
  const { t } = useLanguage()

  const token =
    localStorage.getItem('cropsaver_token')

  if (!token) {
    return null
  }

  const links = [
    [t.dashboard, '/', '🏠'],
    [t.diseaseDetection, '/detect', '🔬'],
    [t.cropHistory, '/history', '📜'],
    [t.governmentNotices, '/notices', '📢'],
    [t.nearbyExperts, '/nearby', '📍'],
    [t.aiChatbot, '/chat', '💬'],
    [t.profile, '/profile', '👤'],
  ]

  const logout = () => {
    localStorage.removeItem('cropsaver_token')
    localStorage.removeItem('cropsaver_user')
    localStorage.removeItem('user_name')
    navigate('/login')
  }

  return (
    <nav className="glass-nav sticky top-0 z-40 text-white px-4 py-3 shadow-soft">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">

        <span className="font-heading font-bold text-lg mr-4 flex items-center gap-1.5">
          <span className="text-2xl">🌱</span> {t.appName}
        </span>

        <div className="flex flex-wrap gap-1">
          {links.map(([label, path, icon]) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`
                  text-sm px-3 py-1.5 rounded-full transition
                  flex items-center gap-1.5
                  ${active
                    ? 'bg-earth-500 text-white shadow-card'
                    : 'text-white/85 hover:bg-white/10'}
                `}
              >
                <span className="text-xs">{icon}</span>
                {label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          onClick={logout}
          className="
            ml-auto text-sm border border-white/40 rounded-full
            px-4 py-1.5 hover:bg-white/10 transition
          "
        >
          {t.logout}
        </button>

      </div>
    </nav>
  )
}


// ----------------------------------------------------
// REQUIRE LANGUAGE SELECTION
// ----------------------------------------------------

function RequireLanguage({ children }) {

  const chosen =
    localStorage.getItem('cropsaver_language_chosen')

  if (!chosen) {
    return <Navigate to="/language" replace />
  }

  return children
}


// ----------------------------------------------------
// FLOATING QUICK-CHAT LAUNCHER
// (sits alongside VoiceAssistant on every logged-in page)
// ----------------------------------------------------

function FloatingChatButton() {
  const { t } = useLanguage()

  return (
    <Link
      to="/chat"
      title={t.aiChatbot}
      className="
        fixed bottom-6 left-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-br from-leaf-600 to-leaf-800
        text-white text-2xl
        flex items-center justify-center
        shadow-floaty animate-float
        hover:scale-110 transition-transform
      "
    >
      💬
    </Link>
  )
}


// ----------------------------------------------------
// APP CONTENT
// ----------------------------------------------------

function AppContent() {

  const token =
    localStorage.getItem('cropsaver_token')

  return (

    <div className="min-h-screen bg-leaf-50 font-body">

      <NavBar />

      <main className="p-4 max-w-6xl mx-auto">

        <Routes>

          <Route path="/language" element={<LanguageSelect />} />

          <Route
            path="/login"
            element={
              <RequireLanguage>
                {token ? <Navigate to="/" replace /> : <Login />}
              </RequireLanguage>
            }
          />

          <Route
            path="/register"
            element={
              <RequireLanguage>
                {token ? <Navigate to="/" replace /> : <Register />}
              </RequireLanguage>
            }
          />

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

          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <CropHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <GovernmentNoticeBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/nearby"
            element={
              <ProtectedRoute>
                <NearbyExperts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AIChatbot />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate to={token ? '/' : '/language'} replace />
            }
          />

        </Routes>

      </main>

      {/* Persistent floating widgets — visible on every logged-in page */}
      {token && <VoiceAssistant />}
      {token && <FloatingChatButton />}

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
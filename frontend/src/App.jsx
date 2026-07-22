import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiseaseDetection from './pages/DiseaseDetection.jsx'
import CropHistory from './pages/CropHistory.jsx'
import GovernmentNoticeBoard from './pages/GovernmentNoticeBoard.jsx'
import NearbyExperts from './pages/NearbyExperts.jsx'
import AIChatbot from './pages/AIChatbot.jsx'
import Profile from './pages/Profile.jsx'

function NavBar() {
  const links = [
    ['Dashboard', '/'],
    ['Disease Detection', '/detect'],
    ['Crop History', '/history'],
    ['Government Notices', '/notices'],
    ['Nearby Experts', '/nearby'],
    ['AI Chatbot', '/chat'],
    ['Profile', '/profile'],
  ]
  return (
    <nav className="bg-leaf-700 text-white px-4 py-3 flex flex-wrap gap-4 items-center">
      <span className="font-bold text-lg mr-4">🌱 Smart Farming Assistant</span>
      {links.map(([label, path]) => (
        <Link key={path} to={path} className="hover:underline text-sm">
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-leaf-50">
      <NavBar />
      <main className="p-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/detect" element={<DiseaseDetection />} />
          <Route path="/history" element={<CropHistory />} />
          <Route path="/notices" element={<GovernmentNoticeBoard />} />
          <Route path="/nearby" element={<NearbyExperts />} />
          <Route path="/chat" element={<AIChatbot />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

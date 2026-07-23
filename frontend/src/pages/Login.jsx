import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function Login() {
  const navigate = useNavigate()
  const { t, setLanguage } = useLanguage()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const saveLogin = (data) => {
    localStorage.setItem('cropsaver_token', data.access_token)
    localStorage.setItem('cropsaver_user', JSON.stringify(data.user))

    if (data.user?.name) {
      localStorage.setItem('user_name', data.user.name)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      })

      const data = response.data

      saveLogin(data)

      if (data.user?.language) {
        setLanguage(data.user.language)
      }

      navigate('/')
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
        t.loginError ||
        'Login failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true)
    setError('')

    try {
      if (!credentialResponse.credential) {
        throw new Error('Google credential was not received.')
      }

      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      })

      const data = response.data

      saveLogin(data)

      if (data.needs_setup) {
        navigate('/google-setup')
        return
      }

      if (data.user?.language) {
        setLanguage(data.user.language)
      }

      navigate('/')
    } catch (err) {
      console.error('Google login error:', err)

      setError(
        err.response?.data?.detail ||
        'Google sign-in failed. Please try again.'
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden -mx-4 px-4">

      {/* Ambient background image + gradient */}
      <img
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-50 via-leaf-50/95 to-earth-50/80" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-floaty p-8 border border-leaf-100">

        <div className="text-center mb-6">
          <div className="text-4xl mb-2 animate-float inline-block">🌱</div>
          <h1 className="font-heading text-2xl font-bold text-leaf-800">
            {t.appName}
          </h1>
          <p className="text-gray-500 mt-2">{t.welcomeBack}</p>
          <p className="text-sm text-gray-400 mt-1">{t.loginHelp}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1 text-leaf-900">
              {t.emailOrMobile}
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t.emailOrMobile}
              required
              className="
                w-full border border-leaf-100 rounded-xl px-3 py-2.5
                focus:outline-none focus:ring-2 focus:ring-leaf-400
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-leaf-900">
              {t.password}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              required
              className="
                w-full border border-leaf-100 rounded-xl px-3 py-2.5
                focus:outline-none focus:ring-2 focus:ring-leaf-400
                transition
              "
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="
              w-full bg-gradient-to-r from-leaf-600 to-leaf-800
              text-white rounded-xl py-2.5 font-medium
              hover:from-leaf-700 hover:to-leaf-900
              disabled:opacity-50 shadow-card transition
            "
          >
            {loading ? (t.loggingIn || '...') : t.login}
          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-leaf-100 flex-1" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="h-px bg-leaf-100 flex-1" />
        </div>

        <div className="flex justify-center">
          {googleLoading ? (
            <div className="text-sm text-gray-500 py-3">
              Signing in with Google...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              width="350"
              text="continue_with"
              shape="rectangular"
            />
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span>{t.noAccount}</span>{' '}
          <Link to="/register" className="text-leaf-700 font-semibold hover:underline">
            {t.createAccount}
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/language" className="text-sm text-gray-500 hover:text-leaf-700">
            🌐 {t.changeLanguage}
          </Link>
        </div>

      </div>

    </div>
  )
}
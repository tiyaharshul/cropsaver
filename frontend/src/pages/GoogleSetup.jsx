import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'


const states = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
]


const languages = [
  ['en', 'English'],
  ['hi', 'हिन्दी'],
  ['raj', 'राजस्थानी / मारवाड़ी'],
  ['bho', 'भोजपुरी'],
  ['har', 'हरियाणवी'],
  ['gu', 'ગુજરાતી'],
  ['mr', 'मराठी'],
  ['pa', 'ਪੰਜਾਬੀ'],
  ['bn', 'বাংলা'],
  ['ta', 'தமிழ்'],
  ['te', 'తెలుగు'],
  ['kn', 'ಕನ್ನಡ'],
  ['ml', 'മലയാളം'],
  ['or', 'ଓଡ଼ିଆ'],
  ['as', 'অসমীয়া'],
]


export default function GoogleSetup() {
  const navigate = useNavigate()

  const {
    language,
    setLanguage,
    t,
  } = useLanguage()

  const token =
    localStorage.getItem(
      'cropsaver_token'
    )

  const storedUser =
    localStorage.getItem(
      'cropsaver_user'
    )

  const user = storedUser
    ? JSON.parse(storedUser)
    : null

  const [state, setState] =
    useState('Rajasthan')

  const [selectedLanguage, setSelectedLanguage] =
    useState(language || 'en')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  const submit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await api.patch(
        '/auth/google/complete-profile',
        {
          state,
          language: selectedLanguage,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data = response.data

      localStorage.setItem(
        'cropsaver_token',
        data.access_token
      )

      localStorage.setItem(
        'cropsaver_user',
        JSON.stringify(data.user)
      )

      localStorage.setItem(
        'user_name',
        data.user.name
      )

      localStorage.setItem(
        'cropsaver_language_chosen',
        'true'
      )

      setLanguage(
        data.user.language
      )

      navigate('/')
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
        'Could not complete your profile.'
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-[75vh] flex items-center justify-center">

      <form
        onSubmit={submit}
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-lg
          p-7
          space-y-5
        "
      >

        <div className="text-center">

          <div className="text-4xl mb-2">
            🌱
          </div>

          <h1 className="text-2xl font-bold text-leaf-700">
            Complete your profile
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome, {user.name}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {user.email}
          </p>

        </div>


        {/* STATE */}

        <label className="block text-sm font-medium">

          {t.state || 'State'}

          <select
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
            className="
              mt-1
              w-full
              border
              rounded-xl
              px-3
              py-2.5
              bg-white
            "
          >

            {states.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

        </label>


        {/* LANGUAGE */}

        <label className="block text-sm font-medium">

          {t.changeLanguage || 'Language'}

          <select
            value={selectedLanguage}
            onChange={(e) =>
              setSelectedLanguage(
                e.target.value
              )
            }
            className="
              mt-1
              w-full
              border
              rounded-xl
              px-3
              py-2.5
              bg-white
            "
          >

            {languages.map(
              ([code, label]) => (
                <option
                  key={code}
                  value={code}
                >
                  {label}
                </option>
              )
            )}

          </select>

        </label>


        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}


        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-leaf-700
            text-white
            rounded-xl
            py-2.5
            font-medium
            hover:bg-leaf-800
            disabled:opacity-50
          "
        >
          {loading
            ? 'Saving...'
            : 'Continue'}
        </button>

      </form>

    </div>
  )
}
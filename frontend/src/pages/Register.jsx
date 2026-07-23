import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function Register() {
  const navigate = useNavigate()

  const {
    language,
    setLanguage,
    t,
  } = useLanguage()

  const [form, setForm] = useState({
    name: '',
    identifier: '',
    password: '',
    state: 'Rajasthan',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      identifier: form.identifier.trim(),
      password: form.password,
      state: form.state,
      language: language || 'en',
    }

    console.log('Registration payload:', payload)

    try {
      const response = await api.post(
        '/auth/register',
        payload
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

      if (data.user.language) {
        setLanguage(data.user.language)
      }

      navigate('/')

    } catch (err) {
      console.error(
        'Registration error:',
        err.response?.data || err
      )

      const detail =
        err.response?.data?.detail

      // FastAPI validation error
      if (Array.isArray(detail)) {
        const message = detail
          .map((item) => {
            const field =
              item.loc?.[
                item.loc.length - 1
              ] || 'field'

            return `${field}: ${item.msg}`
          })
          .join(', ')

        setError(message)
      }

      // Normal FastAPI HTTPException
      else if (typeof detail === 'string') {
        setError(detail)
      }

      // Other error
      else {
        setError(
          t.registrationError ||
          'Registration failed. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-7 rounded-2xl shadow-lg space-y-4"
      >

        <h1 className="text-2xl font-bold text-leaf-700 text-center">
          🌱 {t.createAccount}
        </h1>

        {/* NAME */}

        <div>
          <label className="block text-sm mb-1">
            {t.name}
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={80}
            className="w-full border rounded-xl px-3 py-2.5"
          />
        </div>


        {/* EMAIL / MOBILE */}

        <div>
          <label className="block text-sm mb-1">
            {t.emailOrMobile}
          </label>

          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-3 py-2.5"
          />
        </div>


        {/* PASSWORD */}

        <div>
          <label className="block text-sm mb-1">
            {t.createPassword}
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            maxLength={128}
            className="w-full border rounded-xl px-3 py-2.5"
          />

          <p className="text-xs text-gray-400 mt-1">
            Minimum 6 characters
          </p>
        </div>


        {/* STATE */}

        <div>
          <label className="block text-sm mb-1">
            {t.state}
          </label>

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2.5 bg-white"
          >
            {states.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </div>


        {/* ERROR */}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}


        {/* REGISTER */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-leaf-700 text-white rounded-xl py-2.5 disabled:opacity-50"
        >
          {loading
            ? '...'
            : t.createAccount}
        </button>


        <p className="text-center text-sm">
          {t.alreadyAccount}{' '}

          <Link
            to="/login"
            className="text-leaf-700 font-semibold"
          >
            {t.login}
          </Link>
        </p>

      </form>

    </div>
  )
}
import { useState } from 'react'
import api from '../api/axios'
import { languages } from '../data/translations'
import { useLanguage } from '../contexts/LanguageContext'

export default function Profile() {
  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || 'null'
  )

  const {
    language,
    setLanguage,
    t,
  } = useLanguage()

  const [selected, setSelected] =
    useState(language)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  const save = async () => {
    try {
      const token =
        localStorage.getItem('cropsaver_token')

      const r = await api.patch(
        '/auth/language',
        {
          language: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      localStorage.setItem(
        'cropsaver_user',
        JSON.stringify(r.data)
      )

      setLanguage(selected)

      setMessage(t.saved)
      setError('')

    } catch (e) {
      setError(
        e.response?.data?.detail ||
        t.languageSaveError
      )
    }
  }

  if (!user) return null

  return (
    <div className="profile-page">

      {/* PAGE HEADER */}
      <div className="profile-page-header">

        <span className="page-section-label">
          👤 {t.yourAccount}
        </span>

        <h1>
          {t.profile}
        </h1>

        <p>
          {t.profileDescription}
        </p>

      </div>

      <div className="profile-layout">

        {/* PROFILE SUMMARY */}
        <div className="profile-main-card">

          <div className="profile-identity">

            <div className="profile-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : '👤'}
            </div>

            <div className="profile-identity-text">

              <span className="profile-small-label">
                {t.farmerProfile}
              </span>

              <h2>
                {user.name}
              </h2>

              {user.state && (
                <p>
                  📍 {user.state}
                </p>
              )}

            </div>

          </div>

          <div className="profile-divider"></div>

          {/* PERSONAL INFORMATION */}
          <div className="profile-section-header">

            <div className="profile-section-icon">
              👤
            </div>

            <div>

              <h3>
                {t.personalInformation}
              </h3>

              <p>
                {t.accountDetails}
              </p>

            </div>

          </div>

          <div className="profile-info-grid">

            <div className="profile-info-item">

              <span className="profile-info-label">
                {t.name}
              </span>

              <strong>
                {user.name}
              </strong>

            </div>

            {user.phone && (
              <div className="profile-info-item">

                <span className="profile-info-label">
                  {t.mobile}
                </span>

                <strong>
                  {user.phone}
                </strong>

              </div>
            )}

            {user.email && (
              <div className="profile-info-item">

                <span className="profile-info-label">
                  {t.email}
                </span>

                <strong>
                  {user.email}
                </strong>

              </div>
            )}

            <div className="profile-info-item">

              <span className="profile-info-label">
                {t.state}
              </span>

              <strong>
                {user.state}
              </strong>

            </div>

          </div>

        </div>

        {/* LANGUAGE CARD */}
        <div className="profile-language-card">

          <div className="profile-language-icon">
            🌐
          </div>

          <div className="profile-language-heading">

            <span className="profile-small-label">
              {t.preferences}
            </span>

            <h2>
              {t.changeLanguage}
            </h2>

            <p>
              {t.languagePreferenceDescription}
            </p>

          </div>

          <div className="profile-language-form">

            <label htmlFor="profile-language">
              {t.languageLabel}
            </label>

            <div className="profile-select-wrapper">

              <select
                id="profile-language"
                value={selected}
                onChange={(e) =>
                  setSelected(e.target.value)
                }
              >

                {languages.map((x) => (
                  <option
                    key={x.code}
                    value={x.code}
                  >
                    {x.label} — {x.region}
                  </option>
                ))}

              </select>

            </div>

            <button
              type="button"
              onClick={save}
              className="profile-save-button"
            >
              <span>✓</span>
              {t.saveLanguage}
            </button>

            {message && (
              <div className="profile-success-message">
                <span>✓</span>
                {message}
              </div>
            )}

            {error && (
              <div className="profile-error-message">
                <span>!</span>
                {error}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
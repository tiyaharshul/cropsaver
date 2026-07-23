import {
  useEffect,
  useState,
} from 'react'

import { Link } from 'react-router-dom'

import api from '../api/axios'

import {
  useLanguage,
} from '../contexts/LanguageContext'


export default function CropHistory() {

  const [items, setItems] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null)


  const { t } = useLanguage()


  // ======================================================
  // USER
  // ======================================================

  const user = JSON.parse(
    localStorage.getItem(
      'cropsaver_user'
    ) || 'null'
  )


  const userId =
    user?.id ||
    user?._id ||
    localStorage.getItem(
      'user_name'
    ) ||
    'anonymous'


  // ======================================================
  // LOAD HISTORY
  // ======================================================

  useEffect(() => {

    let active = true


    const loadHistory = async () => {

      setLoading(true)
      setError('')

      try {

        const res = await api.get(
          '/history',
          {
            params: {
              user_id: userId,
            },
          }
        )


        if (active) {

          setItems(
            res.data.history || []
          )

        }

      } catch (err) {

        console.error(
          'History error:',
          err
        )


        if (active) {

          setError(
            err.response?.data?.detail ||
            'Could not load crop history.'
          )

        }

      } finally {

        if (active) {
          setLoading(false)
        }

      }

    }


    loadHistory()


    return () => {
      active = false
    }

  }, [userId])


  // ======================================================
  // CLOSE DETAIL
  // ======================================================

  const closeDetails = () => {
    setSelectedItem(null)
  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="history-page">


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="history-header">

        <span className="page-section-label">
          🌿 {t.cropHealthLabel}
        </span>

        <h1>
          {t.cropHealthHistory}
        </h1>

        <p>
          {t.historyDescription}
        </p>

      </div>


      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (

        <div className="history-empty">

          <div className="history-empty-icon">
            🌱
          </div>

          <p>
            Loading crop history...
          </p>

        </div>

      )}


      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading && error && (

        <div
          className="
            bg-red-50
            border
            border-red-100
            text-red-700
            rounded-xl
            p-4
          "
        >
          {error}
        </div>

      )}


      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {!loading &&
        !error &&
        items.length === 0 && (

          <div className="history-empty">

            <div className="history-empty-icon">
              🌱
            </div>

            <h2>
              {t.noCropDiagnoses}
            </h2>

            <p>
              {t.noHistory}
            </p>

            <Link
              to="/detect"
              className="history-empty-button"
            >
              <span>✦</span>

              {t.detectCropDisease}
            </Link>

          </div>

        )}


      {/* ==================================================
          HISTORY GRID
      ================================================== */}

      {!loading &&
        !error &&
        items.length > 0 && (

          <div className="history-grid">

            {items.map((item) => (

              <div
                key={item._id}
                className="history-card"
              >

                {/* IMAGE */}

                {item.image_url ? (

                  <div className="history-image-wrapper">

                    <img
                      src={item.image_url}
                      alt={
                        item.crop_name ||
                        ''
                      }
                      className="history-image"
                    />

                    <span className="history-status">
                      ✓ {t.analyzed}
                    </span>

                  </div>

                ) : (

                  <div className="history-image-placeholder">
                    🌿
                  </div>

                )}


                {/* CONTENT */}

                <div className="history-card-content">

                  <span className="history-card-label">
                    {t.cropDiagnosis}
                  </span>


                  <h2>
                    {item.crop_name}
                  </h2>


                  <div className="history-info">

                    {/* DISEASE */}

                    <div className="history-info-row">

                      <span>
                        {t.disease}
                      </span>

                      <strong>
                        {item.disease_name}
                      </strong>

                    </div>


                    {/* CONFIDENCE */}

                    <div className="history-info-row">

                      <span>
                        {t.confidence}
                      </span>

                      <strong className="history-confidence">

                        {typeof item.confidence ===
                        'number'
                          ? `${(
                              item.confidence *
                              100
                            ).toFixed(1)}%`
                          : 'N/A'}

                      </strong>

                    </div>

                  </div>


                  {/* VIEW BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedItem(
                        item
                      )
                    }
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      border
                      border-green-200
                      bg-green-50
                      text-green-800
                      font-semibold
                      py-2.5
                      px-4
                      hover:bg-green-100
                      transition
                    "
                  >
                    View Full Diagnosis →
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}


      {/* ==================================================
          FULL DIAGNOSIS MODAL
      ================================================== */}

      {selectedItem && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closeDetails}
        >

          <div
            className="
              bg-white
              w-full
              max-w-3xl
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              shadow-2xl
              relative
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* ============================================
                MODAL HEADER
            ============================================ */}

            <div
              className="
                sticky
                top-0
                z-10
                bg-white/95
                backdrop-blur
                border-b
                border-gray-100
                px-6
                py-4
                flex
                items-center
                justify-between
              "
            >

              <div>

                <span
                  className="
                    text-xs
                    font-bold
                    tracking-wider
                    text-green-700
                  "
                >
                  🌿 {t.cropDiagnosis}
                </span>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    mt-1
                  "
                >
                  {selectedItem.crop_name}
                </h2>

              </div>


              <button
                type="button"
                onClick={closeDetails}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-700
                  text-xl
                  transition
                "
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* ============================================
                MODAL CONTENT
            ============================================ */}

            <div
              className="
                p-6
                space-y-6
              "
            >


              {/* IMAGE */}

              {selectedItem.image_url && (

                <img
                  src={
                    selectedItem.image_url
                  }
                  alt={
                    selectedItem.crop_name ||
                    ''
                  }
                  className="
                    w-full
                    max-h-80
                    object-cover
                    rounded-2xl
                    border
                    border-gray-100
                  "
                />

              )}


              {/* DIAGNOSIS SUMMARY */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-3
                "
              >

                <div
                  className="
                    bg-green-50
                    rounded-2xl
                    p-4
                  "
                >

                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {t.crop}
                  </span>

                  <p
                    className="
                      font-bold
                      text-gray-900
                      mt-1
                    "
                  >
                    {selectedItem.crop_name}
                  </p>

                </div>


                <div
                  className="
                    bg-green-50
                    rounded-2xl
                    p-4
                  "
                >

                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {t.disease}
                  </span>

                  <p
                    className="
                      font-bold
                      text-gray-900
                      mt-1
                    "
                  >
                    {selectedItem.disease_name}
                  </p>

                </div>


                <div
                  className="
                    bg-green-50
                    rounded-2xl
                    p-4
                  "
                >

                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {t.confidence}
                  </span>

                  <p
                    className="
                      font-bold
                      text-green-700
                      mt-1
                    "
                  >

                    {typeof selectedItem.confidence ===
                    'number'
                      ? `${(
                          selectedItem.confidence *
                          100
                        ).toFixed(1)}%`
                      : 'N/A'}

                  </p>

                </div>

              </div>


              {/* ==========================================
                  SAVED TREATMENT
              ========================================== */}

              {selectedItem.treatment ? (

                <div className="space-y-4">

                  <div
                    className="
                      border-t
                      border-gray-100
                      pt-6
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-bold
                        tracking-wider
                        text-green-700
                      "
                    >
                      🌱 TREATMENT PLAN
                    </span>

                    <h3
                      className="
                        text-xl
                        font-bold
                        mt-1
                      "
                    >
                      {t.treatmentRecommendation}
                    </h3>

                  </div>


                  {/* EXPLANATION */}

                  <DetailSection
                    icon="💡"
                    title={
                      t.explanation ||
                      'Explanation'
                    }
                    value={
                      selectedItem
                        .treatment
                        .explanation
                    }
                  />


                  {/* ORGANIC */}

                  <DetailSection
                    icon="🌿"
                    title={
                      t.organicTreatment ||
                      'Organic Treatment'
                    }
                    value={
                      selectedItem
                        .treatment
                        .organic_treatment
                    }
                  />


                  {/* CHEMICAL */}

                  <DetailSection
                    icon="🧪"
                    title={
                      t.chemicalTreatment ||
                      'Chemical Treatment'
                    }
                    value={
                      selectedItem
                        .treatment
                        .chemical_treatment
                    }
                  />


                  {/* DOSAGE */}

                  <DetailSection
                    icon="💧"
                    title={
                      t.dosage ||
                      'Dosage'
                    }
                    value={
                      selectedItem
                        .treatment
                        .dosage
                    }
                  />


                  {/* SCHEDULE */}

                  <DetailSection
                    icon="📅"
                    title={
                      t.spraySchedule ||
                      'Spray Schedule'
                    }
                    value={
                      selectedItem
                        .treatment
                        .spray_schedule
                    }
                  />


                  {/* RECOVERY */}

                  <DetailSection
                    icon="⏱️"
                    title={
                      t.recoveryTime ||
                      'Recovery Time'
                    }
                    value={
                      selectedItem
                        .treatment
                        .recovery_time
                    }
                  />


                  {/* PREVENTION */}

                  <DetailSection
                    icon="🛡️"
                    title={
                      t.prevention ||
                      'Prevention'
                    }
                    value={
                      selectedItem
                        .treatment
                        .prevention
                    }
                  />

                </div>

              ) : (

                /* ========================================
                   OLD HISTORY WITHOUT SAVED TREATMENT
                ======================================== */

                <div
                  className="
                    bg-amber-50
                    border
                    border-amber-100
                    rounded-2xl
                    p-5
                  "
                >

                  <h3
                    className="
                      font-bold
                      text-amber-900
                    "
                  >
                    Treatment details unavailable
                  </h3>

                  <p
                    className="
                      text-sm
                      text-amber-800
                      mt-1
                      leading-relaxed
                    "
                  >
                    This diagnosis was saved before
                    treatment history was enabled.
                    New diagnoses will save the complete
                    treatment plan automatically.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  )
}


// ======================================================
// DETAIL SECTION
// ======================================================

function DetailSection({
  icon,
  title,
  value,
}) {

  if (!value) {
    return null
  }


  return (

    <div
      className="
        bg-gray-50
        border
        border-gray-100
        rounded-2xl
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          mb-2
        "
      >

        <span>
          {icon}
        </span>

        <h4
          className="
            font-bold
            text-gray-900
          "
        >
          {title}
        </h4>

      </div>


      <p
        className="
          text-sm
          text-gray-700
          leading-relaxed
        "
      >
        {value}
      </p>

    </div>

  )
}

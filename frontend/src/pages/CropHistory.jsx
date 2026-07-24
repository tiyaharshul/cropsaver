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

  const [items, setItems] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null)

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)


  // ======================================================
  // FEEDBACK STATE
  // ======================================================

  const [
    treatmentWorked,
    setTreatmentWorked,
  ] = useState(null)

  const [
    rating,
    setRating,
  ] = useState(0)

  const [
    recoveryDays,
    setRecoveryDays,
  ] = useState('')

  const [
    feedbackComments,
    setFeedbackComments,
  ] = useState('')

  const [
    submittingFeedback,
    setSubmittingFeedback,
  ] = useState(false)

  const [
    feedbackMessage,
    setFeedbackMessage,
  ] = useState('')

  const [
    feedbackError,
    setFeedbackError,
  ] = useState('')

  const [
    feedbackSubmitted,
    setFeedbackSubmitted,
  ] = useState(false)


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
            t.couldNotLoadHistory ||
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

  }, [
    userId,
    t.couldNotLoadHistory,
  ])


  // ======================================================
  // RESET FEEDBACK FORM
  // ======================================================

  const resetFeedbackForm = () => {

    setTreatmentWorked(null)
    setRating(0)
    setRecoveryDays('')
    setFeedbackComments('')
    setFeedbackMessage('')
    setFeedbackError('')
    setFeedbackSubmitted(false)

  }


  // ======================================================
  // OPEN DETAILS
  // ======================================================

  const openDetails = (item) => {

    resetFeedbackForm()

    setSelectedItem(item)

  }


  // ======================================================
  // CLOSE DETAIL
  // ======================================================

  const closeDetails = () => {

    setSelectedItem(null)

    resetFeedbackForm()

  }


  // ======================================================
  // DELETE HISTORY
  // ======================================================

  const deleteHistory = async (
    historyId
  ) => {

    if (!historyId) {
      return
    }

    const confirmed =
      window.confirm(
        t.deleteConfirm ||
        'Are you sure you want to delete this diagnosis? This action cannot be undone.'
      )

    if (!confirmed) {
      return
    }

    try {

      setDeletingId(historyId)
      setError('')

      await api.delete(
        `/history/${historyId}`,
        {
          params: {
            user_id: userId,
          },
        }
      )

      setItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              item._id !== historyId
          )
      )

      if (
        selectedItem?._id ===
        historyId
      ) {

        setSelectedItem(null)

      }

    } catch (err) {

      console.error(
        'Delete history error:',
        err
      )

      setError(
        err.response?.data?.detail ||
        t.couldNotDeleteDiagnosis ||
        'Could not delete this diagnosis.'
      )

    } finally {

      setDeletingId(null)

    }

  }


  // ======================================================
  // SUBMIT FARMER FEEDBACK
  // ======================================================

  const submitFeedback = async () => {

    setFeedbackMessage('')
    setFeedbackError('')


    // Treatment worked is required

    if (treatmentWorked === null) {

      setFeedbackError(
        t.feedbackChooseResult ||
        'Please tell us whether the treatment worked.'
      )

      return

    }


    // Rating is required

    if (
      rating < 1 ||
      rating > 5
    ) {

      setFeedbackError(
        t.feedbackChooseRating ||
        'Please select a rating from 1 to 5 stars.'
      )

      return

    }


    if (!selectedItem?._id) {

      setFeedbackError(
        'Diagnosis information is missing.'
      )

      return

    }


    try {

      setSubmittingFeedback(true)


      // ================================================
      // BUILD REQUEST
      // ================================================

      const payload = {

        user_id: userId,

        crop_history_id:
          selectedItem._id,

        treatment_worked:
          treatmentWorked,

        rating,

        comments:
          feedbackComments.trim()
            ? feedbackComments.trim()
            : null,

        recovery_days:
          recoveryDays !== ''
            ? Number(recoveryDays)
            : null,

      }


      // ================================================
      // SEND TO BACKEND
      // ================================================

      await api.post(
        '/feedback',
        payload
      )


      setFeedbackSubmitted(true)

      setFeedbackMessage(
        t.feedbackThankYou ||
        'Thank you! Your feedback has been saved successfully.'
      )


    } catch (err) {

      console.error(
        'Feedback submission error:',
        err
      )

      setFeedbackError(
        err.response?.data?.detail ||
        t.feedbackSubmitError ||
        'Could not submit feedback. Please try again.'
      )

    } finally {

      setSubmittingFeedback(false)

    }

  }


  // ======================================================
  // CONFIDENCE HELPER
  // ======================================================

  const formatConfidence = (
    confidence
  ) => {

    if (
      typeof confidence !==
      'number'
    ) {

      return 'N/A'

    }

    return `${(
      confidence * 100
    ).toFixed(1)}%`

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
            {t.loadingCropHistory ||
              'Loading crop history...'}
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
            mb-5
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

                        {formatConfidence(
                          item.confidence
                        )}

                      </strong>

                    </div>

                  </div>


                  {/* ACTION BUTTONS */}

                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      sm:flex-row
                      gap-2
                    "
                  >


                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        openDetails(item)
                      }
                      className="
                        flex-1
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

                      {t.viewFullDiagnosis ||
                        'View Full Diagnosis'} →

                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        item._id
                      }
                      onClick={() =>
                        deleteHistory(
                          item._id
                        )
                      }
                      className="
                        sm:w-auto
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        text-red-700
                        font-semibold
                        py-2.5
                        px-4
                        hover:bg-red-100
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                      "
                    >

                      {deletingId ===
                      item._id
                        ? (
                          t.deletingHistory ||
                          'Deleting...'
                        )
                        : (
                          <>
                            🗑{' '}
                            {t.deleteHistory ||
                              'Delete'}
                          </>
                        )}

                    </button>

                  </div>

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


            {/* MODAL HEADER */}

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


            {/* MODAL CONTENT */}

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


                <SummaryBox
                  title={t.crop}
                  value={
                    selectedItem.crop_name
                  }
                />


                <SummaryBox
                  title={t.disease}
                  value={
                    selectedItem.disease_name
                  }
                />


                <SummaryBox
                  title={t.confidence}
                  value={
                    formatConfidence(
                      selectedItem.confidence
                    )
                  }
                  highlight
                />

              </div>


              {/* ==================================================
                  SAVED TREATMENT
              ================================================== */}

              {selectedItem.treatment ? (

                <div className="space-y-4">


                  {/* TREATMENT HEADER */}

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
                      🌱 {t.treatmentPlan ||
                        'Treatment Plan'}
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


                  {/* ==========================================
                      FARMER FEEDBACK
                  ========================================== */}

                  <FarmerFeedback
                    t={t}
                    treatmentWorked={
                      treatmentWorked
                    }
                    setTreatmentWorked={
                      setTreatmentWorked
                    }
                    rating={rating}
                    setRating={setRating}
                    recoveryDays={
                      recoveryDays
                    }
                    setRecoveryDays={
                      setRecoveryDays
                    }
                    comments={
                      feedbackComments
                    }
                    setComments={
                      setFeedbackComments
                    }
                    submitting={
                      submittingFeedback
                    }
                    submitted={
                      feedbackSubmitted
                    }
                    message={
                      feedbackMessage
                    }
                    error={
                      feedbackError
                    }
                    onSubmit={
                      submitFeedback
                    }
                  />


                  {/* DELETE FROM MODAL */}

                  <DeleteDiagnosisButton
                    deleting={
                      deletingId ===
                      selectedItem._id
                    }
                    onDelete={() =>
                      deleteHistory(
                        selectedItem._id
                      )
                    }
                    t={t}
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
                    {t.treatmentDetailsUnavailable ||
                      'Treatment details unavailable'}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-amber-800
                      mt-1
                      leading-relaxed
                    "
                  >
                    {t.oldTreatmentHistoryMessage ||
                      'This diagnosis was saved before treatment history was enabled. New diagnoses will save the complete treatment plan automatically.'}
                  </p>


                  <DeleteDiagnosisButton
                    deleting={
                      deletingId ===
                      selectedItem._id
                    }
                    onDelete={() =>
                      deleteHistory(
                        selectedItem._id
                      )
                    }
                    t={t}
                  />

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
// FARMER FEEDBACK COMPONENT
// ======================================================

function FarmerFeedback({
  t,
  treatmentWorked,
  setTreatmentWorked,
  rating,
  setRating,
  recoveryDays,
  setRecoveryDays,
  comments,
  setComments,
  submitting,
  submitted,
  message,
  error,
  onSubmit,
}) {

  return (

    <div
      className="
        border-t
        border-gray-100
        pt-6
        mt-6
      "
    >

      <div
        className="
          bg-green-50
          border
          border-green-100
          rounded-2xl
          p-5
        "
      >


        {/* HEADER */}

        <div className="mb-5">

          <span
            className="
              text-xs
              font-bold
              tracking-wider
              text-green-700
            "
          >
            🌾 {t.farmerFeedback ||
              'FARMER FEEDBACK'}
          </span>

          <h3
            className="
              text-xl
              font-bold
              text-gray-900
              mt-1
            "
          >
            {t.shareTreatmentExperience ||
              'How did the treatment work?'}
          </h3>

          <p
            className="
              text-sm
              text-gray-600
              mt-1
            "
          >
            {t.feedbackDescription ||
              'Your experience helps improve future recommendations for farmers.'}
          </p>

        </div>


        {/* TREATMENT WORKED */}

        <div className="mb-5">

          <label
            className="
              block
              text-sm
              font-semibold
              text-gray-800
              mb-2
            "
          >
            {t.didTreatmentWork ||
              'Did this treatment work?'}
          </label>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            <button
              type="button"
              disabled={submitted}
              onClick={() =>
                setTreatmentWorked(true)
              }
              className={`
                rounded-xl
                border
                px-4
                py-3
                font-semibold
                transition
                ${
                  treatmentWorked === true
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-green-50'
                }
                ${
                  submitted
                    ? 'cursor-not-allowed opacity-70'
                    : ''
                }
              `}
            >
              👍 {t.treatmentWorkedYes ||
                'Yes, it helped'}
            </button>


            <button
              type="button"
              disabled={submitted}
              onClick={() =>
                setTreatmentWorked(false)
              }
              className={`
                rounded-xl
                border
                px-4
                py-3
                font-semibold
                transition
                ${
                  treatmentWorked === false
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-red-50'
                }
                ${
                  submitted
                    ? 'cursor-not-allowed opacity-70'
                    : ''
                }
              `}
            >
              👎 {t.treatmentWorkedNo ||
                "No, it didn't"}
            </button>

          </div>

        </div>


        {/* STAR RATING */}

        <div className="mb-5">

          <label
            className="
              block
              text-sm
              font-semibold
              text-gray-800
              mb-2
            "
          >
            {t.rateTreatment ||
              'Rate the treatment'}
          </label>


          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  disabled={submitted}
                  onClick={() =>
                    setRating(star)
                  }
                  className={`
                    text-3xl
                    transition
                    hover:scale-110
                    ${
                      submitted
                        ? 'cursor-not-allowed'
                        : ''
                    }
                  `}
                  aria-label={`${star} stars`}
                >

                  <span
                    className={
                      star <= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    ★
                  </span>

                </button>

              )
            )}

            {rating > 0 && (

              <span
                className="
                  ml-2
                  text-sm
                  font-semibold
                  text-gray-600
                "
              >
                {rating}/5
              </span>

            )}

          </div>

        </div>


        {/* RECOVERY DAYS */}

        <div className="mb-5">

          <label
            className="
              block
              text-sm
              font-semibold
              text-gray-800
              mb-2
            "
          >
            {t.actualRecoveryTime ||
              'Recovery time'}
          </label>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <input
              type="number"
              min="0"
              max="365"
              disabled={submitted}
              value={recoveryDays}
              onChange={(e) =>
                setRecoveryDays(
                  e.target.value
                )
              }
              placeholder="7"
              className="
                w-28
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
                disabled:bg-gray-100
              "
            />

            <span
              className="
                text-sm
                text-gray-600
              "
            >
              {t.days || 'days'}
            </span>

          </div>

        </div>


        {/* COMMENTS */}

        <div className="mb-5">

          <label
            className="
              block
              text-sm
              font-semibold
              text-gray-800
              mb-2
            "
          >
            {t.additionalFeedback ||
              'Additional feedback'}
          </label>


          <textarea
            rows="4"
            disabled={submitted}
            value={comments}
            onChange={(e) =>
              setComments(
                e.target.value
              )
            }
            placeholder={
              t.feedbackPlaceholder ||
              'Tell us about your experience with this treatment...'
            }
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              focus:border-green-500
              focus:ring-2
              focus:ring-green-100
              disabled:bg-gray-100
            "
          />

        </div>


        {/* ERROR */}

        {error && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >
            {error}
          </div>

        )}


        {/* SUCCESS */}

        {message && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-green-200
              bg-green-100
              px-4
              py-3
              text-sm
              font-medium
              text-green-800
            "
          >
            ✓ {message}
          </div>

        )}


        {/* SUBMIT */}

        <button
          type="button"
          disabled={
            submitting ||
            submitted
          }
          onClick={onSubmit}
          className="
            w-full
            rounded-xl
            bg-green-700
            text-white
            font-semibold
            px-5
            py-3
            hover:bg-green-800
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition
          "
        >

          {submitting
            ? (
              t.submittingFeedback ||
              'Submitting...'
            )
            : submitted
              ? (
                <>
                  ✓ {t.feedbackSubmitted ||
                    'Feedback Submitted'}
                </>
              )
              : (
                <>
                  🌱 {t.submitFeedback ||
                    'Submit Feedback'}
                </>
              )}

        </button>

      </div>

    </div>

  )
}


// ======================================================
// SUMMARY BOX
// ======================================================

function SummaryBox({
  title,
  value,
  highlight = false,
}) {

  return (

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
        {title}
      </span>

      <p
        className={`
          font-bold
          mt-1
          ${
            highlight
              ? 'text-green-700'
              : 'text-gray-900'
          }
        `}
      >
        {value}
      </p>

    </div>

  )
}


// ======================================================
// DELETE DIAGNOSIS BUTTON
// ======================================================

function DeleteDiagnosisButton({
  deleting,
  onDelete,
  t,
}) {

  return (

    <div
      className="
        border-t
        border-gray-100
        pt-5
        mt-4
      "
    >

      <button
        type="button"
        disabled={deleting}
        onClick={onDelete}
        className="
          w-full
          rounded-xl
          border
          border-red-200
          bg-red-50
          text-red-700
          font-semibold
          py-3
          px-4
          hover:bg-red-100
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
      >

        {deleting
          ? (
            t.deletingHistory ||
            'Deleting...'
          )
          : (
            <>
              🗑{' '}
              {t.deleteThisDiagnosis ||
                'Delete this diagnosis'}
            </>
          )}

      </button>

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
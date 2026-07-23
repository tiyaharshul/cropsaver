import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import api from '../api/axios'

import { useLanguage } from '../contexts/LanguageContext'
import { aiLanguageNames } from '../data/translations'

export default function DiseaseDetection() {
  const webcamRef = useRef(null)

  const { language, t } = useLanguage()

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [detection, setDetection] = useState(null)
  const [treatment, setTreatment] = useState(null)

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]

    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))

    setDetection(null)
    setTreatment(null)
    setError('')
  }

  // =====================================================
  // CAMERA CAPTURE
  // =====================================================

  const captureFromCamera = async () => {
    const imageSrc =
      webcamRef.current?.getScreenshot()

    if (!imageSrc) return

    const blob = await fetch(imageSrc).then(
      (response) => response.blob()
    )

    const captured = new File(
      [blob],
      'capture.jpg',
      {
        type: 'image/jpeg',
      }
    )

    setFile(captured)
    setPreview(imageSrc)
    setShowCamera(false)

    setDetection(null)
    setTreatment(null)
    setError('')
  }

  // =====================================================
  // DISEASE DETECTION
  // =====================================================

  const handleDetect = async () => {
    if (!file) {
      alert(t.selectImageFirst)
      return
    }

    setLoading(true)
    setError('')
    setDetection(null)
    setTreatment(null)

    try {
      const formData = new FormData()

formData.append('file', file)

// Get logged-in user
const user = JSON.parse(
  localStorage.getItem('cropsaver_user') || 'null'
)

const userId =
  user?.id ||
  user?._id ||
  localStorage.getItem('user_name') ||
  'anonymous'

// -----------------------------
// DETECT DISEASE
// -----------------------------

const detectRes = await api.post(
  '/detect',
  formData,
  {
    params: {
      user_id: userId,
    },

    headers: {
      'Content-Type':
        'multipart/form-data',
    },
  }
)

      setDetection(detectRes.data)

      // -----------------------------
      // GET TREATMENT
      // -----------------------------

   const payload = {
  crop_name: detectRes.data.crop_name,

  disease_name: detectRes.data.disease_name,

  problem_type:
    detectRes.data.problem_type || 'disease',

  problem_name:
    detectRes.data.problem_name ||
    detectRes.data.disease_name,

  confidence:
    Number(detectRes.data.confidence),

  language:
    aiLanguageNames[language] || 'English',

  history_id:
    detectRes.data.history_id,
}
      const treatmentRes =
        await api.post(
          '/treatment',
          payload
        )

      setTreatment(
        treatmentRes.data
      )
    } catch (err) {
      console.error(err)

      const detail =
        err.response?.data?.detail

      if (Array.isArray(detail)) {
        setError(
          detail
            .map(
              (item) =>
                `${item.loc?.at(-1)}: ${
                  item.msg
                }`
            )
            .join(', ')
        )
      } else if (
        typeof detail === 'string'
      ) {
        setError(detail)
      } else {
        setError(
          t.backendConnectionError
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="detection-page">

      {/* ===============================================
          PAGE HEADER
      =============================================== */}

      <div className="detection-header">

        <span className="detection-label">
          🌿 {t.cropHealthLabel}
        </span>

        <h1>
          {t.cropDiseaseDetection}
        </h1>

        <p>
          {t.detectionDescription}
        </p>

      </div>

      {/* ===============================================
          UPLOAD CARD
      =============================================== */}

      <div className="detection-upload-card">

        <div className="detection-upload-icon">
          🌱
        </div>

        <div className="detection-upload-text">

          <h2>
            {t.uploadCropImage}
          </h2>

          <p>
            {t.uploadCropDescription}
          </p>

        </div>

        {/* ACTIONS */}

        <div className="detection-actions">

          <label className="detection-file-button">

            <span>↑</span>

            <span>
              {t.chooseImage}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

          </label>

          <span className="detection-or">
            {t.or}
          </span>

          <button
            type="button"
            className="detection-camera-button"
            onClick={() =>
              setShowCamera(
                (current) => !current
              )
            }
          >

            <span>📷</span>

            {showCamera
              ? t.closeCamera
              : t.useCamera}

          </button>

        </div>

        {/* =============================================
            CAMERA
        ============================================= */}

        {showCamera && (
          <div className="detection-camera">

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="detection-webcam"
            />

            <button
              type="button"
              onClick={captureFromCamera}
              className="detection-capture-button"
            >
              📸 {t.capturePhoto}
            </button>

          </div>
        )}

        {/* =============================================
            IMAGE PREVIEW
        ============================================= */}

        {preview && (
          <div className="detection-preview">

            <img
              src={preview}
              alt={t.selectedCropImage}
            />

            <div className="detection-preview-info">

              <span>✓</span>

              {t.imageReadyForAnalysis}

            </div>

          </div>
        )}

        {/* IMAGE HINT */}

        <p className="detection-hint">
          {t.imageUploadHint}
        </p>

        {/* =============================================
            DETECT BUTTON
        ============================================= */}

        <button
          type="button"
          disabled={!file || loading}
          onClick={handleDetect}
          className="detection-submit-button"
        >

          {loading ? (
            <>

              <span className="detection-spinner"></span>

              {t.analyzing}

            </>
          ) : (
            <>

              <span>✦</span>

              {t.detectDisease}

            </>
          )}

        </button>

        {/* ERROR */}

        {error && (
          <div className="detection-error">
            {error}
          </div>
        )}

      </div>

      {/* ===============================================
          DIAGNOSIS RESULT
      =============================================== */}

      {detection && (
        <div className="detection-result-card">

          <div className="detection-result-header">

            <div>

              <span className="detection-label">
                {t.analysisComplete}
              </span>

              <h2>
                {t.diagnosisResult}
              </h2>

            </div>

            <div className="detection-result-icon">
              ✓
            </div>

          </div>

          <div className="detection-result-grid">

            {/* RESULT DETAILS */}

            <div className="detection-result-details">

              {/* CROP */}

              <div className="detection-result-item">

                <span>
                  {t.crop}
                </span>

                <strong>
                  {detection.crop_name ||
                    t.unknownCrop}
                </strong>

              </div>

              {/* DISEASE */}

              <div className="detection-result-item">

                <span>
                  {t.disease}
                </span>

                <strong>
                  {detection.disease_name ||
                    t.unknown}
                </strong>

              </div>

              {/* CONFIDENCE */}

              <div className="detection-result-item">

                <span>
                  {t.confidence}
                </span>

                <strong>

                  {typeof detection.confidence ===
                  'number'
                    ? `${(
                        detection.confidence *
                        100
                      ).toFixed(2)}%`
                    : 'N/A'}

                </strong>

              </div>

            </div>

            {/* RESULT IMAGE */}

            {detection.image_url && (
              <img
                src={detection.image_url}
                alt={t.detectedCropImage}
                className="detection-result-image"
              />
            )}

          </div>

        </div>
      )}

      {/* ===============================================
          TREATMENT
      =============================================== */}

      {treatment && (
        <div className="treatment-card">

          {/* TREATMENT HEADER */}

          <div className="treatment-header">

            <span className="detection-label">
              🌿 {t.cropCare}
            </span>

            <h2>
              {t.treatmentRecommendation}
            </h2>

            <p>
              {t.treatmentDescription}
            </p>

          </div>

          {/* TREATMENT GRID */}

          <div className="treatment-grid">

            {/* EXPLANATION */}

            <div className="treatment-section treatment-wide">

              <span className="treatment-icon">
                💡
              </span>

              <div>

                <h3>
                  {t.explanation}
                </h3>

                <p>
                  {treatment.explanation}
                </p>

              </div>

            </div>

            {/* ORGANIC TREATMENT */}

            <div className="treatment-section">

              <span className="treatment-icon">
                🌿
              </span>

              <div>

                <h3>
                  {t.organicTreatment}
                </h3>

                <p>
                  {treatment.organic_treatment}
                </p>

              </div>

            </div>

            {/* CHEMICAL TREATMENT */}

            <div className="treatment-section">

              <span className="treatment-icon">
                🧪
              </span>

              <div>

                <h3>
                  {t.chemicalTreatment}
                </h3>

                <p>
                  {treatment.chemical_treatment}
                </p>

              </div>

            </div>

            {/* DOSAGE */}

            <div className="treatment-section">

              <span className="treatment-icon">
                💧
              </span>

              <div>

                <h3>
                  {t.dosage}
                </h3>

                <p>
                  {treatment.dosage}
                </p>

              </div>

            </div>

            {/* SPRAY SCHEDULE */}

            <div className="treatment-section">

              <span className="treatment-icon">
                📅
              </span>

              <div>

                <h3>
                  {t.spraySchedule}
                </h3>

                <p>
                  {treatment.spray_schedule}
                </p>

              </div>

            </div>

            {/* RECOVERY TIME */}

            <div className="treatment-section">

              <span className="treatment-icon">
                ⏱
              </span>

              <div>

                <h3>
                  {t.recoveryTime}
                </h3>

                <p>
                  {treatment.recovery_time}
                </p>

              </div>

            </div>

            {/* PREVENTION */}

            <div className="treatment-section">

              <span className="treatment-icon">
                🛡
              </span>

              <div>

                <h3>
                  {t.prevention}
                </h3>

                <p>
                  {treatment.prevention}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

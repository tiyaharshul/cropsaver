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

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]

    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setDetection(null)
    setTreatment(null)
    setError('')
  }

  const captureFromCamera = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return

    const blob = await fetch(imageSrc).then((response) =>
      response.blob()
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

      const detectRes = await api.post(
        '/detect',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setDetection(detectRes.data)

      const payload = {
        crop_name: detectRes.data.crop_name,
        disease_name: detectRes.data.disease_name,
        confidence: Number(
          detectRes.data.confidence
        ),

        // No longer hard-coded English
        language:
          aiLanguageNames[language] ||
          'English',
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
            .map((item) =>
              `${item.loc?.at(-1)}: ${item.msg}`
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

   return (
    <div className="detection-page">

      {/* PAGE HEADER */}
      <div className="detection-header">
        <span className="detection-label">
          🌿 CROP HEALTH
        </span>

        <h1>
          {t.cropDiseaseDetection}
        </h1>

        <p>
          Upload a clear photo of your crop and let CropSaver
          identify possible diseases and recommend treatment.
        </p>
      </div>


      {/* UPLOAD CARD */}
      <div className="detection-upload-card">

        <div className="detection-upload-icon">
          🌱
        </div>

        <div className="detection-upload-text">
          <h2>Upload crop image</h2>

          <p>
            Choose a clear image of the affected leaf or crop
          </p>
        </div>


        <div className="detection-actions">

          <label className="detection-file-button">
            <span>↑</span>
            <span>Choose Image</span>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>


          <span className="detection-or">
            or
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


        {/* CAMERA */}
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


        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="detection-preview">

            <img
              src={preview}
              alt="Selected crop"
            />

            <div className="detection-preview-info">
              <span>✓</span>
              Image ready for analysis
            </div>

          </div>
        )}


        <p className="detection-hint">
          JPG, PNG or camera photo • Clear images give better results
        </p>


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


        {error && (
          <div className="detection-error">
            {error}
          </div>
        )}

      </div>


      {/* RESULTS */}
      {detection && (
        <div className="detection-result-card">

          <div className="detection-result-header">
            <div>
              <span className="detection-label">
                ANALYSIS COMPLETE
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

            <div className="detection-result-details">

              <div className="detection-result-item">
                <span>{t.crop}</span>

                <strong>
                  {detection.crop_name ||
                    t.unknownCrop}
                </strong>
              </div>


              <div className="detection-result-item">
                <span>{t.disease}</span>

                <strong>
                  {detection.disease_name ||
                    t.unknown}
                </strong>
              </div>


              <div className="detection-result-item">
                <span>{t.confidence}</span>

                <strong>
                  {typeof detection.confidence ===
                  'number'
                    ? `${(
                        detection.confidence * 100
                      ).toFixed(2)}%`
                    : 'N/A'}
                </strong>
              </div>

            </div>


            {detection.image_url && (
              <img
                src={detection.image_url}
                alt="Detected crop"
                className="detection-result-image"
              />
            )}

          </div>

        </div>
      )}


      {/* TREATMENT */}
      {treatment && (
        <div className="treatment-card">

          <div className="treatment-header">
            <span className="detection-label">
              🌿 CROP CARE
            </span>

            <h2>
              {t.treatmentRecommendation}
            </h2>

            <p>
              Recommended steps based on your crop diagnosis
            </p>
          </div>


          <div className="treatment-grid">

            <div className="treatment-section treatment-wide">
              <span className="treatment-icon">
                💡
              </span>

              <div>
                <h3>{t.explanation}</h3>
                <p>{treatment.explanation}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                🌿
              </span>

              <div>
                <h3>{t.organicTreatment}</h3>
                <p>{treatment.organic_treatment}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                🧪
              </span>

              <div>
                <h3>{t.chemicalTreatment}</h3>
                <p>{treatment.chemical_treatment}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                💧
              </span>

              <div>
                <h3>{t.dosage}</h3>
                <p>{treatment.dosage}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                📅
              </span>

              <div>
                <h3>{t.spraySchedule}</h3>
                <p>{treatment.spray_schedule}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                ⏱
              </span>

              <div>
                <h3>{t.recoveryTime}</h3>
                <p>{treatment.recovery_time}</p>
              </div>
            </div>


            <div className="treatment-section">
              <span className="treatment-icon">
                🛡
              </span>

              <div>
                <h3>{t.prevention}</h3>
                <p>{treatment.prevention}</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )}
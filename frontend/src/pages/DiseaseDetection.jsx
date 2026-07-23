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
    <div className="max-w-3xl space-y-5">

      <h1 className="text-3xl font-bold text-green-700">
        {t.cropDiseaseDetection}
      </h1>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        <div className="flex gap-3 flex-wrap">

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={() =>
              setShowCamera(
                (current) => !current
              )
            }
          >
            {showCamera
              ? t.closeCamera
              : t.useCamera}
          </button>

        </div>

        {showCamera && (
          <div className="space-y-3">

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg"
            />

            <button
              type="button"
              onClick={captureFromCamera}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t.capturePhoto}
            </button>

          </div>
        )}

        {preview && (
          <img
            src={preview}
            alt=""
            className="rounded-lg max-h-80 border"
          />
        )}

        <button
          type="button"
          disabled={!file || loading}
          onClick={handleDetect}
          className="bg-green-700 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading
            ? t.analyzing
            : t.detectDisease}
        </button>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

      </div>

      {detection && (
        <div className="bg-white rounded-xl shadow-md p-5">

          <h2 className="text-xl font-bold mb-3">
            {t.diagnosisResult}
          </h2>

          <p>
            <strong>{t.crop}:</strong>{' '}
            {detection.crop_name ||
              t.unknownCrop}
          </p>

          <p>
            <strong>{t.disease}:</strong>{' '}
            {detection.disease_name ||
              t.unknown}
          </p>

          <p>
            <strong>{t.confidence}:</strong>{' '}
            {typeof detection.confidence ===
            'number'
              ? `${(
                  detection.confidence * 100
                ).toFixed(2)}%`
              : 'N/A'}
          </p>

          {detection.image_url && (
            <img
              src={detection.image_url}
              alt=""
              className="mt-4 rounded-lg max-h-80"
            />
          )}

        </div>
      )}

      {treatment && (
        <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

          <h2 className="text-xl font-bold">
            {t.treatmentRecommendation}
          </h2>

          <p>
            <strong>{t.explanation}:</strong>
            <br />
            {treatment.explanation}
          </p>

          <p>
            <strong>{t.organicTreatment}:</strong>
            <br />
            {treatment.organic_treatment}
          </p>

          <p>
            <strong>{t.chemicalTreatment}:</strong>
            <br />
            {treatment.chemical_treatment}
          </p>

          <p>
            <strong>{t.dosage}:</strong>
            <br />
            {treatment.dosage}
          </p>

          <p>
            <strong>{t.spraySchedule}:</strong>
            <br />
            {treatment.spray_schedule}
          </p>

          <p>
            <strong>{t.recoveryTime}:</strong>
            <br />
            {treatment.recovery_time}
          </p>

          <p>
            <strong>{t.prevention}:</strong>
            <br />
            {treatment.prevention}
          </p>

        </div>
      )}

    </div>
  )
}
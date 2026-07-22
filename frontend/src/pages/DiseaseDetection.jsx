import { useState, useRef } from "react";
import Webcam from "react-webcam";
import api from "../api/axios";

export default function DiseaseDetection() {
  const webcamRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [detection, setDetection] = useState(null);
  const [treatment, setTreatment] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setDetection(null);
    setTreatment(null);
    setError("");
  };

  const captureFromCamera = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then((r) => r.blob());

    const captured = new File([blob], "capture.jpg", {
      type: "image/jpeg",
    });

    setFile(captured);
    setPreview(imageSrc);
    setShowCamera(false);

    setDetection(null);
    setTreatment(null);
    setError("");
  };

  const handleDetect = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setDetection(null);
    setTreatment(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading image...");

      const detectRes = await api.post("/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Detect Response:", detectRes.data);

      setDetection(detectRes.data);

      const payload = {
        crop_name: detectRes.data.crop_name,
        disease_name: detectRes.data.disease_name,
        confidence: Number(detectRes.data.confidence),
        language: "en",
      };

      console.log("Treatment Payload:", payload);

      const treatmentRes = await api.post("/treatment", payload);

      console.log("Treatment Response:", treatmentRes.data);

      setTreatment(treatmentRes.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log("Backend Error:", err.response.data);

        const detail = err.response.data.detail;

        if (Array.isArray(detail)) {
          setError(
            detail
              .map(
                (d) =>
                  `${d.loc[d.loc.length - 1]} : ${d.msg}`
              )
              .join(", ")
          );
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError(JSON.stringify(detail));
        }
      } else {
        setError("Unable to connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">

      <h1 className="text-3xl font-bold text-green-700">
        Crop Disease Detection
      </h1>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        <div className="flex gap-3 flex-wrap">

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowCamera(!showCamera)}
          >
            {showCamera ? "Close Camera" : "Use Camera"}
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
              onClick={captureFromCamera}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Capture Photo
            </button>

          </div>
        )}

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg max-h-80 border"
          />
        )}

        <button
          disabled={!file || loading}
          onClick={handleDetect}
          className="bg-green-700 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Detect Disease"}
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
            Diagnosis Result
          </h2>

          <p>
            <strong>Crop:</strong>{" "}
            {detection.crop_name || "Unknown Crop"}
          </p>

          <p>
            <strong>Disease:</strong>{" "}
            {detection.disease_name || "Unknown"}
          </p>

          <p>
            <strong>Confidence:</strong>{" "}
            {typeof detection.confidence === "number"
              ? `${(detection.confidence * 100).toFixed(2)}%`
              : "N/A"}
          </p>

          {detection.image_url && (
            <img
              src={detection.image_url}
              alt="Uploaded"
              className="mt-4 rounded-lg max-h-80"
            />
          )}
        </div>
      )}

      {treatment && (
        <div className="bg-white rounded-xl shadow-md p-5 space-y-3">

          <h2 className="text-xl font-bold">
            Treatment Recommendation
          </h2>

          <p>
            <strong>Explanation:</strong><br />
            {treatment.explanation}
          </p>

          <p>
            <strong>Organic Treatment:</strong><br />
            {treatment.organic_treatment}
          </p>

          <p>
            <strong>Chemical Treatment:</strong><br />
            {treatment.chemical_treatment}
          </p>

          <p>
            <strong>Dosage:</strong><br />
            {treatment.dosage}
          </p>

          <p>
            <strong>Spray Schedule:</strong><br />
            {treatment.spray_schedule}
          </p>

          <p>
            <strong>Recovery Time:</strong><br />
            {treatment.recovery_time}
          </p>

          <p>
            <strong>Prevention:</strong><br />
            {treatment.prevention}
          </p>

        </div>
      )}

    </div>
  );
}

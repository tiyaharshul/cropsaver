import { useRef, useState } from 'react'
import api from '../api/axios'

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  const recognitionRef = useRef(null)

  const startListening = () => {
    setError('')

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError(
        'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
      )
      return
    }

    // Stop any previous recognition session
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    const recognition = new SpeechRecognition()

    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.continuous = false

    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)

      if (event.error === 'not-allowed') {
        setError('Microphone permission was denied.')
      } else {
        setError('Could not understand your voice. Please try again.')
      }
    }

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript

      setQuestion(transcript)
      setIsListening(false)

      await askCropSaver(transcript)
    }

    recognition.start()
  }

  const askCropSaver = async (message) => {
    try {
      setIsLoading(true)
      setAnswer('')
      setError('')

      const response = await api.post('/voice', {
        message,
        language: 'hi-IN',
      })

      const responseText = response.data.answer

      setAnswer(responseText)

      speakAnswer(responseText)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
          'Unable to contact CropSaver assistant.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const speakAnswer = (text) => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser.')
      return
    }

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    // Hindi voice where available.
    // English text will still generally be handled by the browser.
    speech.lang = 'hi-IN'
    speech.rate = 0.95
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
  }

  const closeAssistant = () => {
    stopSpeaking()

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    setIsListening(false)
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-leaf-700 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">
                🌱 CropSaver Assistant
              </h2>

              <p className="text-xs opacity-90">
                Speak your farming question
              </p>
            </div>

            <button
              onClick={closeAssistant}
              className="text-xl hover:opacity-70"
            >
              ✕
            </button>
          </div>

          {/* Conversation */}
          <div className="p-4 max-h-80 overflow-y-auto">

            {!question && !isListening && (
              <div className="text-center text-gray-500 py-6">
                <div className="text-4xl mb-3">👨‍🌾</div>

                <p className="font-medium">
                  Ask CropSaver anything
                </p>

                <p className="text-sm mt-1">
                  खेती से जुड़ा कोई भी सवाल पूछें
                </p>
              </div>
            )}

            {isListening && (
              <div className="text-center py-6">
                <div className="text-4xl animate-pulse mb-2">
                  🎙️
                </div>

                <p className="text-leaf-700 font-medium">
                  Listening...
                </p>

                <p className="text-sm text-gray-500">
                  बोलिए, मैं सुन रहा हूँ
                </p>
              </div>
            )}

            {question && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">
                  You said
                </p>

                <div className="bg-leaf-50 rounded-lg p-3 text-sm">
                  {question}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-sm text-gray-500 mb-4">
                🌱 CropSaver is thinking...
              </div>
            )}

            {answer && (
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  CropSaver
                </p>

                <div className="bg-green-100 rounded-lg p-3 text-sm whitespace-pre-line">
                  {answer}
                </div>

                <button
                  onClick={() => speakAnswer(answer)}
                  className="mt-2 text-sm text-leaf-700 hover:underline"
                >
                  🔊 Listen again
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm mt-3">
                {error}
              </div>
            )}
          </div>

          {/* Microphone */}
          <div className="border-t p-4 flex justify-center">
            <button
              onClick={startListening}
              disabled={isListening || isLoading}
              className="bg-leaf-700 hover:bg-leaf-800 disabled:opacity-50 text-white px-5 py-3 rounded-full font-medium"
            >
              {isListening
                ? '🎙️ Listening...'
                : isLoading
                  ? 'Thinking...'
                  : '🎤 Ask another question'}
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-leaf-700 hover:bg-leaf-800 text-white rounded-full shadow-xl text-2xl z-50 flex items-center justify-center"
        title="CropSaver Voice Assistant"
      >
        🎤
      </button>
    </>
  )
}
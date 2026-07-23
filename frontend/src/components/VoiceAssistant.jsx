
import { useRef, useState } from 'react'
import api from '../api/axios'

const languages = [
  { name: 'Hindi', label: 'हिन्दी', region: 'Hindi', speechCode: 'hi-IN', voiceCode: 'hi-IN' },
  { name: 'English', label: 'English', region: 'India', speechCode: 'en-IN', voiceCode: 'en-IN' },
  { name: 'Marwari/Rajasthani', label: 'मारवाड़ी / राजस्थानी', region: 'Rajasthan', speechCode: 'hi-IN', voiceCode: 'hi-IN' },
  { name: 'Bhojpuri', label: 'भोजपुरी', region: 'UP / Bihar', speechCode: 'hi-IN', voiceCode: 'hi-IN' },
  { name: 'Haryanvi', label: 'हरियाणवी', region: 'Haryana', speechCode: 'hi-IN', voiceCode: 'hi-IN' },
  { name: 'Gujarati', label: 'ગુજરાતી', region: 'Gujarat', speechCode: 'gu-IN', voiceCode: 'gu-IN' },
  { name: 'Marathi', label: 'मराठी', region: 'Maharashtra', speechCode: 'mr-IN', voiceCode: 'mr-IN' },
  { name: 'Punjabi', label: 'ਪੰਜਾਬੀ', region: 'Punjab', speechCode: 'pa-IN', voiceCode: 'pa-IN' },
  { name: 'Bengali', label: 'বাংলা', region: 'West Bengal', speechCode: 'bn-IN', voiceCode: 'bn-IN' },
  { name: 'Tamil', label: 'தமிழ்', region: 'Tamil Nadu', speechCode: 'ta-IN', voiceCode: 'ta-IN' },
  { name: 'Telugu', label: 'తెలుగు', region: 'Andhra Pradesh / Telangana', speechCode: 'te-IN', voiceCode: 'te-IN' },
  { name: 'Kannada', label: 'ಕನ್ನಡ', region: 'Karnataka', speechCode: 'kn-IN', voiceCode: 'kn-IN' },
  { name: 'Malayalam', label: 'മലയാളം', region: 'Kerala', speechCode: 'ml-IN', voiceCode: 'ml-IN' },
  { name: 'Odia', label: 'ଓଡ଼ିଆ', region: 'Odisha', speechCode: 'or-IN', voiceCode: 'or-IN' },
  { name: 'Assamese', label: 'অসমীয়া', region: 'Assam', speechCode: 'as-IN', voiceCode: 'as-IN' },
]

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  const recognitionRef = useRef(null)
  const recognitionSessionRef = useRef(0)
  const requestSessionRef = useRef(0)

  const cleanTextForSpeech = (text) => {
    if (!text) return ''

    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const stopRecognition = () => {
    recognitionSessionRef.current += 1

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (err) {
        console.log('Recognition already stopped:', err)
      }
      recognitionRef.current = null
    }

    setIsListening(false)
  }

  const speakAnswer = (text, language = selectedLanguage) => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser.')
      return
    }

    stopSpeaking()

    const cleanText = cleanTextForSpeech(text)
    if (!cleanText) return

    const speech = new SpeechSynthesisUtterance(cleanText)
    speech.lang = language.voiceCode
    speech.rate = 0.9
    speech.pitch = 1

    const voices = window.speechSynthesis.getVoices()
    const languagePrefix = language.voiceCode.split('-')[0].toLowerCase()

    const matchingVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(languagePrefix)
    )

    if (matchingVoice) {
      speech.voice = matchingVoice
    }

    speech.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error)
      }
    }

    window.speechSynthesis.speak(speech)
  }

  const askCropSaver = async (message, language, requestId) => {
    try {
      setIsLoading(true)
      setAnswer('')
      setError('')

      const response = await api.post('/voice', {
        message,
        language: language.name,
      })

      if (requestId !== requestSessionRef.current) return

      const responseText = response.data.answer

      if (!responseText) {
        setError('CropSaver returned an empty response.')
        return
      }

      setAnswer(responseText)
      speakAnswer(responseText, language)
    } catch (err) {
      if (requestId !== requestSessionRef.current) return

      console.error('Voice assistant error:', err)
      setError(
        err.response?.data?.detail ||
          'Unable to contact CropSaver assistant.'
      )
    } finally {
      if (requestId === requestSessionRef.current) {
        setIsLoading(false)
      }
    }
  }

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

    stopSpeaking()
    stopRecognition()

    setQuestion('')
    setAnswer('')

    recognitionSessionRef.current += 1
    const sessionId = recognitionSessionRef.current

    const recognition = new SpeechRecognition()
    recognition.lang = selectedLanguage.speechCode
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognitionRef.current = recognition

    recognition.onstart = () => {
      if (sessionId !== recognitionSessionRef.current) return
      setIsListening(true)
    }

    recognition.onend = () => {
      if (sessionId !== recognitionSessionRef.current) return

      setIsListening(false)

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null
      }
    }

    recognition.onerror = (event) => {
      if (sessionId !== recognitionSessionRef.current) return

      console.error('Speech recognition error:', event.error)
      setIsListening(false)

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null
      }

      if (event.error === 'not-allowed') {
        setError(
          'Microphone permission was denied. Please allow microphone access.'
        )
      } else if (event.error === 'no-speech') {
        setError('No speech was detected. Please try again.')
      } else if (event.error !== 'aborted') {
        setError('Could not understand your voice. Please try again.')
      }
    }

    recognition.onresult = (event) => {
      if (sessionId !== recognitionSessionRef.current) return

      const transcript = event.results[0][0].transcript

      setQuestion(transcript)
      setIsListening(false)

      const languageForRequest = { ...selectedLanguage }

      requestSessionRef.current += 1
      const requestId = requestSessionRef.current

      askCropSaver(transcript, languageForRequest, requestId)
    }

    try {
      recognition.start()
    } catch (err) {
      console.error('Unable to start microphone:', err)
      setIsListening(false)
      setError('Unable to start microphone. Please try again.')
    }
  }

  const handleLanguageChange = (event) => {
    const language = languages.find(
      (lang) => lang.name === event.target.value
    )

    if (!language) return

    stopRecognition()
    stopSpeaking()
    requestSessionRef.current += 1

    setSelectedLanguage(language)
    setIsListening(false)
    setIsLoading(false)
    setQuestion('')
    setAnswer('')
    setError('')
  }

  const closeAssistant = () => {
    stopRecognition()
    stopSpeaking()
    requestSessionRef.current += 1

    setIsListening(false)
    setIsLoading(false)
    setQuestion('')
    setAnswer('')
    setError('')
    setIsOpen(false)
  }

  const openAssistant = () => {
    setError('')
    setIsOpen(true)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="bg-leaf-700 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">🌱 CropSaver Assistant</h2>
              <p className="text-xs opacity-90">Speak in your language</p>
            </div>

            <button
              type="button"
              onClick={closeAssistant}
              className="text-xl hover:opacity-70"
              aria-label="Close voice assistant"
            >
              ✕
            </button>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              अपनी भाषा चुनें / Select your language
            </label>

            <select
              value={selectedLanguage.name}
              onChange={handleLanguageChange}
              disabled={isListening || isLoading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none"
            >
              {languages.map((language) => (
                <option key={language.name} value={language.name}>
                  {language.label} — {language.region}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {!question && !isListening && !isLoading && (
              <div className="text-center text-gray-500 py-5">
                <div className="text-4xl mb-3">👨‍🌾</div>
                <p className="font-medium text-gray-700">
                  Ask your farming question
                </p>
                <p className="text-sm mt-1">
                  अपनी खेती से जुड़ा सवाल बोलकर पूछें
                </p>
                <p className="text-xs mt-3 text-gray-400">
                  Selected: {selectedLanguage.label}
                </p>
              </div>
            )}

            {isListening && (
              <div className="text-center py-6">
                <div className="text-5xl animate-pulse mb-3">🎙️</div>
                <p className="text-leaf-700 font-semibold">Listening...</p>
                <p className="text-sm text-gray-500 mt-1">
                  बोलिए, मैं सुन रहा हूँ
                </p>
              </div>
            )}

            {question && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">👨‍🌾 You said</p>
                <div className="bg-leaf-50 rounded-lg p-3 text-sm">
                  {question}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="animate-pulse">🌱</span>
                CropSaver is thinking...
              </div>
            )}

            {answer && (
              <div>
                <p className="text-xs text-gray-500 mb-1">🌱 CropSaver</p>

                <div className="bg-green-100 rounded-lg p-3 text-sm whitespace-pre-line">
                  {answer}
                </div>

                <div className="flex gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => speakAnswer(answer, selectedLanguage)}
                    className="text-sm text-leaf-700 hover:underline"
                  >
                    🔊 Listen again
                  </button>

                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    ⏹ Stop
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm mt-3">
                {error}
              </div>
            )}
          </div>

          <div className="border-t p-4 flex justify-center">
            <button
              type="button"
              onClick={startListening}
              disabled={isListening || isLoading}
              className="bg-leaf-700 hover:bg-leaf-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition"
            >
              {isListening
                ? '🎙️ Listening...'
                : isLoading
                  ? '🌱 Thinking...'
                  : '🎤 Tap to Speak'}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={openAssistant}
        className="fixed bottom-6 right-6 w-16 h-16 bg-leaf-700 hover:bg-leaf-800 text-white rounded-full shadow-xl text-2xl z-50 flex items-center justify-center transition"
        title="CropSaver Voice Assistant"
        aria-label="Open CropSaver Voice Assistant"
      >
        🎤
      </button>
    </>
  )
}

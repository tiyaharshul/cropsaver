import { useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'
import { aiLanguageNames } from '../data/translations'

export default function AIChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const { language, t } = useLanguage()

  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || 'null'
  )

  const userId = user?.id || 'anonymous'

  const send = async () => {
    const question = input.trim()

    if (!question || loading) return

    setMessages((messages) => [
      ...messages,
      {
        role: 'user',
        text: question,
      },
    ])

    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chat', {
        user_id: userId,
        message: question,

        // Send "Kannada" instead of "kn", etc.
        language: aiLanguageNames[language] || 'English',
      })

      setMessages((messages) => [
        ...messages,
        {
          role: 'bot',
          text: res.data.reply,
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages((messages) => [
        ...messages,
        {
          role: 'bot',
          text: t.chatError,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">

      <h1 className="text-2xl font-bold text-leaf-700">
        {t.aiChatbot}
      </h1>

      <div className="bg-white rounded-lg shadow p-4 h-96 overflow-y-auto space-y-3">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap leading-relaxed ${
              message.role === 'user'
                ? 'bg-leaf-100 ml-auto'
                : 'bg-gray-100'
            }`}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <p className="text-sm text-gray-400">
            {t.thinking}
          </p>
        )}

      </div>

      <div className="flex gap-2">

        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder={t.chatPlaceholder}
        />

        <button
          onClick={send}
          disabled={loading}
          className="bg-leaf-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {t.send}
        </button>

      </div>

    </div>
  )
}
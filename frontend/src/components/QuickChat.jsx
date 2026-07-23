import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'
import { aiLanguageNames } from '../data/translations'

export default function QuickChat() {
  const { language, t } = useLanguage()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef(null)

  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || 'null'
  )

  const userId = user?.id || 'anonymous'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  const send = async () => {
    const question = input.trim()

    if (!question || loading) return

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: question,
      },
    ])

    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/chat', {
        user_id: userId,
        message: question,
        language: aiLanguageNames[language] || 'English',
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: response.data.reply,
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: t.chatError || 'Unable to get a response.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* CHAT POPUP */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-[60]
            w-[390px] max-w-[calc(100vw-3rem)]
            bg-white rounded-3xl
            border border-leaf-100
            shadow-2xl overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              bg-gradient-to-r
              from-leaf-700 to-leaf-900
              text-white
              px-5 py-4
              flex items-center justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10 h-10 rounded-xl
                  bg-white/15
                  flex items-center justify-center
                  text-xl
                "
              >
                ✨
              </div>

              <div>
                <h2 className="font-heading font-semibold">
                  CropSaver AI
                </h2>

                <p className="text-xs text-white/75">
                  {t.aiChatbot}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                w-9 h-9 rounded-full
                flex items-center justify-center
                hover:bg-white/15
                transition
                text-xl
              "
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}
          <div
            className="
              h-[340px]
              overflow-y-auto
              p-4
              bg-gradient-to-b
              from-leaf-50/70 to-white
              space-y-3
            "
          >
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center px-6">

                  <div
                    className="
                      w-14 h-14
                      mx-auto mb-4
                      rounded-2xl
                      bg-leaf-100
                      flex items-center justify-center
                      text-2xl
                    "
                  >
                    🌱
                  </div>

                  <h3
                    className="
                      font-heading font-semibold
                      text-leaf-900
                    "
                  >
                    {t.aiChatbot}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {t.chatPlaceholder}
                  </p>

                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`
                  max-w-[85%]
                  px-4 py-3
                  rounded-2xl
                  text-sm
                  whitespace-pre-wrap
                  leading-relaxed
                  ${
                    message.role === 'user'
                      ? `
                        ml-auto
                        bg-leaf-700
                        text-white
                        rounded-br-md
                      `
                      : `
                        bg-white
                        text-gray-700
                        border border-leaf-100
                        shadow-sm
                        rounded-bl-md
                      `
                  }
                `}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div
                className="
                  inline-flex items-center gap-2
                  bg-white
                  border border-leaf-100
                  rounded-2xl
                  px-4 py-3
                  text-sm text-gray-500
                  shadow-sm
                "
              >
                <span className="animate-pulse">🌱</span>
                {t.thinking}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-leaf-100 bg-white p-3">

            <div
              className="
                flex items-center gap-2
                bg-gray-50
                border border-gray-200
                rounded-2xl
                p-1.5
                focus-within:border-leaf-400
                focus-within:ring-2
                focus-within:ring-leaf-100
                transition
              "
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
                placeholder={t.chatPlaceholder}
                className="
                  flex-1
                  bg-transparent
                  px-3 py-2
                  text-sm
                  outline-none
                "
              />

              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="
                  w-10 h-10
                  rounded-xl
                  bg-leaf-700
                  text-white
                  flex items-center justify-center
                  hover:bg-leaf-800
                  hover:scale-105
                  active:scale-95
                  disabled:opacity-40
                  disabled:hover:scale-100
                  transition-all
                "
              >
                ➤
              </button>
            </div>

            <div className="text-center mt-2">
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="
                  text-xs
                  text-leaf-700
                  font-medium
                  hover:text-leaf-900
                  hover:underline
                "
              >
                Open full CropSaver AI →
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING CHAT BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="CropSaver AI Chat"
        aria-label="Open CropSaver AI Chat"
        className="
          fixed bottom-6 right-24 z-50
          w-16 h-16
          rounded-full
          bg-white
          border border-leaf-100
          text-2xl
          shadow-floaty
          flex items-center justify-center

          hover:-translate-y-1
          hover:scale-110
          hover:shadow-xl

          active:scale-95

          transition-all
          duration-300
        "
      >
        💬
      </button>
    </>
  )
}
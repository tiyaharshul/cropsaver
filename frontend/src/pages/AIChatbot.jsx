import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'
import { aiLanguageNames } from '../data/translations'

export default function AIChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef(null)

  const { language, t } = useLanguage()

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
          text: t.chatError,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full py-8 sm:py-12">

      {/* PAGE HEADING */}
      <div className="text-center mb-7">

        <div
          className="
            inline-flex items-center gap-2
            bg-leaf-100
            text-leaf-800
            rounded-full
            px-4 py-2
            text-xs font-semibold
            mb-4
          "
        >
          ✨ CropSaver AI
        </div>

        <h1
          className="
            font-heading
            text-3xl sm:text-4xl
            font-bold
            text-leaf-900
          "
        >
          {t.aiChatbot}
        </h1>

        <p
          className="
            mt-2
            text-gray-500
            max-w-xl
            mx-auto
          "
        >
          {t.chatbotCardDesc}
        </p>

      </div>

      {/* CHAT */}
      <div
        className="
          w-full
          max-w-4xl
          mx-auto
          bg-white
          rounded-3xl
          border border-leaf-100
          shadow-soft
          overflow-hidden
        "
      >

        {/* CHAT HEADER */}
        <div
          className="
            px-6 py-4
            border-b border-leaf-100
            bg-gradient-to-r
            from-leaf-50 to-white
            flex items-center gap-3
          "
        >
          <div
            className="
              w-11 h-11
              rounded-xl
              bg-leaf-700
              text-white
              flex items-center justify-center
              text-xl
              shadow-card
            "
          >
            🌱
          </div>

          <div>
            <h2
              className="
                font-heading
                font-semibold
                text-leaf-900
              "
            >
              CropSaver AI
            </h2>

            <div
              className="
                flex items-center gap-1.5
                text-xs text-gray-500
              "
            >
              <span
                className="
                  w-2 h-2
                  bg-green-500
                  rounded-full
                "
              />

              AI farming assistant
            </div>
          </div>

        </div>

        {/* MESSAGE AREA */}
        <div
          className="
            h-[460px]
            overflow-y-auto
            px-5 sm:px-7
            py-6
            bg-gradient-to-b
            from-leaf-50/40
            via-white
            to-white
          "
        >

          {messages.length === 0 && (
            <div
              className="
                h-full
                flex items-center
                justify-center
              "
            >
              <div
                className="
                  text-center
                  max-w-md
                  mx-auto
                "
              >

                <div
                  className="
                    w-20 h-20
                    rounded-3xl
                    bg-leaf-100
                    mx-auto
                    flex items-center justify-center
                    text-4xl
                    mb-5
                  "
                >
                  🌱
                </div>

                <h2
                  className="
                    font-heading
                    text-2xl
                    font-semibold
                    text-leaf-900
                  "
                >
                  {t.aiChatbot}
                </h2>

                <p
                  className="
                    text-gray-500
                    mt-2
                    leading-relaxed
                  "
                >
                  {t.chatPlaceholder}
                </p>

                <div
                  className="
                    mt-5
                    inline-flex
                    items-center gap-2
                    text-xs
                    bg-white
                    border border-leaf-100
                    rounded-full
                    px-4 py-2
                    text-gray-500
                  "
                >
                  🌐 {aiLanguageNames[language] || 'English'}
                </div>

              </div>
            </div>
          )}

          <div className="space-y-4">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`
                  flex
                  ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }
                `}
              >

                <div
                  className={`
                    max-w-[80%]
                    sm:max-w-[70%]
                    px-4 py-3
                    rounded-2xl
                    whitespace-pre-wrap
                    leading-relaxed
                    text-sm sm:text-base

                    ${
                      message.role === 'user'
                        ? `
                          bg-leaf-700
                          text-white
                          rounded-br-md
                          shadow-card
                        `
                        : `
                          bg-white
                          text-gray-700
                          border border-leaf-100
                          rounded-bl-md
                          shadow-sm
                        `
                    }
                  `}
                >
                  {message.text}
                </div>

              </div>
            ))}

            {loading && (
              <div className="flex justify-start">

                <div
                  className="
                    bg-white
                    border border-leaf-100
                    shadow-sm
                    rounded-2xl
                    rounded-bl-md
                    px-4 py-3
                    flex items-center gap-2
                    text-sm text-gray-500
                  "
                >
                  <span className="animate-pulse">🌱</span>
                  {t.thinking}
                </div>

              </div>
            )}

            <div ref={bottomRef} />

          </div>

        </div>

        {/* INPUT */}
        <div
          className="
            border-t border-leaf-100
            bg-white
            p-4 sm:p-5
          "
        >

          <div
            className="
              flex items-center gap-2
              bg-gray-50
              border border-gray-200
              rounded-2xl
              p-2

              focus-within:border-leaf-400
              focus-within:ring-4
              focus-within:ring-leaf-100/60

              transition-all
            "
          >

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  send()
                }
              }}
              placeholder={t.chatPlaceholder}
              className="
                flex-1
                bg-transparent
                outline-none
                px-3
                py-2.5
                text-gray-700
              "
            />

            <button
              type="button"
              onClick={send}
              disabled={
                loading || !input.trim()
              }
              className="
                min-w-12 h-12
                rounded-xl
                bg-leaf-700
                text-white

                flex items-center
                justify-center

                hover:bg-leaf-800
                hover:scale-105

                active:scale-95

                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:hover:scale-100

                transition-all
                duration-200
              "
            >
              ➤
            </button>

          </div>

          <p
            className="
              text-center
              text-xs
              text-gray-400
              mt-3
            "
          >
            🌱 CropSaver AI • {aiLanguageNames[language] || 'English'}
          </p>

        </div>

      </div>

    </section>
  )
}
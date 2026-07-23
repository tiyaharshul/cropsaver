import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'
import { aiLanguageNames } from '../data/translations'

export default function AIChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  const { language, t } = useLanguage()

  const user = JSON.parse(
    localStorage.getItem('cropsaver_user') || 'null'
  )

  const userId = user?.id || 'anonymous'

  /*
   * Scroll ONLY the message container.
   * This prevents the entire browser page from jumping.
   */
  useEffect(() => {
    const container = messagesRef.current

    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
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

      // Keep typing comfortable after response.
      requestAnimationFrame(() => {
        inputRef.current?.focus({
          preventScroll: true,
        })
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat-page">

      <div className="chat-container">

        {/* =========================
            CHAT HEADER
        ========================== */}

        <div className="chat-header">

          <div className="chat-header-icon">
            🌱
          </div>

          <div className="chat-header-content">

            <h1>
              {t.aiChatbot}
            </h1>

            <p>
              {t.chatbotCardDesc}
            </p>

            <span className="chat-language">
              🌐 {aiLanguageNames[language] || 'English'}
            </span>

          </div>

        </div>


        {/* =========================
            MESSAGE AREA
        ========================== */}

        <div
          ref={messagesRef}
          className="chat-messages"
        >

          {/* EMPTY CHAT */}

          {messages.length === 0 && !loading && (

            <div className="chat-welcome">

              <div className="chat-welcome-icon">
                🌱
              </div>

              <h2>
                {t.aiChatbot}
              </h2>

              <p>
                {t.chatPlaceholder}
              </p>

              <span className="chat-welcome-language">
                🌐 {aiLanguageNames[language] || 'English'}
              </span>

            </div>

          )}


          {/* MESSAGES */}

          {messages.length > 0 && (

            <div className="chat-message-list">

              {messages.map((message, index) => (

                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === 'user'
                      ? 'chat-message-row user'
                      : 'chat-message-row bot'
                  }
                >

                  {message.role === 'bot' && (
                    <div className="chat-bot-avatar">
                      🌱
                    </div>
                  )}


                  <div
                    className={
                      message.role === 'user'
                        ? 'chat-bubble chat-user-bubble'
                        : 'chat-bubble chat-bot-bubble'
                    }
                  >
                    {message.text}
                  </div>

                </div>

              ))}

            </div>

          )}


          {/* THINKING */}

          {loading && (

            <div className="chat-message-row bot">

              <div className="chat-bot-avatar">
                🌱
              </div>

              <div className="chat-bubble chat-bot-bubble chat-thinking">

                <span className="chat-thinking-dot"></span>
                <span className="chat-thinking-dot"></span>
                <span className="chat-thinking-dot"></span>

                <span className="chat-thinking-text">
                  {t.thinking}
                </span>

              </div>

            </div>

          )}

        </div>


        {/* =========================
            INPUT AREA
        ========================== */}

        <div className="chat-input-section">

          <div className="chat-input-wrapper">

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
              disabled={loading}
              autoComplete="off"
            />

            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="chat-send-button"
              aria-label="Send message"
            >
              {loading ? (
                <span className="chat-send-loader"></span>
              ) : (
                <span>➤</span>
              )}
            </button>

          </div>


          <p className="chat-input-footer">
            🌱 CropSaver AI •{' '}
            {aiLanguageNames[language] || 'English'}
          </p>

        </div>

      </div>

    </div>
  )
}
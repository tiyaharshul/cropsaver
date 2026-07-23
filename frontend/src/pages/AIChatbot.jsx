import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'


export default function AIChatbot() {

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const userId =
    localStorage.getItem('user_name') || 'anonymous'


  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })

  }, [messages, loading])


  // --------------------------------------------------
  // CLEAN RESPONSE
  // --------------------------------------------------

  const cleanText = (text) => {

    if (!text) return ''

    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
  }


  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const send = async () => {

    const message = input.trim()

    if (!message || loading) return

    const userMsg = {
      role: 'user',
      text: message,
    }

    setMessages((previous) => [
      ...previous,
      userMsg,
    ])

    setInput('')
    setLoading(true)

    try {

      const res = await api.post('/chat', {
        user_id: userId,
        message: message,
        language: 'en',
      })

      const botMessage = {
        role: 'bot',
        text: cleanText(res.data.reply),
      }

      setMessages((previous) => [
        ...previous,
        botMessage,
      ])

    } catch (error) {

      console.error(
        'Chatbot error:',
        error
      )

      setMessages((previous) => [
        ...previous,
        {
          role: 'bot',
          text:
            'Sorry, I could not answer that right now. Please try again.',
        },
      ])

    } finally {

      setLoading(false)

    }
  }


  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (event) => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault()

      send()
    }
  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="max-w-3xl mx-auto">

      {/* TITLE */}

      <div className="mb-5">

        <h1 className="text-2xl font-bold text-leaf-700">
          🌱 CropSaver AI
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Ask about crops, diseases, irrigation,
          weather, pests or government schemes.
        </p>

      </div>


      {/* CHAT CONTAINER */}

      <div
        className="
          bg-white
          rounded-xl
          shadow
          border
          border-gray-100
          h-[450px]
          overflow-y-auto
          p-5
          space-y-5
        "
      >

        {/* EMPTY STATE */}

        {messages.length === 0 && (

          <div
            className="
              h-full
              flex
              flex-col
              justify-center
              items-center
              text-center
              text-gray-400
            "
          >

            <div className="text-5xl mb-4">
              👨‍🌾
            </div>

            <p
              className="
                font-semibold
                text-gray-600
              "
            >
              How can CropSaver help?
            </p>

            <p
              className="
                text-sm
                mt-2
                max-w-sm
              "
            >
              Ask me about crop diseases,
              fertilizers, irrigation, pests,
              weather or government schemes.
            </p>

          </div>

        )}


        {/* MESSAGES */}

        {messages.map((message, index) => {

          const isUser =
            message.role === 'user'

          return (

            <div
              key={index}
              className={`flex ${
                isUser
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              <div
                className={`
                  max-w-[80%]
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  leading-7
                  ${
                    isUser
                      ? `
                        bg-leaf-700
                        text-white
                        rounded-br-md
                      `
                      : `
                        bg-gray-100
                        text-gray-800
                        rounded-bl-md
                      `
                  }
                `}
              >

                {/* NAME */}

                {!isUser && (

                  <div
                    className="
                      text-xs
                      font-semibold
                      text-leaf-700
                      mb-2
                    "
                  >
                    🌱 CropSaver
                  </div>

                )}


                {/* MESSAGE */}

                <div className="whitespace-pre-wrap break-words">
                  {message.text}
                </div>

              </div>

            </div>

          )

        })}


        {/* THINKING */}

        {loading && (

          <div className="flex justify-start">

            <div
              className="
                bg-gray-100
                rounded-2xl
                rounded-bl-md
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  text-leaf-700
                  mb-1
                "
              >
                🌱 CropSaver
              </p>

              <div
                className="
                  text-sm
                  text-gray-500
                  animate-pulse
                "
              >
                Thinking...
              </div>

            </div>

          </div>

        )}


        <div ref={messagesEndRef} />

      </div>


      {/* INPUT AREA */}

      <div
        className="
          mt-4
          flex
          gap-3
          items-center
        "
      >

        <input
          className="
            flex-1
            border
            border-gray-300
            rounded-xl
            px-4
            py-3
            outline-none
            focus:border-leaf-700
            bg-white
          "
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask about crops, pests, weather..."
        />


        <button
          type="button"
          onClick={send}
          disabled={
            loading ||
            !input.trim()
          }
          className="
            bg-leaf-700
            hover:bg-leaf-800
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          {loading
            ? 'Thinking...'
            : 'Send'}
        </button>

      </div>

    </div>

  )
}
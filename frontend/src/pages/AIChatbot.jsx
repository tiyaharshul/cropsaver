import { useState } from 'react'
import api from '../api/axios'

export default function AIChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('user_name') || 'anonymous'

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/chat', { user_id: userId, message: input, language: 'en' })
      setMessages((m) => [...m, { role: 'bot', text: res.data.reply }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-leaf-700">AI Chatbot</h1>
      <div className="bg-white rounded-lg shadow p-4 h-96 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              m.role === 'user' ? 'bg-leaf-100 ml-auto text-right' : 'bg-gray-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Thinking...</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about crops, pests, weather..."
        />
        <button onClick={send} className="bg-leaf-700 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  )
}

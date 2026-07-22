import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    localStorage.setItem('user_name', name)
    navigate('/')
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-xl font-bold text-leaf-700">Login</h1>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="w-full bg-leaf-600 text-white rounded py-2 hover:bg-leaf-700">
        Continue
      </button>
    </form>
  )
}

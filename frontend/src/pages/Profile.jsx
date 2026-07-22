export default function Profile() {
  const name = localStorage.getItem('user_name') || 'Guest Farmer'

  return (
    <div className="max-w-md bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-leaf-700 mb-4">Profile</h1>
      <p><strong>Name:</strong> {name}</p>
      {}
    </div>
  )
}

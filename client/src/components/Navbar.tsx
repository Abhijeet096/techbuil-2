import { Link } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="font-semibold">SiteBuilder</Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name}</span>
              <Link to="/ai" className="border rounded px-3 py-1">AI</Link>
              <button className="border rounded px-3 py-1" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import PublicView from './pages/PublicView'
import { useAuth } from './store/auth'
import AIGenerator from './pages/AIGenerator'

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAuth((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/editor/:id" element={<RequireAuth><Editor /></RequireAuth>} />
        <Route path="/ai" element={<RequireAuth><AIGenerator /></RequireAuth>} />
        <Route path="/p/:slug" element={<PublicView />} />
      </Routes>
    </BrowserRouter>
  )
}

import { FormEvent, useState } from 'react'
import { useAuth } from '../store/auth'

export default function Register() {
  const register = useAuth((s) => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(undefined)
    try {
      await register(name, email, password)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Register failed')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-black text-white rounded px-4 py-2">Sign up</button>
        <a className="block text-center text-sm text-gray-600" href="/login">Already have an account? Sign in</a>
      </form>
    </div>
  )
}

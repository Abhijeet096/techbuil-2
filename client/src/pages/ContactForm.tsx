import { useState } from 'react'
import { api } from '../lib/api'
import { useParams } from 'react-router-dom'

export default function ContactForm() {
  const { slug } = useParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function send() {
    await api.post(`/contact/${slug}`, { name, email, message })
    setSent(true)
  }

  if (sent) return <div className="p-4 bg-green-50 text-green-700 rounded">Thanks! We will be in touch.</div>

  return (
    <div className="space-y-3">
      <input className="w-full border rounded px-3 py-2" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea className="w-full border rounded px-3 py-2" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="bg-black text-white rounded px-4 py-2" onClick={send}>Send</button>
    </div>
  )
}

import { useState } from 'react'
import { api } from '../lib/api'

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('Generate a landing page hero for a startup that sells smart water bottles')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      const { data } = await api.post('/ai/generate', { prompt })
      setResult(data.text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Website Content Generator</h1>
      <textarea className="w-full border rounded p-3 h-40" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="bg-black text-white rounded px-4 py-2" onClick={run} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
      {result && (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded whitespace-pre-wrap">{result}</pre>
      )}
    </div>
  )
}

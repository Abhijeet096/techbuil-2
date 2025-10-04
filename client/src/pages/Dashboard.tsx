import { useEffect, useState } from 'react'
import { useSites } from '../store/sites'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { sites, fetch, create, remove, publish } = useSites()
  const [name, setName] = useState('')

  useEffect(() => {
    fetch()
  }, [fetch])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <input className="border rounded px-3 py-2 flex-1" placeholder="New site name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2" onClick={async () => { if (!name) return; const s = await create(name); setName(''); }}>Create</button>
      </div>

      <ul className="space-y-3">
        {sites.map((s) => (
          <li key={s._id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              {s.publishSlug && <a className="text-sm text-blue-600" href={`/p/${s.publishSlug}`} target="_blank">Published: /p/{s.publishSlug}</a>}
            </div>
            <div className="flex gap-2">
              <Link to={`/editor/${s._id}`} className="border rounded px-3 py-1">Edit</Link>
              <button className="border rounded px-3 py-1" onClick={() => publish(s._id)}>Publish</button>
              <button className="border rounded px-3 py-1" onClick={() => remove(s._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

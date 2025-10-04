import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import ContactForm from './ContactForm'

function RenderNode({ node }: any) {
  if (!node) return null
  if (node.type === 'heading') return <h2 className="text-2xl font-bold">{node.props?.text ?? 'Heading'}</h2>
  if (node.type === 'text') return <p className="text-gray-700">{node.props?.text ?? 'Text'}</p>
  if (node.type === 'button') return <button className="bg-black text-white rounded px-3 py-1">{node.props?.label ?? 'Button'}</button>
  if (node.type === 'image') return <div className="bg-gray-200 h-32 rounded" />
  if (node.children?.length)
    return <div className="space-y-4">{node.children.map((c: any) => <RenderNode key={c.id} node={c} />)}</div>
  return <div />
}

export default function PublicView() {
  const { slug } = useParams()
  const [site, setSite] = useState<any>()

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/publish/p/${slug}`)
      setSite(data.site)
    }
    load()
  }, [slug])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <RenderNode node={site?.pages?.[0]?.tree} />
      <section>
        <h3 className="text-xl font-semibold mb-2">Contact</h3>
        <ContactForm />
      </section>
    </div>
  )
}

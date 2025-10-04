import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { api } from '../lib/api'

// Minimal block types
export type Block = {
  id: string
  type: 'section' | 'heading' | 'text' | 'image' | 'button'
  props?: any
}

export default function Editor() {
  const { id } = useParams()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/sites')
      const site = data.sites.find((s: any) => s._id === id)
      setName(site?.name ?? '')
      setBlocks(site?.pages?.[0]?.tree?.children ?? [])
    }
    load()
  }, [id])

  function addBlock(type: Block['type']) {
    setBlocks((prev) => [...prev, { id: crypto.randomUUID(), type, props: {} }])
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    setBlocks((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  const palette = useMemo(() => (
    <div className="space-y-2">
      {['section', 'heading', 'text', 'image', 'button'].map((t) => (
        <button key={t} className="w-full border rounded px-3 py-2" onClick={() => addBlock(t as Block['type'])}>{t}</button>
      ))}
    </div>
  ), [])

  async function save() {
    const pageTree = { id: 'root', type: 'section', props: {}, children: blocks }
    await api.put(`/sites/${id}`, { pages: [{ path: '/', name: 'Home', tree: pageTree }] })
  }

  return (
    <div className="grid grid-cols-12 h-screen">
      <aside className="col-span-3 border-r p-4 space-y-4">
        <div className="font-semibold">Blocks</div>
        {palette}
        <button className="w-full bg-black text-white rounded px-4 py-2" onClick={save}>Save</button>
      </aside>
      <main className="col-span-9 p-6 overflow-auto">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={rectSortingStrategy}>
            <div className="space-y-4">
              {blocks.map((b) => (
                <SortableBlock key={b.id} block={b} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  )
}

function SortableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border rounded p-4 bg-white">
      {block.type === 'heading' && <h2 className="text-2xl font-bold">Heading</h2>}
      {block.type === 'text' && <p className="text-gray-700">Text</p>}
      {block.type === 'image' && <div className="bg-gray-200 h-32 rounded" />}
      {block.type === 'button' && <button className="bg-black text-white rounded px-3 py-1">Button</button>}
      {block.type === 'section' && <div className="bg-gray-50 border-dashed border p-6">Section</div>}
    </div>
  )
}

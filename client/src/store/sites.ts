import { create } from 'zustand'
import { api } from '../lib/api'

export type Site = {
  _id: string
  name: string
  theme?: Record<string, unknown>
  pages: any[]
  publishSlug?: string
}

type SitesState = {
  sites: Site[]
  fetch: () => Promise<void>
  create: (name: string) => Promise<Site>
  update: (id: string, data: Partial<Site>) => Promise<Site>
  remove: (id: string) => Promise<void>
  publish: (id: string) => Promise<string>
}

export const useSites = create<SitesState>((set, get) => ({
  sites: [],
  async fetch() {
    const { data } = await api.get('/sites')
    set({ sites: data.sites })
  },
  async create(name) {
    const { data } = await api.post('/sites', { name })
    set({ sites: [data.site, ...get().sites] })
    return data.site
  },
  async update(id, payload) {
    const { data } = await api.put(`/sites/${id}`, payload)
    set({ sites: get().sites.map((s) => (s._id === id ? data.site : s)) })
    return data.site
  },
  async remove(id) {
    await api.delete(`/sites/${id}`)
    set({ sites: get().sites.filter((s) => s._id !== id) })
  },
  async publish(id) {
    const { data } = await api.post(`/publish/${id}`)
    set({ sites: get().sites.map((s) => (s._id === id ? { ...s, publishSlug: data.slug } : s)) })
    return data.slug
  },
}))

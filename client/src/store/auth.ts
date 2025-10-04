import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, setAuthToken } from '../lib/api'

export type User = { id: string; email: string; name: string }

type AuthState = {
  user?: User
  token?: string
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: undefined,
      token: undefined,
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password })
        set({ user: data.user, token: data.token })
        setAuthToken(data.token)
      },
      async register(name, email, password) {
        const { data } = await api.post('/auth/register', { name, email, password })
        set({ user: data.user, token: data.token })
        setAuthToken(data.token)
      },
      async logout() {
        await api.post('/auth/logout')
        set({ user: undefined, token: undefined })
        setAuthToken(undefined)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token)
      },
    }
  )
)

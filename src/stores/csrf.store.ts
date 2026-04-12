import { create } from "zustand"

interface CsrfState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useCsrfStore = create<CsrfState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}))

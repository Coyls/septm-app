import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ExtensionId, WonderId, Side } from "@/lib/types"

export type WizardPlayerType = "friend" | "guest" | null

export interface WizardPlayer {
  id: string
  playerType: WizardPlayerType
  name: string
  userId?: string
  email?: string
  wonderId: WonderId | null
  wonderSide: Side
  backendPlayerId?: string
}

interface GameWizardState {
  step: 1 | 2 | 3
  selectedExtensions: ExtensionId[]
  players: WizardPlayer[]
  createdGameId: string | null

  setStep: (step: 1 | 2 | 3) => void
  initSelfPlayer: (userId: string) => void
  addPlayer: () => void
  removePlayer: (id: string) => void
  updatePlayer: (id: string, updates: Partial<Omit<WizardPlayer, "id">>) => void
  toggleExtension: (extensionId: ExtensionId) => void
  setCreatedGameId: (id: string) => void
  setBackendPlayerIds: (backendPlayers: Array<{ id: string; name: string }>) => void
  reset: () => void
}

const initialState = {
  step: 1 as const,
  selectedExtensions: ["VANILLA"] as ExtensionId[],
  players: [] as WizardPlayer[],
  createdGameId: null,
}

export const useGameWizardStore = create<GameWizardState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      initSelfPlayer: (userId) =>
        set((state) => {
          if (state.players.length === 0) {
            return {
              players: [
                {
                  id: crypto.randomUUID(),
                  playerType: "friend" as const,
                  name: "",
                  userId,
                  wonderId: null,
                  wonderSide: "A",
                },
              ],
            }
          }
          // Fix stale player 0 if userId or playerType is wrong
          const [self, ...rest] = state.players
          if (self.userId === userId && self.playerType === "friend") return state
          return {
            players: [
              { ...self, playerType: "friend" as const, userId },
              ...rest,
            ],
          }
        }),

      addPlayer: () =>
        set((state) => ({
          players: [
            ...state.players,
            {
              id: crypto.randomUUID(),
              playerType: null,
              name: "",
              wonderId: null,
              wonderSide: "A",
            },
          ],
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      updatePlayer: (id, updates) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      toggleExtension: (extensionId) =>
        set((state) => {
          if (extensionId === "VANILLA") return state
          const has = state.selectedExtensions.includes(extensionId)
          return {
            selectedExtensions: has
              ? state.selectedExtensions.filter((e) => e !== extensionId)
              : [...state.selectedExtensions, extensionId],
          }
        }),

      setCreatedGameId: (id) => set({ createdGameId: id }),

      // Map backend player IDs by index (backend preserves creation order)
      setBackendPlayerIds: (backendPlayers) =>
        set((state) => ({
          players: state.players.map((p, idx) => ({
            ...p,
            backendPlayerId: backendPlayers[idx]?.id ?? p.backendPlayerId,
          })),
        })),

      reset: () => set(initialState),
    }),
    {
      name: "septm-game-wizard",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return sessionStorage
        return {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        }
      }),
      skipHydration: true,
    },
  ),
)

import { Player } from './types'
import { create } from 'zustand'
import type { Tiles } from './types'

interface StoreState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void

  tiles: Tiles
  setTiles: (tiles: Tiles) => void

  player: Player
  setPlayer: (player: Player) => void
  togglePlayer: () => void
}

export const useStore = create<StoreState>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  tiles: Array.from({ length: 9 }).fill(null) as Tiles,
  setTiles: (tiles) => set({ tiles }),

  player: Player.X,
  setPlayer: (player) => set({ player }),
  togglePlayer: () => set((state) => ({ player: state.player === Player.X ? Player.O : Player.X })),
}))

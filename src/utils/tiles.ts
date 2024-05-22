import { isNotNull } from './type-guards'
import { TILE_SIZE, TILE_GAP } from '../constants'
import type { Tiles } from '../types'

export const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + TILE_GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + TILE_GAP) * -1
  return [x, y, 0] as const
}

export const getDefaultTiles = (): Tiles => Array.from({ length: 9 }).fill(null) as Tiles

export const isTilePartOfWinningLine = (index: number, gameOutcome: number[] | null) =>
  isNotNull(gameOutcome) && gameOutcome.includes(index)

export const GRID_CONTAINER_BASE_POSITION = {
  x: -(TILE_SIZE + TILE_GAP),
  y: TILE_SIZE + TILE_GAP,
  z: 0,
} as const

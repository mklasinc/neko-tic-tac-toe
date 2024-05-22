export const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + GAP) * -1
  return [x, y, 0] as const
}

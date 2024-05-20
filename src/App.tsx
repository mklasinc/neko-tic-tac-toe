import { Tile } from './Tile'
import { areValuesEqual } from './utils/eq'
import { isNotNull } from './utils/type-guards'
import { Loader } from './Loader'
import WavyText from './WavyText'
import { Player } from './types'
import { useStore } from './store'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import React, { Suspense } from 'react'
import type { Tiles, GameOutcome } from './types'

const TILE_SIZE = 1
const GAP = 0.2

const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + GAP) * -1
  return [x, y, 0] as const
}

const getDefaultTiles = (): Tiles => Array.from({ length: 9 }).fill(null) as Tiles
// const getDefaultTiles = (): Tiles => [Player.X, Player.X, Player.X, Player.O, null, null, null, null, Player.O]

const isTilePartOfWinningLine = (tiles: Tiles, index: number) => {
  // check rows
  if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[1], tiles[2])) return [0, 1, 2].includes(index)
  if (isNotNull(tiles[3]) && areValuesEqual(tiles[3], tiles[4], tiles[5])) return [3, 4, 5].includes(index)
  if (isNotNull(tiles[6]) && areValuesEqual(tiles[6], tiles[7], tiles[8])) return [6, 7, 8].includes(index)

  // check columns
  if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[3], tiles[6])) return [0, 3, 6].includes(index)
  if (isNotNull(tiles[1]) && areValuesEqual(tiles[1], tiles[4], tiles[7])) return [1, 4, 7].includes(index)
  if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[5], tiles[8])) return [2, 5, 8].includes(index)

  // check diagonals
  if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[4], tiles[8])) return [0, 4, 8].includes(index)
  if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[4], tiles[6])) return [2, 4, 6].includes(index)
}

export default function App() {
  // const { color } = useControls({
  //   color: '#ff0000',
  // })

  const isLoading = useStore((state) => state.isLoading)

  const tiles = useStore((state) => state.tiles)
  const setTiles = useStore((state) => state.setTiles)

  const player = useStore((state) => state.player)
  const setPlayer = useStore((state) => state.setPlayer)
  const togglePlayer = useStore((state) => state.togglePlayer)

  const gameOutcome = React.useMemo<GameOutcome>(() => {
    // check rows
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[1], tiles[2])) return tiles[0]
    if (isNotNull(tiles[3]) && areValuesEqual(tiles[3], tiles[4], tiles[5])) return tiles[3]
    if (isNotNull(tiles[6]) && areValuesEqual(tiles[6], tiles[7], tiles[8])) return tiles[6]

    // check columns
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[3], tiles[6])) return tiles[0]
    if (isNotNull(tiles[1]) && areValuesEqual(tiles[1], tiles[4], tiles[7])) return tiles[1]
    if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[5], tiles[8])) return tiles[2]

    // check diagonals
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[4], tiles[8])) return tiles[0]
    if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[4], tiles[6])) return tiles[2]

    return tiles.every(isNotNull) ? 'draw' : null
  }, [tiles])

  const isGameOver = isNotNull(gameOutcome)
  const hasPlayerWonTheGame = gameOutcome === Player.X || gameOutcome === Player.O

  return (
    <>
      <Loader />
      <Canvas>
        <Suspense fallback={<Loader.Trigger />}>
          <OrbitControls />
          <color attach="background" args={['#eeeeee']} />
          {/* <axesHelper /> */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <directionalLight position={[0, 0, 5]} intensity={0.5} />
          <directionalLight position={[0, 0, -5]} intensity={0.5} />
          <ambientLight intensity={0.5} />

          <group position-x={-(TILE_SIZE + GAP)} position-y={TILE_SIZE + GAP}>
            {tiles.map((_, index) => (
              <Tile
                key={`tile-${index}-${isGameOver}`}
                position={getTilePosition(index)}
                size={TILE_SIZE}
                state={hasPlayerWonTheGame && isTilePartOfWinningLine(tiles, index) ? 'success' : 'idle'}
                currentPlayer={player}
                value={tiles[index]}
                isAvailable={!isGameOver && tiles[index] === null}
                onClick={() => {
                  const canPlaceTile = tiles[index] === null

                  if (!canPlaceTile) return

                  setTiles(
                    tiles.map((tile, tileIndex) => {
                      if (index === tileIndex) return player
                      return tile
                    })
                  )

                  togglePlayer()
                }}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      <div className="ui">
        <WavyText text="Tic tac toe" replay={!isLoading} delay={0.9} />
        {!isGameOver && <div className="status">Player {player}'s turn</div>}
        {isGameOver && (
          <>
            <div className="status">
              {gameOutcome === Player.X && 'Player X won!'}
              {gameOutcome === Player.O && 'Player O won!'}
              {gameOutcome === 'draw' && 'This was a draw!'}
            </div>
            <div className="btn-container">
              <button
                className="btn"
                onClick={() => {
                  setTiles(getDefaultTiles())
                  setPlayer(Player.X)
                }}
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

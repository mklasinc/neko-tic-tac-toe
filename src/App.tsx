import { Tile } from './Tile'
import { Player } from './types'
import { areValuesEqual } from './utils/eq'
import { isNotNull } from './utils/type-guards'
import { Loader } from './Loader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import React, { Suspense } from 'react'

const TILE_SIZE = 1
const GAP = 0.2

const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + GAP) * -1
  return [x, y, 0] as const
}

type Tiles = (keyof typeof Player | null)[]

type GameOutcome = keyof typeof Player | 'draw' | null

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

  const [tiles, setTiles] = React.useState<Tiles>(getDefaultTiles())
  const [player, setPlayer] = React.useState<Player>(Player.X)

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
    <Loader.Provider>
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
                key={index}
                position={getTilePosition(index)}
                size={TILE_SIZE}
                state={hasPlayerWonTheGame && isTilePartOfWinningLine(tiles, index) ? 'success' : 'idle'}
                value={tiles[index]}
                isAvailable={!isGameOver && tiles[index] === null}
                onClick={() => {
                  const canPlaceTile = tiles[index] === null

                  if (!canPlaceTile) return

                  setTiles((tiles) => {
                    return tiles.map((tile, tileIndex) => {
                      if (index === tileIndex) return player
                      return tile
                    })
                  })

                  setPlayer((player) => (player === Player.X ? Player.O : Player.X))
                }}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      <div className="ui">
        <h1>Tic tac toe</h1>
        {!isGameOver && <div>Player {player}'s turn</div>}
        {isGameOver && (
          <>
            <div>Game is over</div>
            {gameOutcome === Player.X && <div>Player X won</div>}
            {gameOutcome === Player.O && <div>Player O won</div>}
            {gameOutcome === 'draw' && <div>This was a draw!</div>}
            <button
              onClick={() => {
                setTiles(getDefaultTiles())
                setPlayer(Player.X)
              }}
            >
              Reset
            </button>
          </>
        )}
      </div>
    </Loader.Provider>
  )
}

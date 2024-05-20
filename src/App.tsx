import { useMyMaterialGUI } from './materials/Material'
import * as Effects from './effects'
import { Character } from './physics/character/Character'
import { PhysicsScene } from './physics'
import { Tile } from './Tile'
import { Player } from './types'
import { areValuesEqual } from './utils/eq'
import { isNotNull } from './utils/type-guards'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import React from 'react'

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

  return (
    <>
      <Canvas>
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
              state="default"
              value={tiles[index]}
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
    </>
  )
}

import { Tile } from './Tile'
import { areValuesEqual } from './utils/eq'
import { isNotNull, isNull } from './utils/type-guards'
import { Loader } from './Loader'
import { Player } from './types'
import { useStore } from './store'
import {
  useTileContainerWinnerRevealEffect,
  useTileRevealEffect,
  useTileWinningLineRevealEffect,
  useTitleRevealEffect,
} from './App.animations'
import { TILE_SIZE, TILE_GAP } from './constants'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import React, { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Group } from 'three'
import type { Tiles } from './types'

const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + TILE_GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + TILE_GAP) * -1
  return [x, y, 0] as const
}

const getDefaultTiles = (): Tiles => Array.from({ length: 9 }).fill(null) as Tiles

export default function App() {
  const isLoading = useStore((state) => state.isLoading)

  const tiles = useStore((state) => state.tiles)
  const setTiles = useStore((state) => state.setTiles)

  const player = useStore((state) => state.player)
  const setPlayer = useStore((state) => state.setPlayer)
  const togglePlayer = useStore((state) => state.togglePlayer)

  const gameOutcome = React.useMemo(() => {
    // check rows
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[1], tiles[2])) return [0, 1, 2]
    if (isNotNull(tiles[3]) && areValuesEqual(tiles[3], tiles[4], tiles[5])) return [3, 4, 5]
    if (isNotNull(tiles[6]) && areValuesEqual(tiles[6], tiles[7], tiles[8])) return [6, 7, 8]

    // check columns
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[3], tiles[6])) return [0, 3, 6]
    if (isNotNull(tiles[1]) && areValuesEqual(tiles[1], tiles[4], tiles[7])) return [1, 4, 7]
    if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[5], tiles[8])) return [2, 5, 8]

    // check diagonals
    if (isNotNull(tiles[0]) && areValuesEqual(tiles[0], tiles[4], tiles[8])) return [0, 4, 8]
    if (isNotNull(tiles[2]) && areValuesEqual(tiles[2], tiles[4], tiles[6])) return [2, 4, 6]

    return tiles.every(isNotNull) ? [] : null
  }, [tiles])

  const isTilePartOfWinningLine = (index: number) => isNotNull(gameOutcome) && gameOutcome.includes(index)

  const isGameOver = isNotNull(gameOutcome)
  const winner = isGameOver ? tiles[gameOutcome[0]] ?? null : null
  const hasWinner = isNotNull(winner)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridContainerRef = useRef<Group>(null)
  const gridContainerBasePosition = useRef({
    x: -(TILE_SIZE + TILE_GAP),
    y: TILE_SIZE + TILE_GAP,
    z: 0,
  }).current

  useTitleRevealEffect({ target: titleRef, trigger: !isLoading, transition: { delay: 0.2 } })
  useTileRevealEffect({ target: gridContainerRef, trigger: !isLoading })

  useTileContainerWinnerRevealEffect({ target: gridContainerRef, trigger: hasWinner })
  useTileWinningLineRevealEffect({ target: gridContainerRef, trigger: hasWinner, gameOutcome })

  return (
    <>
      <Loader />
      <Canvas>
        <color attach="background" args={['#f2e7d4']} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <directionalLight position={[5, 5, 5]} color={'#ffa300'} />
        <directionalLight position={[-5, 5, 5]} />
        <ambientLight intensity={0.8} />

        <group ref={gridContainerRef} position-x={gridContainerBasePosition.x} position-y={gridContainerBasePosition.y}>
          {tiles.map((_, index) => (
            <group key={index} position={getTilePosition(index)}>
              <group name="animation-container">
                <Tile
                  size={TILE_SIZE}
                  state={isNotNull(winner) && isTilePartOfWinningLine(index) ? 'success' : 'idle'}
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
              </group>
            </group>
          ))}
        </group>
      </Canvas>

      <div className="ui">
        <h1 ref={titleRef}>Tic Tac Toe</h1>
        <AnimatePresence mode="wait" initial={false}>
          <div className="game-status-text">
            <motion.div
              key={`${isGameOver}-${player}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut', delay: 0.05 } }}
              exit={{ y: -10, opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
            >
              {!isGameOver && `Player ${player}'s turn`}
              {isGameOver && winner === Player.X && 'Player X won!'}
              {isGameOver && winner === Player.O && 'Player O won!'}
              {isGameOver && isNull(winner) && 'This was a draw!'}
            </motion.div>
          </div>
        </AnimatePresence>

        <div className="footer" data-show={isGameOver}>
          <AnimatePresence>
            {isGameOver && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, ease: 'easeOut', delay: isNotNull(winner) ? 0.5 : 0 },
                }}
                exit={{ y: -10, opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
                className="btn-container"
              >
                <button
                  className="btn"
                  onClick={() => {
                    setTiles(getDefaultTiles())
                    setPlayer(Player.X)
                  }}
                >
                  Reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

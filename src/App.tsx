import { Tile } from './Tile'
import { areValuesEqual } from './utils/eq'
import { isArray, isNotNull } from './utils/type-guards'
import { Loader } from './Loader'
import WavyText from './WavyText'
import { Player } from './types'
import { useStore } from './store'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import React, { Suspense, useEffect, useRef } from 'react'
import { AnimatePresence, animate, motion, motionValue, useMotionValue } from 'framer-motion'
import { Group } from 'three'
import { mapLinear } from 'three/src/math/MathUtils'
import type { Tiles } from './types'

const TILE_SIZE = 1
const GAP = 0.2

const getTilePosition = (index: number) => {
  const x = (index % 3) * (TILE_SIZE + GAP)
  const y = Math.floor(index / 3) * (TILE_SIZE + GAP) * -1
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
  const winner = isGameOver ? tiles[gameOutcome[0]] : null

  const gridContainerRef = useRef<Group>(null)
  const tileRefs = useRef<Group[]>([])

  useEffect(() => {
    if (!isGameOver || !isArray(gameOutcome)) return

    gameOutcome.map((_, index) => {
      const delay = index * 0.1

      const z = motionValue(0)

      return animate(z, [0, 0.5, 0], {
        duration: 0.4,
        delay,
        ease: 'easeInOut',
        onUpdate: (value) => {
          if (!tileRefs.current[gameOutcome[index]]) return
          ;(tileRefs.current[gameOutcome[index]] as Group).position.z = value
        },
      })
    })
  }, [isGameOver, gameOutcome])

  const gridContainerBasePosition = useRef({
    x: -(TILE_SIZE + GAP),
    y: TILE_SIZE + GAP,
    z: 0,
  }).current

  useEffect(() => {
    if (!gridContainerRef.current || (isArray(gameOutcome) && gameOutcome.length === 0)) return

    const startRotationX = gridContainerRef.current.rotation.x
    const startRotationY = gridContainerRef.current.rotation.y

    const targetRotationX = isNotNull(gameOutcome) ? Math.PI * 0.1 : 0
    const targetRotationY = targetRotationX * -1

    const controls = animate(0, 1, {
      type: 'spring',
      damping: 10,
      stiffness: 150,
      delay: 0.15,
      onUpdate: (value) => {
        if (!gridContainerRef.current) return
        gridContainerRef.current.rotation.y = mapLinear(value, 0, 1, startRotationY, targetRotationY)
        gridContainerRef.current.rotation.x = mapLinear(value, 0, 1, startRotationX, targetRotationX)
      },
    })

    return () => controls.pause()
  }, [gameOutcome])

  useEffect(() => {
    if (isLoading) return

    const controls = Array.from({ length: 9 })
      .fill(null)
      .map((mv, index) =>
        animate(0, 1, {
          delay: 0.85 + index * 0.035, // stagger delay
          type: 'spring',
          damping: 8,
          stiffness: 200,
          onUpdate: (progress) => {
            const scale = mapLinear(progress, 0, 1, 0.85, 1)
            const rotationY = mapLinear(progress, 0, 1, Math.PI * 0.25, 0)
            if (tileRefs.current[index]) {
              tileRefs.current[index].scale.setScalar(scale)
              tileRefs.current[index].position.y = mapLinear(progress, 0, 1, -0.3, 0)
              tileRefs.current[index].rotation.y = rotationY
            }
          },
        })
      )

    // Stop animations on unmount
    return () => controls.forEach((control) => control.pause())
  }, [isLoading])

  return (
    <>
      <Loader />
      <Canvas>
        <Suspense fallback={<Loader.Trigger />}>
          <OrbitControls />
          <color attach="background" args={['#f2e7d4']} />
          {/* <axesHelper /> */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <directionalLight position={[5, 5, 5]} color={'#ffa300'} />
          <directionalLight position={[-5, 5, 5]} />
          <ambientLight intensity={0.8} />

          <group
            ref={gridContainerRef}
            position-x={gridContainerBasePosition.x}
            position-y={gridContainerBasePosition.y}
          >
            {tiles.map((_, index) => (
              <group key={index} position={getTilePosition(index)}>
                <group
                  ref={(ref) => {
                    // @ts-ignore
                    tileRefs.current[index] = ref
                  }}
                >
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
        </Suspense>
      </Canvas>

      <div className="ui">
        <WavyText text="Tic tac toe" replay={!isLoading} delay={1.1} />
        <AnimatePresence mode="wait" initial={false}>
          <div className="game-status-text">
            <motion.div
              key={`${isGameOver}-${player}`}
              initial={{ y: '30%', opacity: 0 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut', delay: 0.05 } }}
              exit={{ y: '-30%', opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
            >
              {!isGameOver && `Player ${player}'s turn`}
              {isGameOver && winner === Player.X && 'Player X won!'}
              {isGameOver && winner === Player.O && 'Player O won!'}
              {isGameOver && winner === null && 'This was a draw!'}
            </motion.div>
          </div>
        </AnimatePresence>

        {isGameOver && (
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
        )}
      </div>
    </>
  )
}

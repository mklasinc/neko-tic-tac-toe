import React from 'react'
import { RoundedBox, Html, useCursor } from '@react-three/drei'
import { animate, useMotionValue } from 'framer-motion'
import type { GroupProps } from '@react-three/fiber'
import type { Player } from '../types'
import type { Group } from 'three'

interface TileProps extends GroupProps {
  size: number
  state: 'idle' | 'success' | 'error'
  value: keyof typeof Player | null
  isAvailable?: boolean
  currentPlayer?: keyof typeof Player
}

const colors: Record<TileProps['state'], string> = {
  idle: '#fff8e2',
  success: '#3bff98',
  error: '#ff3b3b',
}

export const Tile = ({
  size = 1,
  state = 'idle',
  value = null,
  isAvailable = true,
  currentPlayer,
  onClick,
  ...props
}: TileProps) => {
  const ref = React.useRef<Group>(null)

  const [hovered, setHovered] = React.useState(false)
  useCursor(hovered && isAvailable)

  const pointerEvents = React.useMemo(
    () =>
      isAvailable
        ? {
            onPointerEnter: (e: any) => {
              e.stopPropagation()
              setHovered(true)
            },
            onPointerLeave: (e: any) => {
              e.stopPropagation()
              setHovered(false)
            },
            onClick: (e: any) => {
              e.stopPropagation()
              if (typeof onClick === 'function') onClick(e)
              setHovered(false)

              animate(hoverOffset, 0, {
                type: 'spring',
                stiffness: 500,
                damping: 10,
              })
            },
          }
        : {},
    [isAvailable, onClick]
  )

  const hoverOffset = useMotionValue(0)

  hoverOffset.on('change', (offset) => {
    if (!ref.current) return
    ref.current.position.z = offset
  })

  React.useEffect(() => {
    if (!ref.current || !isAvailable) return

    const controls = animate(hoverOffset, hovered && isAvailable ? size * 0.4 : 0, { duration: 0.15 })

    return controls.stop
  }, [hovered, isAvailable])

  return (
    <group ref={ref} {...props}>
      <RoundedBox
        args={[size, size, size] as any}
        radius={0.2}
        bevelSegments={4}
        smoothness={4}
        creaseAngle={0.4}
        {...pointerEvents}
      >
        <meshStandardMaterial attach="material" toneMapped={false} color={colors[state]} />
        <Html
          wrapperClass="webgl-ui-overlay"
          center
          transform
          position-z={size * 0.51}
          zIndexRange={[1, 99]}
          scale={0.2}
        >
          <div
            className="player-mark"
            data-state={state}
            data-preview={hovered && isAvailable}
            // use scale to fix blurriness on Safari
            style={{ transform: 'scale(5)' }}
          >
            <div>{value ?? (hovered && isAvailable ? currentPlayer : '')}</div>
          </div>
        </Html>
      </RoundedBox>
    </group>
  )
}

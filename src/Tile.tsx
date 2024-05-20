import { isNotNull } from './utils/type-guards'
import { RoundedBox, Html, useCursor } from '@react-three/drei'
import React from 'react'
import type { GroupProps } from '@react-three/fiber'
import type { Player } from './types'

interface TileProps extends GroupProps {
  size: number
  state: 'idle' | 'success' | 'error'
  value: keyof typeof Player | null
  isAvailable?: boolean
}

const colors: Record<TileProps['state'], string> = {
  idle: '#def0ff',
  success: '#3bff98',
  error: '#ff3b3b',
}

export const Tile = ({ size = 1, state = 'idle', value = null, isAvailable = true, onClick, ...props }: TileProps) => {
  const ref = React.useRef(null)
  const [hovered, setHovered] = React.useState(false)

  useCursor(hovered && isAvailable)

  const pointerEvents = isAvailable
    ? { onClick, onPointerEnter: () => setHovered(true), onPointerLeave: () => setHovered(false) }
    : {}

  return (
    <group ref={ref} {...props} {...pointerEvents}>
      <RoundedBox
        args={[size, size, size] as any} // Width, height, depth. Default is [1, 1, 1]
        radius={0.2} // Radius of the rounded corners. Default. Default is 4
        bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry. is 0.05
        smoothness={4} // The number of curve segments
        creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
      >
        <meshStandardMaterial attach="material" toneMapped={false} color={colors[state]} />
        {isNotNull(value) && (
          <Html center transform position-z={size * 0.51} zIndexRange={[1, 99]}>
            <div className="player-mark" data-state={state}>
              <div>{value}</div>
            </div>
          </Html>
        )}
      </RoundedBox>
    </group>
  )
}

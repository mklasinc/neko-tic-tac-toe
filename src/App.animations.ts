import { isNull } from './utils/type-guards'
import React, { type MutableRefObject } from 'react'
import { animate, stagger, type Transition, motionValue } from 'framer-motion'
import Splitting from 'splitting'
import { mapLinear } from 'three/src/math/MathUtils'
import type { Group } from 'three'

interface AnimationEffectProps<T> {
  trigger: boolean
  transition?: Transition
  target: MutableRefObject<T | null>
}

export const useTitleRevealEffect = ({ target, trigger, transition = {} }: AnimationEffectProps<HTMLElement>) => {
  const hasSplitText = React.useRef(false)
  const delay = transition?.delay ?? 0

  React.useEffect(() => {
    if (!trigger || !target.current) return

    if (!hasSplitText.current) {
      Splitting({ target: target.current })
      hasSplitText.current = true
    }

    const children = Array.from(target.current.querySelectorAll('.splitting .char'))

    animate(
      children,
      {
        opacity: [0, 1],
        y: [20, 0],
      },
      {
        type: 'spring',
        damping: 10,
        stiffness: 300,
        duration: 0.5,
        delay: stagger(0.02, { startDelay: delay }),
      }
    )
  }, [trigger, target, delay])
}

export const useTileRevealEffect = ({ target, trigger }: AnimationEffectProps<Group>) => {
  React.useEffect(() => {
    if (!trigger || !target.current) return

    const tiles = target.current.children.map((child) => child.getObjectByName('animation-container') as Group)

    const controls = tiles.map((tile, index) =>
      animate(0, 1, {
        delay: index * 0.035,
        type: 'spring',
        damping: 8,
        stiffness: 200,
        onUpdate: (progress) => {
          const scale = mapLinear(progress, 0, 1, 0.85, 1)
          const rotationY = mapLinear(progress, 0, 1, Math.PI * 0.25, 0)
          if (tile) {
            tile.scale.setScalar(scale)
            tile.position.y = mapLinear(progress, 0, 1, -0.3, 0)
            tile.rotation.y = rotationY
          }
        },
      })
    )

    return () => controls.forEach((control) => control.pause())
  }, [trigger])
}

export const useTileWinningLineRevealEffect = ({
  target,
  trigger,
  gameOutcome,
}: AnimationEffectProps<Group> & {
  gameOutcome: number[] | null
}) => {
  React.useEffect(() => {
    if (isNull(target.current) || isNull(gameOutcome)) return

    const tiles = target.current.children.map((child) => child.getObjectByName('animation-container') as Group)

    ;(gameOutcome ?? []).map((_, index) => {
      const delay = index * 0.1
      const z = motionValue(0)
      return animate(z, [0, 0.5, 0], {
        duration: 0.4,
        delay,
        ease: 'easeInOut',
        onUpdate: (value) => {
          if (tiles[gameOutcome[index]]) tiles[gameOutcome[index]].position.z = value
        },
      })
    })
  }, [trigger, target])
}

export const useTileContainerWinnerRevealEffect = ({ target, trigger }: AnimationEffectProps<Group>) => {
  React.useEffect(() => {
    if (!target.current) return

    const startRotationX = target.current.rotation.x
    const startRotationY = target.current.rotation.y

    const targetRotationX = trigger ? Math.PI * 0.1 : 0
    const targetRotationY = targetRotationX * -1

    const controls = animate(0, 1, {
      type: 'spring',
      damping: 10,
      stiffness: 150,
      delay: 0.15,
      onUpdate: (value) => {
        if (!target.current) return
        target.current.rotation.y = mapLinear(value, 0, 1, startRotationY, targetRotationY)
        target.current.rotation.x = mapLinear(value, 0, 1, startRotationX, targetRotationX)
      },
    })

    return controls.stop
  }, [trigger, target])
}

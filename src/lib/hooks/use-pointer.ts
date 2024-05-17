import { useWindowSize } from './use-window-size'
import React from 'react'
import * as THREE from 'three'

export const usePointer = () => {
  const [position] = React.useState(new THREE.Vector3())
  const { width, height } = useWindowSize()

  const normalize = React.useCallback((value: number, dimension: number) => {
    return (value / dimension) * 2 - 1
  }, [])

  React.useEffect(() => {
    if (!width || !height) return

    function onDown(event: TouchEvent | MouseEvent) {
      const { clientX, clientY } = (event as TouchEvent).changedTouches
        ? (event as TouchEvent).changedTouches[0]
        : (event as MouseEvent)
      position.x = normalize(clientX, width as number)
      position.y = normalize(clientY, height as number)
    }

    function onMove(event: TouchEvent | MouseEvent) {
      const { clientX, clientY } = (event as TouchEvent).changedTouches
        ? (event as TouchEvent).changedTouches[0]
        : (event as MouseEvent)
      position.x = normalize(clientX, width as number)
      position.y = normalize(clientY, height as number)
    }

    function onUp(event: TouchEvent | MouseEvent) {
      const { clientX, clientY } = (event as TouchEvent).changedTouches
        ? (event as TouchEvent).changedTouches[0]
        : (event as MouseEvent)
      position.x = normalize(clientX, width as number)
      position.y = normalize(clientY, height as number)
    }

    function removeMouseEventListeners() {
      window.removeEventListener('mousedown', onDown, false)
      window.removeEventListener('mouseup', onUp, false)
      window.removeEventListener('mousemove', onMove, false)
      window.removeEventListener('touchstart', removeMouseEventListeners, false)
    }

    function addEventListeners() {
      window.addEventListener('mousedown', onDown, { passive: true })
      window.addEventListener('mouseup', onUp, { passive: true })
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('touchstart', onDown, { passive: true })
      window.addEventListener('touchend', onUp, { passive: true })
      window.addEventListener('touchmove', onMove, { passive: true })

      // remove mouse event listeners if a touch event is detected
      window.addEventListener('touchstart', removeMouseEventListeners, false)
    }

    function removeEventListeners() {
      window.removeEventListener('mousedown', onDown, false)
      window.removeEventListener('mouseup', onUp, false)
      window.removeEventListener('mousemove', onMove, false)
      window.removeEventListener('touchstart', onDown, false)
      window.removeEventListener('touchend', onUp, false)
      window.removeEventListener('touchmove', onMove, false)
      window.removeEventListener('touchstart', removeMouseEventListeners, false)
    }

    addEventListeners()
    return () => {
      removeEventListeners()
    }
  }, [width, height])

  return position
}

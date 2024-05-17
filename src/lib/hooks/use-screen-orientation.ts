import { delay } from './utils'
import React from 'react'

function deviceIsPortrait() {
  if (window.screen.orientation && Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
    return window.screen.orientation.type.includes('portrait')
  }
  return window.innerHeight / window.innerWidth > 1
}

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = React.useState<'landscape' | 'portrait' | null>(null)

  const updateOrientation = (_: Event) => {
    if (typeof window === 'undefined') return

    // wait to make sure the correct window.innerWidth/innerHeight values are available
    delay(100).then(() => {
      const orientation = deviceIsPortrait() ? 'portrait' : 'landscape'
      setOrientation(orientation)
    })
  }

  React.useEffect(() => {
    updateOrientation({} as Event)
    window.addEventListener('orientationchange', updateOrientation, false)
    return () => {
      window.removeEventListener('orientationchange', updateOrientation, false)
    }
  }, [])

  return orientation
}

export default useScreenOrientation

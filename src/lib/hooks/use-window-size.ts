import { useResize } from './use-resize'
import React from 'react'

const isSSR = typeof window === 'undefined'

export const useWindowSize = (
  wait = 200
): {
  width?: number
  height?: number
} => {
  const getWindowSize = React.useCallback(
    () => ({
      width: isSSR ? undefined : window.innerWidth,
      height: isSSR ? undefined : window.innerHeight,
    }),
    []
  )
  const [windowSize, setWindowSize] = React.useState(getWindowSize)

  useResize(() => {
    setWindowSize(getWindowSize)
  }, wait)

  return windowSize
}

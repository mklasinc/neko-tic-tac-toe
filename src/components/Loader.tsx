import { useStore } from '../store'
import { LOADER_SEQUENCE_DURATION } from '../constants'
import React, { useEffect, useRef } from 'react'

export const Loader = () => {
  const [showLoaderAnimation, setShowLoaderAnimation] = React.useState(true)
  const [loaderText, setLoaderText] = React.useState('X')
  const setIsLoading = useStore((state) => state.setIsLoading)
  const intervalId = useRef<number | null>(null)

  // Show loader sequence for a set duration
  // then set global loading state to false, but keep loader visible for a bit longer for animation purpose
  useEffect(() => {
    let timeoutId: number | null = null

    timeoutId = setTimeout(() => {
      setIsLoading(false)
      timeoutId = setTimeout(() => setShowLoaderAnimation(false), 150)
    }, LOADER_SEQUENCE_DURATION)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  //  X|O loader animation
  useEffect(() => {
    if (!showLoaderAnimation) return

    intervalId.current = setInterval(() => {
      setLoaderText((prev) => (prev === 'X' ? 'O' : 'X'))
    }, 200)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [showLoaderAnimation])

  // Set global loading state to true when loader is visible
  useEffect(() => {
    document.body.dataset.isReady = (!showLoaderAnimation).toString()
  }, [showLoaderAnimation])

  return <div className="loader">{loaderText}</div>
}

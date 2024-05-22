import { useStore } from './store'
import React, { useEffect, useRef } from 'react'

export const Loader = () => {
  const [showLoaderAnimation, setShowLoaderAnimation] = React.useState(true)
  const [loaderText, setLoaderText] = React.useState('X')
  const isLoading = useStore((state) => state.isLoading)
  const intervalId = useRef<number | null>(null)

  //  X|O loader animation
  useEffect(() => {
    if (!showLoaderAnimation) return

    intervalId.current = setInterval(() => {
      setLoaderText((prev) => (prev === 'X' ? 'O' : 'X'))
    }, 150)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [showLoaderAnimation])

  // set loader state on the body
  useEffect(() => {
    document.body.dataset.isReady = (!showLoaderAnimation).toString()
  }, [showLoaderAnimation])

  // stop loader animation when loading sequence is done
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setShowLoaderAnimation(false), 1000)
    }
  }, [isLoading])

  return <div className="loader">{loaderText}</div>
}

const Trigger = () => {
  const setIsLoading = useStore((state) => state.setIsLoading)

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])
  return null
}

Loader.Trigger = Trigger

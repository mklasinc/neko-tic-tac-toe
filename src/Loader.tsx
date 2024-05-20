import React, { useEffect, useRef } from 'react'

interface LoaderPops {
  show: boolean
  setShow: (show: boolean) => void
}

const LoaderContext = React.createContext<LoaderPops>({
  show: false,
  setShow: () => {
    /* noop */
  },
})

export const Provider = (props: React.PropsWithChildren<{}>) => {
  const [show, setShow] = React.useState(false)

  return <LoaderContext.Provider value={{ show, setShow }}>{props.children}</LoaderContext.Provider>
}

export const Loader = () => {
  const [playAnimation, setPlayAnimation] = React.useState(true)
  const [loaderText, setLoaderText] = React.useState('X')
  const { show } = React.useContext(LoaderContext)

  const intervalId = useRef<number | null>(null)

  useEffect(() => {
    if (!show) {
      setTimeout(() => setPlayAnimation(false), 1000)
    }
  }, [show])

  useEffect(() => {
    if (!playAnimation) return

    intervalId.current = setInterval(() => {
      setLoaderText((prev) => (prev === 'X' ? 'O' : 'X'))
    }, 150)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [playAnimation, show])

  return (
    <div className="loader" data-show={playAnimation}>
      {loaderText}
    </div>
  )
}

const Trigger = () => {
  const { setShow } = React.useContext(LoaderContext)

  useEffect(() => {
    return () => {
      setShow(false)
    }
  }, [])
  return null
}

Loader.Provider = Provider
Loader.Trigger = Trigger

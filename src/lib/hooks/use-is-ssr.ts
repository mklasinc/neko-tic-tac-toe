import React from 'react'

export const useIsSSR = () => {
  // we always start off in "SSR mode", to ensure our initial browser render
  // matches the SSR render
  const [isSsr, setIsSsr] = React.useState(true)

  React.useEffect(() => {
    // `useEffect` never runs on the server, so we must be on the client if
    // we hit this block
    setIsSsr(typeof window === 'undefined')
  }, [])

  return isSsr
}

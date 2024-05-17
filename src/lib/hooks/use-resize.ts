import { debounce } from './utils'
import React from 'react'

export const useResize = (callback: (event: Event) => void, wait = 250): void => {
  const handleResize = React.useMemo(
    () => (wait !== 0 ? debounce((event: Event) => callback(event), wait) : (event: Event) => callback(event)),
    [wait, callback]
  )

  React.useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}

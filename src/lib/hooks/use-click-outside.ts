import React from 'react'

export const useClickOutside = (element: React.RefObject<Element>, callback: (event: MouseEvent) => void): void => {
  const handleClick = React.useCallback(
    (event: MouseEvent) => {
      if (element.current && !element.current?.contains(event.target as Node)) {
        callback(event)
      }
    },
    [callback, element]
  )

  React.useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}

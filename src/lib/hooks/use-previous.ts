import React from 'react'

export const usePrevious = <T extends {}>(value: T): T | undefined => {
  const previousValue = React.useRef<T>()

  React.useEffect(() => {
    previousValue.current = value
  }, [value])

  return previousValue.current
}

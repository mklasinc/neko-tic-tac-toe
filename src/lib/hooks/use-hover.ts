import { RefObject, useEffect } from 'react'

const isSSR = typeof window !== undefined

export const useOnHover = (
  ref: RefObject<HTMLElement>,
  inCallback: () => void = () => {
    /* */
  },
  outCallback: () => void = () => {
    /* */
  }
) => {
  useEffect(() => {
    if (!isSSR && ref.current) {
      ref.current.addEventListener('mouseenter', inCallback)
      ref.current.addEventListener('mouseleave', outCallback)
    }

    return () => {
      if (!isSSR) {
        window.removeEventListener('mousemove', inCallback)
        window.removeEventListener('mousemove', outCallback)
      }
    }
  }, [ref, inCallback, outCallback])
}

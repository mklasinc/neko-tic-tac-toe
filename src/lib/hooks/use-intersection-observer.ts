import React from 'react'

const INTERSECTION_OBSERVER_CONFIG = {
  threshold: 0.0,
  triggerOnce: true,
  rootMargin: '0px',
}

export function useIntersectionObserver(target: HTMLElement, config = {}, rootEl: HTMLElement | null = null) {
  const [isIntersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const options = {
      root: rootEl,
      ...INTERSECTION_OBSERVER_CONFIG,
      ...config,
    }

    const observer = new IntersectionObserver(function (entries) {
      if (options.triggerOnce) {
        if (entries[0].isIntersecting) {
          setIntersecting(true)
          observer.unobserve(target)
        }
      } else {
        setIntersecting(entries[0].isIntersecting)
      }
    }, options)

    if (!target) {
      console.warn(`No target specified - use useRef() hook to pass the target value`)
      return
    }

    observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [target, rootEl, config, setIntersecting])

  return isIntersecting
}

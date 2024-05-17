import { addLeadingZero, dateUtils } from './utils'
import React from 'react'

interface useCountdownProps {
  startTime: number
  endTime: number
}

export const useCountdown = ({ startTime, endTime }: useCountdownProps) => {
  const intervalId = React.useRef<ReturnType<typeof setInterval>>()
  const [countdown, setCountdown] = React.useState(endTime - startTime > 0 ? endTime - startTime : 0)

  React.useEffect(() => {
    if (countdown > 0) {
      intervalId.current = setInterval(() => {
        const currentTime = Date.now()
        const timeLeft = endTime - currentTime
        if (timeLeft >= 0) {
          setCountdown(timeLeft)
        } else {
          setCountdown(0)
          clearInterval(intervalId.current)
        }
      }, 1000)

      return () => clearInterval(intervalId.current)
    }
  }, [startTime, endTime, countdown])

  return {
    countdown,
    days: addLeadingZero(dateUtils.getDays(countdown)),
    hours: addLeadingZero(dateUtils.getHours(countdown)),
    minutes: addLeadingZero(dateUtils.getMinutes(countdown)),
    seconds: addLeadingZero(dateUtils.getSeconds(countdown)),
  }
}

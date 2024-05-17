export function delay(millis = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, millis))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

const getDays = (timeMS: number) => Math.floor(timeMS / (1000 * 60 * 60 * 24))

const getHours = (timeMS: number) => Math.floor((timeMS % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

const getMinutes = (timeMS: number) => Math.floor((timeMS % (1000 * 60 * 60)) / (1000 * 60))

const getSeconds = (timeMS: number) => Math.floor((timeMS % (1000 * 60)) / 1000)

export const addLeadingZero = (value: string | number): string => (Number(value) < 10 ? `0${value}` : String(value))

export const dateUtils = {
  getDays,
  getHours,
  getMinutes,
  getSeconds,
}

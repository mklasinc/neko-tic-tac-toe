export const isNull = (value: any): value is null => value === null
export const isNotNull = <T>(value: T | null): value is T => !isNull(value)

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'
export const isNotUndefined = <T>(value: T | undefined): value is T => !isUndefined(value)

export const isNumber = (value: any): value is number => typeof value === 'number'
export const isNotNumber = <T>(value: T | number): value is T => !isNumber(value)

export const isString = (value: any): value is string => typeof value === 'string'
export const isNotString = <T>(value: T | string): value is T => !isString(value)

export const isObject = (value: any): value is object =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
export const isNotObject = <T>(value: T | object): value is T => !isObject(value)

export const isArray = (value: any): value is any[] => Array.isArray(value)
export const isNotArray = <T>(value: T | any[]): value is T => !isArray(value)

export const isEmpty = (value: any): boolean => {
  if (isNull(value) || isUndefined(value)) {
    return true
  }

  if (isString(value) || isArray(value)) {
    return value.length === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}
export const isNotEmpty = (value: any): boolean => !isEmpty(value)

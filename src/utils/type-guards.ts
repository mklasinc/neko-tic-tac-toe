export const isNull = (value: any): value is null => value === null
export const isNotNull = <T>(value: T | null): value is T => !isNull(value)

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'
export const isNotUndefined = <T>(value: T | undefined): value is T => !isUndefined(value)

export const isNullOrUndefined = (value: any): value is null | undefined => isNull(value) || isUndefined(value)
export const isNotNullOrUndefined = <T>(value: T | null | undefined): value is T =>
  isNotNull(value) && isNotUndefined(value)

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isNotBoolean = <T>(value: T | boolean): value is T => !isBoolean(value)

export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isNotFunction = (value: any) => !isFunction(value)

export const isNumber = (value: any): value is number => typeof value === 'number'
export const isNotNumber = <T>(value: T | number): value is T => !isNumber(value)

export const isString = (value: any): value is string => typeof value === 'string'
export const isNotString = <T>(value: T): value is T => !isString(value)

export const isObject = (value: any): value is object =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
export const isNotObject = (value: any): value is object => !isObject(value)

export const isArray = (value: any): value is any[] => Array.isArray(value)
export const isNotArray = (value: any): value is any[] => !isArray(value)

export const isDate = (value: any): value is Date => value instanceof Date
export const isNotDate = (value: any): value is Date => !isDate(value)

export const isMap = (value: any): value is Map<any, any> => value instanceof Map
export const isNotMap = (value: any): value is Map<any, any> => !isMap(value)

export const isEmpty = (value: any): boolean => {
  if (isNullOrUndefined(value)) {
    return true
  }

  if (isString(value) || isArray(value)) {
    return value.length === 0
  }

  if (isMap(value)) {
    return value.size === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}
export const isNotEmpty = <T>(value: T): value is T => !isEmpty(value)

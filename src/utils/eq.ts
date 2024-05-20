export const areValuesEqual = (...values: any[]) => values.every((value, index, array) => value === array[0])

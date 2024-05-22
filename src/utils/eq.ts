export const areValuesEqual = (...values: any[]) => values.every((value, _, array) => value === array[0])

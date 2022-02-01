/**
 * Forces any non-array value into an array.
 */
export function arrayWrap(value) {
  if (!Array.isArray(value)) {
    value = [value]
  }
  return value
}

export function isArrayReady(value) {
  return (
    value !== null &&
    value !== undefined &&
    Array.isArray(value) &&
    value.length !== 0
  )
}

export function isObjectReady(value) {
  return (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null &&
    Object.keys(value).length !== 0
  )
}

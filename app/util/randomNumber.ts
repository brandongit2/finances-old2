/**
 * @param min - Minimum integer to output (inclusive)
 * @param max - Maximum integer to output (exclusive)
 */
export function randomInt(min: number, max: number): number {
  if (min > max) throw new Error(`min cannot be greater than max.`)
  if (!Number.isInteger(min)) throw new Error(`min must be an integer.`)
  if (!Number.isInteger(max)) throw new Error(`max must be an integer.`)

  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * @param min - Minimum number to output
 * @param max - Maximum number to output
 */
export function randomFloat(min: number, max: number): number {
  if (min > max) throw new Error(`min cannot be greater than max.`)

  return Math.random() * (max - min) + min
}

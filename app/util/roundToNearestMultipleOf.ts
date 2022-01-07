export default function roundToNearestMultipleOf(n: number, factor: number): number {
  return Math.round(n / factor) * factor
}

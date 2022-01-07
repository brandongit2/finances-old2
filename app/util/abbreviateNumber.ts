export default function abbreviateNumber(num: number): string {
  const log = Math.round(Math.log10(num))
  if (log < 3) return String(num)
  if (log < 6) return num / 1e3 + `K`
  if (log < 9) return num / 1e6 + `M`
  return num / 1e9 + `B`
}

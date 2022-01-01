const $ = (cents: number): string => {
  return `$` + (cents / 100).toFixed(2)
}

export default $

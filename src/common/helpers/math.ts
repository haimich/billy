export function getAverage(list: number[]): number {
  if (list == null || list.length === 0) {
    return 0
  }
  
  return list.reduce((val1, val2) => val1 + val2) / list.length
}

export function round(value: number, decimals: number = 2): number {
  return Number(value.toFixed(decimals))
}
export function getAverage(list: number[]): number {
  if (list == null || list.length === 0) {
    return 0
  }

  let avg = list.reduce((val1, val2) => val1 + val2) / list.length
  
  return avg
}

export function round(value: number, decimals: number = 2): number {
  return Number(value.toFixed(decimals))
}

export function getPreTaxAmount(taxrate: number, netAmount: number): number {
  return round(netAmount * (taxrate / 100 + 1))
}

export function getNetAmount(taxrate: number, preTaxAmount: number): number {
  let tax = taxrate / 100 + 1

  return round(preTaxAmount / tax)
}

export function getVatAmount(taxrate: number, preTaxAmount: number): number {
  if (taxrate === 0) {
    return 0
  } else {
    return round(preTaxAmount - getNetAmount(taxrate, preTaxAmount))
  }
}

export function getTaxrate(preTaxAmount: number, vatAmount: number): number {
  if (preTaxAmount === vatAmount) {
    return 0
  }

  let diff = preTaxAmount - vatAmount

  return round((vatAmount / diff) * 100)
}

export function hasDecimals(value: number): boolean {
  return ! (Math.floor(value) === value)
}
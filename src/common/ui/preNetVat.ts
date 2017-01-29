import { numberFormatterDb, numberFormatterView } from '../ui/formatters'
import { getNetAmount as netAmount, getVatAmount as vatAmount, getPreTaxAmount as preAmount, hasDecimals } from '../helpers/math'
import { amountType } from '../components/PreTaxNetAmountComponent'

export function getNetAmount(amount: string, taxrate: string): string {
  if (amount === '' || taxrate === '') {
    return ''
  }

  let net = netAmount(numberFormatterDb(taxrate), numberFormatterDb(amount))
  return numberFormatterView(net)
}

export function getPreTaxAmount(amount: string, taxrate: string): string {
  if (amount === '' || taxrate === '') {
    return ''
  }

  let preTax = preAmount(numberFormatterDb(taxrate), numberFormatterDb(amount))
  return numberFormatterView(preTax)
}

export function getVatAmount(amount: string, taxrate: string, amountType: amountType): string {
  if (amount === '' || taxrate === '') {
    return ''
  }

  let vat

  if (amountType === 'preTax') {
    vat = vatAmount(numberFormatterDb(taxrate), numberFormatterDb(amount))
  } else if (amountType === 'net') {
    vat = vatAmount(numberFormatterDb(taxrate), numberFormatterDb(getPreTaxAmount(amount, taxrate)))
  }

  return numberFormatterView(vat)
}

export function getCalculatedAmount(amount: string, taxrate: string, amountType: amountType): string {
  if (amountType == null) {
    return ''
  } else if (amountType === 'preTax') {
    return getNetAmount(amount, taxrate)
  } else if (amountType === 'net') {
    return getPreTaxAmount(amount, taxrate)
  }
}

import * as moment from 'moment'

export function dateFormatter(value: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value).format('DD.MM.YYYY')
}
export function currencyFormatter(value: number): string {
  return value.toLocaleString('de-DE') + ' €'
}

/**
 * Accepts int and float values (with . or , as separator)
 * 
 * 123,45 => 123.45
 * 123 => 123
 * 123.45 => 123.45
 */
export function convertToNumber(value?: string): number {
  if (value == null) {
    return 0
  }
  return parseFloat(value.replace(',','.').replace(' ',''))
}
import * as moment from 'moment'

export function dateFormatterView(value: string | undefined): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
}

export function dateFormatterDb(value: string | undefined): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
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
  return parseFloat(value.replace(',', '.').replace(' ', ''))
}
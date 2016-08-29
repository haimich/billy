import * as moment from 'moment'

export function dateFormatter(value: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value).format('DD.MM.YYYY')
}

export function currencyFormatter(value: number): string {
  return '€' + value.toLocaleString('de-DE')
}
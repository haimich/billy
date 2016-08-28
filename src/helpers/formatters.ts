import * as moment from 'moment'

export function dateFormatter(value: string): string {
  return moment(value).format('DD.MM.YYYY')
}

export function currencyFormatter(value: number): string {
  return '€' + value.toLocaleString('de-DE')
}
import * as moment from 'moment'

export function dateFormatter(value: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value).format('DD.MM.YYYY')
}

export function formatDateForInput(date: Date): string {
  return moment(date).format('YYYY-MM-DD')
}

export function currencyFormatter(value: number): string {
  return '€' + value.toLocaleString('de-DE')
}
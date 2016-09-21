import * as moment from 'moment'

export function dateFormatterView(value?: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
}

export function dateFormatterDb(value?: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
}

export function currencyFormatter(value: number): string {
  return value.toLocaleString('de-DE') + ' €'
}

export function numberFormatterDb(value?: string): number {
  if (value == null) {
    return 0
  }
  return parseFloat(value.replace(',', '.').replace(' ', ''))
}

export function numberFormatterView(value?: number): string {
  if (value == null) {
    return ''
  }
  return String(value).replace('.', ',')
}

import * as moment from 'moment'
import * as path from 'path'
import { hasDecimals } from '../helpers/math'
import t from '../helpers/i18n'

export function dateFormatterView(value?: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
}

export function dateFormatterYearView(value?: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'YYYY-MM-DD').format('YYYY')
}

export function dateFormatterMonthView(value?: string): number {
  if (value == null || value === '') {
    return null
  }

  return moment(value, 'YYYY-MM-DD').month()
}

export function dateFormatterDb(value?: string): string {
  if (value == null || value === '') {
    return ''
  }

  return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
}

export function currencyFormatter(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'
}

export function percentageFormatter(value: number): string {
  return value + ' %'
}

export function numberFormatterDb(value?: string): number {
  if (value == null) {
    return 0
  }
  return parseFloat(value.replace(',', '.').replace(' ', ''))
}

export function numberFormatterView(value?: number, decimals = 2): string {
  if (value == null) {
    return ''
  }
  return value.toFixed(decimals).replace('.', ',')
}

export function getFilename(filePath: string): string {
  if (filePath == null || filePath === '') {
    return ''
  } else {
    return path.basename(filePath)
  }
}

export function dayFormatter(cell, row): string {
  if (cell == null || cell === 0) {
    return ''
  }

  return cell + ' ' + (cell === 1 ? t('Tag') : t('Tage'))
}

export function formatTaxrate(value: number): string {
  let tax = hasDecimals(value)
    ? numberFormatterView(value)
    : numberFormatterView(value, 0)

  return tax + ' %'
}
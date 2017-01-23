import { dateFormatterYearView, dateFormatterMonthView } from './formatters'
import { asc, desc } from '../helpers/sorters'
import { round } from '../helpers/math'
import * as moment from 'moment'
import t from '../helpers/i18n'

export const SELECT_TYPE_ALL = t('Alle')
export const MONTHS = [t('Januar'), t('Februar'), t('März'), t('April'), t('Mai'), t('Juni'), t('Juli'), t('August'), t('September'), t('Oktober'), t('November'), t('Dezember')]
export const COLORS = [
  '54, 162, 235',
  '255, 105, 180',
  '243, 134, 47',
  '136, 216, 176',
  '255, 204, 92',
  '119, 91, 163',
  '47, 47, 47',
  '210, 117, 117',
  '209, 31, 63',
  '234, 240, 241',
  '246, 41, 106'
]

/**
 * Extract all years that occur in the date fields of a list of elements (eg. bills or expenses).
 */
export function getAvailableYears<T>(list: T[], dateFieldName: string): string[] {
  let years: string[] = []

  for (let element of list) {
    if (element[dateFieldName] == null || element[dateFieldName] === '') {
      continue
    }

    let newDate = dateFormatterYearView(element[dateFieldName])

    if (years.indexOf(newDate) === -1) {
      years.push(newDate)
    }
  }

  return years.sort(desc)
}

/**
 * Extract all months that occur in the date fields of a list of elements (eg. bills or expenses).
 * 
 * Sample output ['January']
 */
export function getAvailableMonths<T>(list: T[], dateFieldName: string, selectedYear: string): string[] {
  let months: number[] = []

  for (let element of list) {
    if (element[dateFieldName] == null || ! matchesYear(element[dateFieldName], selectedYear)) {
      continue
    }

    let newDate = dateFormatterMonthView(element[dateFieldName])

    if (months.indexOf(newDate) === -1) {
      months.push(newDate)
    }
  }

  let availableMonths = []
  for (let i = 0; i < MONTHS.length; i++) {
    if (months.indexOf(i) !== -1) {
      availableMonths.push(MONTHS[i])
    }
  }

  return availableMonths
}


export function getMonthNumbers(): string[] {
  return Array.from(Array(12).keys()).map(key => '' + (key + 1))
}

export function getAmountsPerMonth<T>(list: T[], dateFieldName: string, amountFieldName: string, matchesFilters: (element: T) => boolean): number[] {
  let amountsPerMonth = {}

  for (let element of list) {
    if (matchesFilters(element)) {
      let month = moment(element[dateFieldName]).month() + 1

      if (amountsPerMonth[month] == null) {
        amountsPerMonth[month] = element[amountFieldName]
      } else {
        amountsPerMonth[month] += element[amountFieldName]
      }
    }
  }

  let data: any[] = []
  for (let i = 1; i <= 12; i++) {
    let sum = amountsPerMonth[i]

    if (sum == null) {
      data.push(0)
    } else {
      data.push(sum.toFixed(2))
    }
  }

  return data
}

export function getTotal<T>(list: T[], amountFieldName: string, matchesFilters: (element: T) => boolean): number {
  let total = 0

  for (let element of list) {
    if (matchesFilters(element)) {
      total += element[amountFieldName]
    }
  }

  return round(total)
}

export function getLineChartData(lineChartLabels: string[], lineChartDataLabel: string, lineChartData: number[]) {
  return {
    labels: lineChartLabels,
    datasets: [{
      label: lineChartDataLabel,
      data: lineChartData,
      fillColor: `rgba(${COLORS[0]}, 0.2)`,
      pointColor: `rgba(${COLORS[0]}, 0.4)`,
      borderWidth: 1,
    }]
  }
}

export function getTypesPieChartData<T, V>(list: T[], types: V[], dateFieldName: string, selectedYear: string, amountFieldName?: string): number[] {
  let typeSums = {}

  for (let type of types) {
    typeSums[type['type']] = 0
  }

  for (let element of list) {
    if (! matchesYear(element[dateFieldName], selectedYear)) {
      continue
    } else if (element['type'] == null) {
      continue
    }

    for (let type of types) {
      if (element['type'].type === type['type']) {
        if (amountFieldName != null) {
          typeSums[element['type'].type] += element[amountFieldName]
        } else {
          typeSums[element['type'].type] += 1
        }
      }
    }
  }

  return Object.keys(typeSums).map(type => round(typeSums[type]))
}

export function matchesYear(date: string, year: string): boolean {
  if (date == null || date === '') {
    return false
  }

  let givenYear = '' + moment(date).year()

  return (givenYear === year)
}

export function matchesMonth(date: string, month: string): boolean {
  if (date == null || date === '') {
    return false
  }

  let givenMonth = dateFormatterMonthView(date)

  return (MONTHS[givenMonth] === month)
}

export function matchesType<T>(element: T, actualType: string): boolean {
  if (actualType == null || actualType === '' || actualType === SELECT_TYPE_ALL) {
    return true
  }

  if (element['type'] != null) {
    if (element['type'].type === actualType) {
      return true
    }
  }

  return false
}

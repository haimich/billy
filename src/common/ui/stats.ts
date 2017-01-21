import { dateFormatterYearView } from './formatters'
import { asc, desc } from '../helpers/sorters'

/**
 * Extract all years that occure in the date fields of a list of elements (eg. bills or expenses).
 */
export function getAvailableYears(list: any, dateFieldName: string): string[] {
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

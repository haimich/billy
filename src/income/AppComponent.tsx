import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import FilterComponent from './FilterComponent'
import TableComponent from './TableComponent'
import { dateFormatterYearView, dateFormatterMonthView, currencyFormatter } from '../common/helpers/formatters'
import { asc, desc } from '../common/helpers/sorters'
import { round } from  '../common/helpers/math'
import * as moment from 'moment'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
}

interface State {
  selectedYear?: string
}

const MONTHS = [t('Januar'), t('Februar'), t('März'), t('April'), t('Mai'), t('Juni'), t('Juli'), t('August'), t('September'), t('Oktober'), t('November'), t('Dezember')]

export default class AppComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}

    const availableYears = this.getAvailableYears()

    if (availableYears.length >= 1) {
      this.state.selectedYear = availableYears[0]
    } else {
      this.state.selectedYear = ''
    }
  }

  getAvailableYears(): string[] {
    let years: string[] = []

    for (let bill of this.props.bills) {
      if (bill.date_paid == null || bill.date_paid === '') {
        continue
      }

      let newDate = dateFormatterYearView(bill.date_paid)

      if (years.indexOf(newDate) === -1) {
        years.push(newDate)
      }
    }

    return years.sort(desc)
  }

  getAvailableMonths(): string[] {
    let months: number[] = []

    for (let bill of this.props.bills) {
      if (bill.date_paid == null || ! this.matchesYear(bill.date_paid)) {
        continue
      }

      let newDate = dateFormatterMonthView(bill.date_paid)

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

  matchesYear(date: string): boolean {
    if (date == null || date === '') {
      return false
    }

    let givenYear = '' + moment(date).year()

    return (givenYear === this.state.selectedYear)
  }

  matchesMonth(date: string, month: string): boolean {
    if (date == null || date === '') {
      return false
    }

    let givenMonth = dateFormatterMonthView(date)

    return (MONTHS[givenMonth] === month)
  }

  getData(month: string) {
    return this.props.bills.filter(bill => {
      return this.matchesYear(bill.date_paid) && this.matchesMonth(bill.date_paid, month)
    })
  }

  getTotalAmount(bills: BillDbModel[]): string {
    let total = 0

    for (let bill of bills) {
      total += bill.amount
    }

    return currencyFormatter(round(total))
  }

  generateMonthTables() {
    let months: JSX.Element[] = []

    for (let month of this.getAvailableMonths()) {
      const data = this.getData(month)

      months.push(
        <div key={`${month}`} className="income-month-container">
          <h3>{month}</h3>
          <TableComponent
            bills={data}
          />

          <div className="income-month-total">
            <b>{t('SUMMME')}:&nbsp;</b>{this.getTotalAmount(data)}
          </div>
        </div>
      )
    }

    return months
  }

  render() {
    return (
      <div>
        <FilterComponent
          availableYears={this.getAvailableYears()}
          handleYearChange={element => this.setState({selectedYear: element.target.value})}
          selectedYear={this.state.selectedYear}
        />
        {this.generateMonthTables()}
      </div>
    )
  }

}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import TableComponent from './TableComponent'
import { dateFormatterYearView, dateFormatterMonthView, currencyFormatter } from '../common/ui/formatters'
import { asc, desc } from '../common/helpers/sorters'
import { round } from  '../common/helpers/math'
import { MONTHS, getAvailableYears } from '../common/ui/stats'
import * as moment from 'moment'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
}

interface State {
  selectedYear?: string
  availableYears?: string[]
}

export default class AppComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    
    let selectedYear = ''

    const availableYears = getAvailableYears<BillDbModel>(this.props.bills, 'date_paid')

    if (availableYears.length >= 1) {
      selectedYear = availableYears[0]
    }

    this.state = {
      selectedYear, availableYears
    }
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
        <div className="container-fluid">

          <div className="row">
            <div className="col-sm-3">
              <YearsFilterComponent
                years={this.state.availableYears}
                handleYearChange={element => this.setState({selectedYear: element.target.value})}
                selectedYear={this.state.selectedYear}
              />
            </div>
          </div>

          {this.generateMonthTables()}

        </div>
      </div>
    )
  }

}

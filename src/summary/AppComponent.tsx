import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import BillsTableComponent from './BillsTableComponent'
import { dateFormatterYearView, dateFormatterMonthView, currencyFormatter } from '../common/ui/formatters'
import { asc, desc } from '../common/helpers/sorters'
import { round } from  '../common/helpers/math'
import { MONTHS, getAvailableYears, getAvailableMonths, matchesYear, matchesMonth } from '../common/ui/stats'
import * as moment from 'moment'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
  expenses: ExpenseDbModel[]
}

interface State {
  selectedYear?: string
  availableYears?: string[]
}

export default class AppComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    let selectedYear = ''

    const availableYears = this.getTotalAvailableYears()

    if (availableYears.length >= 1) {
      selectedYear = availableYears[0]
    }

    this.state = {
      selectedYear, availableYears
    }
  }

  getTotalAvailableYears(): string[] {
    const billYears = getAvailableYears<BillDbModel>(this.props.bills, 'date_paid') // 2018 2017 2015
    const expenseYears = getAvailableYears<ExpenseDbModel>(this.props.expenses, 'date') // 2016 2015

    let merged = (billYears.concat(expenseYears)).sort(desc)
    let unique = new Set(merged)

    return Array.from(unique)
  }

  getTotalAvailableMonths(): string[] {
    let billMonths = getAvailableMonths<BillDbModel>(this.props.bills, 'date_paid', this.state.selectedYear)
    let expenseMonths = getAvailableMonths<ExpenseDbModel>(this.props.expenses, 'date', this.state.selectedYear)

    let merged = (billMonths.concat(expenseMonths)).sort((monthA, monthB) => {
      return MONTHS.indexOf(monthA) - MONTHS.indexOf(monthB)
    })
    let unique = new Set(merged)

    return Array.from(unique)
  }

  getBillData(month: string): BillDbModel[] {
    return this.props.bills.filter(bill => {
      return matchesYear(bill.date_paid, this.state.selectedYear) && matchesMonth(bill.date_paid, month)
    })
  }

  getTotalBillAmount(bills: BillDbModel[]): string {
    let total = 0

    for (let bill of bills) {
      total += bill.amount
    }

    return currencyFormatter(round(total))
  }

  getTotalExpenseAmount(expenses: ExpenseDbModel[]): string {
    let total = 0

    for (let expense of expenses) {
      total += expense.preTaxAmount
    }

    return currencyFormatter(round(total))
  }

  generateMonthTables(): JSX.Element[] {
    let months: JSX.Element[] = []

    for (let month of this.getTotalAvailableMonths()) {
      const data = this.getBillData(month)

      months.push(
        <div key={`${month}`} className="income-month-container">
          <h3>{month}</h3>

          <BillsTableComponent bills={data} />

          <div className="income-month-total">
            <b>{t('SUMMME')}:&nbsp;</b>{this.getTotalBillAmount(data)}
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

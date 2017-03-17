import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import BillsTableComponent from './BillsTableComponent'
import ExpensesTableComponent from './ExpensesTableComponent'
import { dateFormatterYearView, dateFormatterMonthView, currencyFormatter, numberFormatterView } from '../common/ui/formatters'
import { asc, desc } from '../common/helpers/sorters'
import { round, getNetAmount, getVatAmount } from '../common/helpers/math'
import { MONTHS, getAvailableYears, getAvailableMonths, matchesYear, matchesMonth, getTotal } from '../common/ui/stats'
import * as moment from 'moment'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
  expenses: ExpenseDbModel[]
}

interface State {
  selectedYear?: string
  availableYears?: string[]
  enrichedBills: EnrichedBill[]
}

export interface EnrichedBill extends BillDbModel {
  netAmount: number,
  preTaxAmount: number,
  taxrate: number,
  vatAmount: number
}

export default class AppComponent extends React.Component<Props, any> {

  State: State

  constructor(props) {
    super(props)

    let selectedYear = ''

    const availableYears = this.getTotalAvailableYears()

    if (availableYears.length >= 1) {
      selectedYear = availableYears[0]
    }

    this.state = {
      selectedYear, availableYears,
      enrichedBills: this.getEnrichedBills(props.bills)
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

  getEnrichedBills(bills: BillDbModel[]): EnrichedBill[] {
    let enriched: EnrichedBill[] = []

    for (let bill of bills) {
      let item = bill.items[0] // adapt this line when multiple bill items are implemented

      let exp = Object.assign(bill, {
        preTaxAmount: item.preTaxAmount,
        netAmount: getNetAmount(item.taxrate, item.preTaxAmount),
        taxrate: item.taxrate,
        vatAmount: getVatAmount(item.taxrate, item.preTaxAmount)
      })

      enriched.push(exp)
    }

    return enriched
  }

  getBillData(month: string): EnrichedBill[] {
    return this.state.enrichedBills.filter(bill => {
      return matchesYear(bill.date_paid, this.state.selectedYear) && matchesMonth(bill.date_paid, month)
    })
  }

  getExpenseData(month: string): ExpenseDbModel[] {
    return this.props.expenses.filter(expense => {
      if (matchesYear(expense.date, this.state.selectedYear) && matchesMonth(expense.date, month)) {
        return Object.assign(expense, {
          vatAmount: getVatAmount(expense.taxrate, expense.preTaxAmount)
        })
      }
    })
  }

  generateMonthTables(): JSX.Element[] {
    let months: JSX.Element[] = []

    for (let month of this.getTotalAvailableMonths()) {
      const billData = this.getBillData(month)
      const expenseData = this.getExpenseData(month)

      months.push(
        <div key={`${month}`} className="month-container">
          <h3>{month}</h3>

          <BillsTableComponent bills={billData} />

          <div className="month-total income">
            <div>
              {t('BRUTTO')}: {numberFormatterView(getTotal<BillDbModel>(billData, 'preTaxAmount', false))}&nbsp;€
            </div>
            <div>
              {t('NETTO')}: {numberFormatterView(getTotal<BillDbModel>(billData, 'netAmount', false))}&nbsp;€
            </div>
          </div>

          <ExpensesTableComponent expenses={expenseData} />

          <div className="month-total expenses">
            <span>
              {t('MWST.')}: {numberFormatterView(getTotal<ExpenseDbModel>(expenseData, 'vatAmount', false))}&nbsp;€
            </span>
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
              <form id="filter-container">
                <YearsFilterComponent
                  years={this.state.availableYears}
                  handleYearChange={element => this.setState({selectedYear: element.target.value})}
                  selectedYear={this.state.selectedYear}
                />
              </form>
            </div>
          </div>

          {this.generateMonthTables()}

        </div>
      </div>
    )
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      enrichedBills: this.getEnrichedBills(newProps.bills)
    })
  }

}

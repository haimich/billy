import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import { EnrichedBill } from '../common/models/BillDbModel'
import { EnrichedExpense } from '../common/models/ExpenseDbModel'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import BillsTableComponent from './BillsTableComponent'
import ExpensesTableComponent from './ExpensesTableComponent'
import { dateFormatterYearView, dateFormatterMonthView, currencyFormatter, numberFormatterView } from '../common/ui/formatters'
import { asc, desc } from '../common/helpers/sorters'
import { getVatAmount } from '../common/helpers/math'
import { MONTHS, getAvailableYears, getAvailableMonths, matchesYear, matchesMonth, getTotal } from '../common/ui/stats'
import { getEnrichedBills, getEnrichedExpenses } from '../common/helpers/item'
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
  enrichedExpenses: EnrichedExpense[]
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
      enrichedBills: getEnrichedBills(props.bills),
      enrichedExpenses: getEnrichedExpenses(props.expenses)
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

  getBillData(month: string): EnrichedBill[] {
    return this.state.enrichedBills.filter(bill => {
      return matchesYear(bill.date_paid, this.state.selectedYear) && matchesMonth(bill.date_paid, month)
    })
  }

  getExpenseData(month: string): ExpenseDbModel[] {
    return this.props.expenses.filter(expense => {
      if (matchesYear(expense.date, this.state.selectedYear) && matchesMonth(expense.date, month)) {
        return expense
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
            <span>
              {t('BRUTTO')}: {numberFormatterView(getTotal<BillDbModel>(billData, 'preTaxAmount', false))}&nbsp;€
            </span>
            <br />
            <span>
              {t('NETTO')}: {numberFormatterView(getTotal<BillDbModel>(billData, 'netAmount', false))}&nbsp;€
            </span>
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

  printPage() {
    window.print();
  }

  render() {
    return (
      <div>
        <div className="container-fluid">

          <div className="row summary-heading">
            <div className="col-sm-3">
              <form>
                <YearsFilterComponent
                  years={this.state.availableYears}
                  handleYearChange={element => this.setState({selectedYear: element.target.value})}
                  selectedYear={this.state.selectedYear}
                />
              </form>
            </div>

            <div className="col-sm-3">
              <button type="button" className="btn btn-secondary" onClick={this.printPage.bind(this)}>
                <i className="fa fa-print" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {this.generateMonthTables()}

        </div>
      </div>
    )
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      enrichedBills: getEnrichedBills(newProps.bills),
      enrichedExpenses: getEnrichedExpenses(newProps.expenses)
    })
  }

}

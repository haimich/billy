import * as React from 'react'
import * as ReactDOM from 'react-dom'
import StatsFilterComponent from '../common/components/StatsFilterComponent'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
import ExpensesChartComponent from './ExpensesChartComponent'
import { SELECT_TYPE_ALL, getAvailableYears, getMonthNumbers, getAmountsPerMonth, matchesYear, matchesType } from '../common/ui/stats'
import t from '../common/helpers/i18n'
import * as moment from 'moment'

interface Props {
  expenses: ExpenseDbModel[]
  expenseTypes: ExpenseTypeModel[]
}

interface State {
  selectedExpenseType: string
  selectedYear?: string
}

export default class ExpensesStatsComponent extends React.Component<Props, {}> {

  state: State

  constructor(props) {
    super(props)

    this.state = {
      selectedExpenseType: SELECT_TYPE_ALL
    }

    const availableYears = getAvailableYears(this.props.expenses, 'date')

    if (availableYears.length >= 1) {
      this.state.selectedYear = availableYears[0]
    } else {
      this.state.selectedYear = ''
    }
  }

  matchesFilters(expense: ExpenseDbModel): boolean {
    return matchesYear(expense.date, this.state.selectedYear)
      && matchesType<ExpenseDbModel>(expense, this.state.selectedExpenseType)
  }

  render() {
    return (
      <div>

        <form id="filter-container">
          <StatsFilterComponent
            years={getAvailableYears(this.props.expenses, 'date')}
            types={this.props.expenseTypes}
            handleYearChange={element => this.setState({selectedYear: element.target.value})}
            handleTypeChange={element => this.setState({selectedExpenseType: element.target.value})}
            selectedType={this.state.selectedExpenseType}
            selectedYear={this.state.selectedYear}
            dateFieldName="date"
          />
        </form>

        <ExpensesChartComponent
          lineChartHeading={t('Ausgaben')}
          lineChartDataLabel={t('Ausgaben nach Datum')}
          lineChartLabels={getMonthNumbers()}
          lineChartDatePaidData={getAmountsPerMonth<ExpenseDbModel>(this.props.expenses, 'date', 'preTaxAmount', this.matchesFilters.bind(this))}
        />

      </div>
    )
  }

}
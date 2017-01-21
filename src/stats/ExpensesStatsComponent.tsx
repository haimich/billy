import * as React from 'react'
import * as ReactDOM from 'react-dom'
import YearsFilterComponent from '../common/components/YearsFilterComponent'
import TypesFilterComponent from '../common/components/TypesFilterComponent'
import LineChartComponent from '../common/components/LineChartComponent'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
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
          <YearsFilterComponent
            years={getAvailableYears(this.props.expenses, 'date')}
            handleYearChange={element => this.setState({selectedYear: element.target.value})}
            selectedYear={this.state.selectedYear}
          />
          <TypesFilterComponent
            types={this.props.expenseTypes}
            handleTypeChange={element => this.setState({selectedExpenseType: element.target.value})}
            selectedType={this.state.selectedExpenseType}
          />
        </form>

        <LineChartComponent
          lineChartHeading={t('Ausgaben in €')}
          lineChartDataLabel={t('Ausgaben nach Datum')}
          lineChartLabels={getMonthNumbers()}
          lineChartDatePaidData={getAmountsPerMonth<ExpenseDbModel>(this.props.expenses, 'date', 'preTaxAmount', this.matchesFilters.bind(this))}
        />

      </div>
    )
  }

}
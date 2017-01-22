import * as React from 'react'
import * as ReactDOM from 'react-dom'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import TypesFilterComponent from '../common/components/stats/TypesFilterComponent'
import LineChartComponent from '../common/components/stats/LineChartComponent'
import PanelComponent from '../common/components/stats/PanelComponent'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
import {
  SELECT_TYPE_ALL, getAvailableYears, getMonthNumbers, getAmountsPerMonth,
  matchesYear, matchesType, getTotal, getTypesPieChartData
} from '../common/ui/stats'
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

    const availableYears = getAvailableYears<ExpenseDbModel>(this.props.expenses, 'date')

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

  getTypesPieChartLabels(): string[] {
    return this.props.expenseTypes.map(type => type.type)
  }

  // getTypesPieChartData(): number[] {
  //   return getTypesPieChartData<ExpenseDbModel, ExpenseTypeModel>(this.props.expenses, this.props.expenseTypes, 'date', this.state.selectedYear)
  // }

  render() {
    return (
      <div>

        <form id="filter-container">
          <YearsFilterComponent
            years={getAvailableYears<ExpenseDbModel>(this.props.expenses, 'date')}
            handleYearChange={element => this.setState({selectedYear: element.target.value})}
            selectedYear={this.state.selectedYear}
          />
          <TypesFilterComponent
            types={this.props.expenseTypes}
            handleTypeChange={element => this.setState({selectedExpenseType: element.target.value})}
            selectedType={this.state.selectedExpenseType}
          />
        </form>

        <div className="panel-container" style={{ marginTop: '4px' }}>
          <div className="row">
            <div className="col-sm-4" />

            <div className="col-xs-12 col-sm-4 panel-display">
              <PanelComponent
                title={t('Summe Ausgaben')}
                value={getTotal(this.props.expenses, 'preTaxAmount', this.matchesFilters.bind(this))}
                suffix="€"
                icon="fa-line-chart"
              />
            </div>

            <div className="col-sm-4" />
          </div>
        </div>

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
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import TypesFilterComponent from '../common/components/stats/TypesFilterComponent'
import LineChartComponent from '../common/components/stats/LineChartComponent'
import PanelComponent from '../common/components/stats/PanelComponent'
import PieChartComponent from '../common/components/stats/PieChartComponent'
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
  availableYears: string[]
}

export default class ExpensesStatsComponent extends React.Component<Props, {}> {

  state: State

  constructor(props) {
    super(props)

    let selectedYear = ''

    const availableYears = getAvailableYears<ExpenseDbModel>(this.props.expenses, 'date')

    if (availableYears.length >= 1) {
      selectedYear = availableYears[0]
    }

    this.state = {
      selectedExpenseType: SELECT_TYPE_ALL,
      selectedYear,
      availableYears
    }
  }

  matchesFilters(expense: ExpenseDbModel): boolean {
    return matchesYear(expense.date, this.state.selectedYear)
      && matchesType<ExpenseDbModel>(expense, this.state.selectedExpenseType)
  }

  getTypesPieChartLabels(): string[] {
    return this.props.expenseTypes.map(type => type.type)
  }

  render() {
    return (
      <div>

        <form id="filter-container">
          <YearsFilterComponent
            years={this.state.availableYears}
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

        <div className="container-fluid">
          <div className="row">

            <div className="col-xs-6">
              <PieChartComponent
                data={getTypesPieChartData(this.props.expenses, this.props.expenseTypes, 'date', this.state.selectedYear)}
                labels={this.getTypesPieChartLabels()}
                heading={t('Anzahl Ausgaben nach Typ')}
              />
            </div>

            <div className="col-xs-6">
              <PieChartComponent
                data={getTypesPieChartData(this.props.expenses, this.props.expenseTypes, 'date', this.state.selectedYear, 'preTaxAmount')}
                labels={this.getTypesPieChartLabels()}
                heading={t('Summe pro Typ in €')}
              />
            </div>

          </div>
        </div>

      </div>
    )
  }

}
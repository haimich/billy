import * as React from 'react'
import * as ReactDOM from 'react-dom'
import StatsFilterComponent from '../common/components/StatsFilterComponent'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
import ExpensesChartComponent from './ExpensesChartComponent'
import t from '../common/helpers/i18n'
import * as moment from 'moment'
import { SELECT_TYPE_ALL, getAvailableYears, getMonthNumbers, getAmountsPerMonth, matchesYear, matchesType } from '../common/ui/stats'

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

  // getTypesPieChartLabels(): string[] {
  //   return this.props.billTypes.map(type => type.type)
  // }

  // getTypesPieChartData(): number[] {
  //   let typeSums = {}

  //   for (let type of this.props.billTypes) {
  //     typeSums[type.type] = 0
  //   }

  //   for (let bill of this.props.bills) {
  //     if (! this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
  //       continue
  //     } else if (bill.type == null) {
  //       continue
  //     }

  //     for (let type of this.props.billTypes) {
  //       if (bill.type.type === type.type) {
  //         typeSums[bill.type.type] += 1
  //       }
  //     }
  //   }

  //   return Object.keys(typeSums).map(type => typeSums[type])
  // }

  // getTypesIncomePieChartData(): number[] {
  //   let typeSums = {}

  //   for (let type of this.props.billTypes) {
  //     typeSums[type.type] = 0
  //   }

  //   for (let bill of this.props.bills) {
  //     if (! this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
  //       continue
  //     } else if (bill.type == null) {
  //       continue
  //     }

  //     for (let type of this.props.billTypes) {
  //       if (bill.type.type === type.type) {
  //         typeSums[bill.type.type] += bill.amount
  //       }
  //     }
  //   }

  //   return Object.keys(typeSums).map(type => round(typeSums[type]))
  // }

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
          lineChartDatePaidData={getAmountsPerMonth<ExpenseDbModel>(this.props.expenses, 'date', 'amount', this.matchesFilters.bind(this))}
        />

      </div>
    )
  }

}
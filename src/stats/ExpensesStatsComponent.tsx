import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ExpensesFilterComponent, { SELECT_TYPE_ALL } from './ExpensesFilterComponent'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
import t from '../common/helpers/i18n'
import { asc, desc } from '../common/helpers/sorters'
import { dateFormatterYearView } from '../common/ui/formatters'
import * as moment from 'moment'
// import { getAverage, round } from '../common/helpers/math'

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

    const availableYears = this.getAvailableYears()

    if (availableYears.length >= 1) {
      this.state.selectedYear = availableYears[0]
    } else {
      this.state.selectedYear = ''
    }
  }

  getAvailableYears(): string[] {
    let years: string[] = []

    for (let expense of this.props.expenses) {
      if (expense.date == null || expense.date === '') {
        continue
      }

      let newDate = dateFormatterYearView(expense.date)

      if (years.indexOf(newDate) === -1) {
        years.push(newDate)
      }
    }

    return years.sort(desc)
  }

  // getTableData(): CustomerStats[] {
  //   let customersWithTotals = {}

  //   for (let bill of this.props.bills) {
  //     if (this.matchesFilters(bill)) {
  //       if (bill.customer == null || bill.customer.id == null) {
  //         continue
  //       }

  //       let daysToPay = this.getDaysToPay(bill)
  //       let daysToPayList = []

  //       if (daysToPay != null) {
  //         daysToPayList.push(daysToPay)
  //       }

  //       if (customersWithTotals[bill.customer.id] == null) {
  //         customersWithTotals[bill.customer.id] = {
  //           total: bill.amount,
  //           id: bill.customer.id,
  //           name: bill.customer.name,
  //           daysToPayList,
  //           billCount: 1
  //         }
  //       } else {
  //         let customer = customersWithTotals[bill.customer.id]
  //         customer.total += bill.amount
  //         customer.billCount += 1
  //         customer.daysToPayList = customer.daysToPayList.concat(daysToPayList)
  //       }
  //     }
  //   }

  //   let customers: any[] = []
  //   for (let customerId of Object.keys(customersWithTotals)) {
  //     let customer = customersWithTotals[customerId]
  //     let averageTimeToPay = round(getAverage(customer.daysToPayList), 1)

  //     customers.push({
  //       name: customer.name,
  //       total: customer.total,
  //       billCount: customer.billCount,
  //       averageTimeToPay
  //     })
  //   }

  //   return customers
  // }

  // getLineChartLabels(): string[] {
  //   return Array.from(Array(12).keys()).map(key => '' + (key + 1))
  // }

  // getTypesPieChartLabels(): string[] {
  //   return this.props.billTypes.map(type => type.type)
  // }

  // getLineChartData(): number[] {
  //   let amountsPerMonth = {}

  //   for (let bill of this.props.bills) {
  //     if (this.matchesFilters(bill)) {
  //       if (bill[this.state.billDateToUse] == null) {
  //         continue
  //       }

  //       let month = moment(bill[this.state.billDateToUse]).month() + 1

  //       if (amountsPerMonth[month] == null) {
  //         amountsPerMonth[month] = bill.amount
  //       } else {
  //         amountsPerMonth[month] += bill.amount
  //       }
  //     }
  //   }

  //   let data: any[] = []
  //   for (let i = 1; i <= 12; i++) {
  //     let sum = amountsPerMonth[i]

  //     if (sum == null) {
  //       data.push(0)
  //     } else {
  //       data.push(sum.toFixed(2))
  //     }
  //   }

  //   return data
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

  // matchesFilters(bill: BillDbModel): boolean {
  //   return this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)
  //     && this.matchesBillType(bill)
  // }

  // matchesYear(date: string, year: string): boolean {
  //   if (date == null || date === '') {
  //     return false
  //   }

  //   let givenYear = '' + moment(date).year()

  //   return (givenYear === year)
  // }

  // matchesBillType(bill: BillDbModel): boolean {
  //   if (this.state.selectedBillType == null || this.state.selectedBillType === '' || this.state.selectedBillType === SELECT_TYPE_ALL) {
  //     return true
  //   }

  //   if (bill.type != null) {
  //     if (bill.type.type === this.state.selectedBillType) {
  //       return true
  //     }
  //   }

  //   return false
  // }

  render() {
    return (
      <div>

        <ExpensesFilterComponent
          years={this.getAvailableYears()}
          expenseTypes={this.props.expenseTypes}
          handleYearChange={element => this.setState({selectedYear: element.target.value})}
          handleExpenseTypeChange={element => this.setState({selectedExpenseType: element.target.value})}
          selectedExpenseType={this.state.selectedExpenseType}
          selectedYear={this.state.selectedYear}
        />

      </div>
    )
  }

}

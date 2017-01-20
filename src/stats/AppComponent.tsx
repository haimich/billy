import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillsFilterComponent, { SELECT_TYPE_ALL } from './BillsFilterComponent'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import BillsTableComponent from './BillsTableComponent'
import BillsPanelComponent from './BillsPanelComponent'
import BillsChartComponent from './BillsChartComponent'
import t from '../common/helpers/i18n'
import { asc, desc } from '../common/helpers/sorters'
import { dateFormatterYearView } from '../common/ui/formatters'
import * as moment from 'moment'
import { getAverage, round } from '../common/helpers/math'

interface Props {
  customers: Customer[]
  bills: BillDbModel[]
  billTypes: BillTypeModel[]
}

interface CustomerStats {
  name: string
  total: number
  billCount: number
  averageTimeToPay: number
}

export default class AppComponent extends React.Component<Props, {}> {

  state: {
    selectedBillType: string
    selectedYear?: string
    billDateToUse: 'date_paid' | 'date_created'
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedBillType: SELECT_TYPE_ALL,
      billDateToUse: 'date_paid'
    }

    const availableYears = this.getAvailableYears()

    if (availableYears.length >= 1) {
      this.state.selectedYear = availableYears[0]
    } else {
      this.state.selectedYear = ''
    }
  }

  getTotal(): number {
    let total = 0

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill)) {
        total += bill.amount
      }
    }

    return round(total)
  }

  getTotalUnpaid(): number {
    let total = 0

    for (let bill of this.props.bills) {
      const matchesFilters = (this.matchesYear(bill.date_created, this.state.selectedYear)
        && this.matchesBillType(bill))
      const isUnpaid = (bill.date_paid == null || bill.date_paid === '')

      if (matchesFilters && isUnpaid) {
        total += bill.amount
      }
    }

    return round(total)
  }

  getAvailableYears(): string[] {
    let years: string[] = []

    for (let bill of this.props.bills) {
      if (bill[this.state.billDateToUse] == null || bill[this.state.billDateToUse] === '') {
        continue
      }

      let newDate = dateFormatterYearView(bill[this.state.billDateToUse])

      if (years.indexOf(newDate) === -1) {
        years.push(newDate)
      }
    }

    return years.sort(desc)
  }

  getDaysToPay(bill: BillDbModel): number {
    let createdDate = bill.date_created
    let payDate = bill.date_paid

    if (payDate != null && payDate !== '') {
      let diff = moment(payDate).diff(moment(createdDate), 'days')

      if (diff < 0) {
        return 0
      } else {
        return diff
      }
    } else {
      return null
    }
  }

  getTableData(): CustomerStats[] {
    let customersWithTotals = {}

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill)) {
        if (bill.customer == null || bill.customer.id == null) {
          continue
        }

        let daysToPay = this.getDaysToPay(bill)
        let daysToPayList = []

        if (daysToPay != null) {
          daysToPayList.push(daysToPay)
        }

        if (customersWithTotals[bill.customer.id] == null) {
          customersWithTotals[bill.customer.id] = {
            total: bill.amount,
            id: bill.customer.id,
            name: bill.customer.name,
            daysToPayList,
            billCount: 1
          }
        } else {
          let customer = customersWithTotals[bill.customer.id]
          customer.total += bill.amount
          customer.billCount += 1
          customer.daysToPayList = customer.daysToPayList.concat(daysToPayList)
        }
      }
    }

    let customers: any[] = []
    for (let customerId of Object.keys(customersWithTotals)) {
      let customer = customersWithTotals[customerId]
      let averageTimeToPay = round(getAverage(customer.daysToPayList), 1)

      customers.push({
        name: customer.name,
        total: customer.total,
        billCount: customer.billCount,
        averageTimeToPay
      })
    }

    return customers
  }

  getLineChartLabels(): string[] {
    return Array.from(Array(12).keys()).map(key => '' + (key + 1))
  }

  getTypesPieChartLabels(): string[] {
    return this.props.billTypes.map(type => type.type)
  }

  getLineChartData(): number[] {
    let amountsPerMonth = {}

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill)) {
        if (bill[this.state.billDateToUse] == null) {
          continue
        }

        let month = moment(bill[this.state.billDateToUse]).month() + 1

        if (amountsPerMonth[month] == null) {
          amountsPerMonth[month] = bill.amount
        } else {
          amountsPerMonth[month] += bill.amount
        }
      }
    }

    let data: any[] = []
    for (let i = 1; i <= 12; i++) {
      let sum = amountsPerMonth[i]

      if (sum == null) {
        data.push(0)
      } else {
        data.push(sum.toFixed(2))
      }
    }

    return data
  }

  getTypesPieChartData(): number[] {
    let typeSums = {}

    for (let type of this.props.billTypes) {
      typeSums[type.type] = 0
    }

    for (let bill of this.props.bills) {
      if (! this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
        continue
      } else if (bill.type == null) {
        continue
      }

      for (let type of this.props.billTypes) {
        if (bill.type.type === type.type) {
          typeSums[bill.type.type] += 1
        }
      }
    }

    return Object.keys(typeSums).map(type => typeSums[type])
  }

  getTypesIncomePieChartData(): number[] {
    let typeSums = {}

    for (let type of this.props.billTypes) {
      typeSums[type.type] = 0
    }

    for (let bill of this.props.bills) {
      if (! this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
        continue
      } else if (bill.type == null) {
        continue
      }

      for (let type of this.props.billTypes) {
        if (bill.type.type === type.type) {
          typeSums[bill.type.type] += bill.amount
        }
      }
    }

    return Object.keys(typeSums).map(type => round(typeSums[type]))
  }

  matchesFilters(bill: BillDbModel): boolean {
    return this.matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)
      && this.matchesBillType(bill)
  }

  matchesYear(date: string, year: string): boolean {
    if (date == null || date === '') {
      return false
    }

    let givenYear = '' + moment(date).year()

    return (givenYear === year)
  }

  matchesBillType(bill: BillDbModel): boolean {
    if (this.state.selectedBillType == null || this.state.selectedBillType === '' || this.state.selectedBillType === SELECT_TYPE_ALL) {
      return true
    }

    if (bill.type != null) {
      if (bill.type.type === this.state.selectedBillType) {
        return true
      }
    }

    return false
  }

  handleBillDateToUseChange(dateField: 'date_paid' | 'date_created') {
    this.setState({
      billDateToUse: dateField
    })
  }

  render() {
    return (
      <div>

        <BillsFilterComponent
          years={this.getAvailableYears()}
          billTypes={this.props.billTypes}
          handleYearChange={element => this.setState({selectedYear: element.target.value})}
          handleBillTypeChange={element => this.setState({selectedBillType: element.target.value})}
          changeBillDateToUse={this.handleBillDateToUseChange.bind(this)}
          selectedBillType={this.state.selectedBillType}
          selectedYear={this.state.selectedYear}
          billDateToUse={this.state.billDateToUse}
        />

        <BillsTableComponent data={this.getTableData()} />

        <div className="panel-container">
          <div className="row">
            <div className="col-xs-1" />

            <div className="col-xs-12 col-sm-4 panel-display">
              <BillsPanelComponent title={t('Jahresumsatz')} value={this.getTotal()} icon="fa-line-chart" />
            </div>

            <div className="col-xs-2" />

            <div className="col-xs-12 col-sm-4 panel-display">
              <BillsPanelComponent title={t('Unbezahlte Rechnungen')} value={this.getTotalUnpaid()} icon="fa-hourglass-1" />
            </div>

            <div className="col-xs-1" />
          </div>
        </div>

        <BillsChartComponent
          lineChartLabels={this.getLineChartLabels()}
          lineChartDatePaidData={this.getLineChartData()}
          typesPieChartLabels={this.getTypesPieChartLabels()}
          typesPieChartData={this.getTypesPieChartData()}
          typesIncomePieChartData={this.getTypesIncomePieChartData()}
        />

      </div>
    )
  }

}

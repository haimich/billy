import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import BillsFilterComponent from './BillsFilterComponent'
import BillsTableComponent from './BillsTableComponent'
import BillsPanelComponent from './BillsPanelComponent'
import BillsChartComponent from './BillsChartComponent'
import t from '../common/helpers/i18n'
import { SELECT_TYPE_ALL, getAvailableYears, getMonthNumbers, getAmountsPerMonth, matchesYear, matchesType } from '../common/ui/stats'
import * as moment from 'moment'
import { getAverage, round } from '../common/helpers/math'

interface Props {
  customers: Customer[]
  bills: BillDbModel[]
  billTypes: BillTypeModel[]
}

interface State {
  selectedBillType: string
  selectedYear?: string
  billDateToUse: 'date_paid' | 'date_created'
}

interface CustomerStats {
  name: string
  total: number
  billCount: number
  averageTimeToPay: number
}

export default class BillsStatsComponent extends React.Component<Props, {}> {

  state: State

  constructor(props) {
    super(props)

    this.state = {
      selectedBillType: SELECT_TYPE_ALL,
      billDateToUse: 'date_paid'
    }

    const availableYears = getAvailableYears(this.props.bills, this.state.billDateToUse)

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
      const matchesFilters = (matchesYear(bill.date_created, this.state.selectedYear)
        && matchesType<BillDbModel>(bill, this.state.selectedBillType))
      const isUnpaid = (bill.date_paid == null || bill.date_paid === '')

      if (matchesFilters && isUnpaid) {
        total += bill.amount
      }
    }

    return round(total)
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

  getTypesPieChartLabels(): string[] {
    return this.props.billTypes.map(type => type.type)
  }

  getTypesPieChartData(): number[] {
    let typeSums = {}

    for (let type of this.props.billTypes) {
      typeSums[type.type] = 0
    }

    for (let bill of this.props.bills) {
      if (! matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
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
      if (! matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)) {
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
    return matchesYear(bill[this.state.billDateToUse], this.state.selectedYear)
      && matchesType(bill, this.state.selectedBillType)
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
          years={getAvailableYears(this.props.bills, this.state.billDateToUse)}
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
          lineChartHeading={t('Umsatz')}
          lineChartDataLabel={t('Einkommen nach Bezahldatum')}
          lineChartLabels={getMonthNumbers()}
          lineChartDatePaidData={getAmountsPerMonth<BillDbModel>(this.props.bills, this.state.billDateToUse, 'amount', this.matchesFilters.bind(this))}
          typesPieChartLabels={this.getTypesPieChartLabels()}
          typesPieChartData={this.getTypesPieChartData()}
          typesIncomePieChartData={this.getTypesIncomePieChartData()}
        />

      </div>
    )
  }

}

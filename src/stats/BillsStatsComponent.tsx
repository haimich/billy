import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import YearsFilterComponent from '../common/components/stats/YearsFilterComponent'
import TypesFilterComponent from '../common/components/stats/TypesFilterComponent'
import LineChartComponent from '../common/components/stats/LineChartComponent'
import PanelComponent from '../common/components/stats/PanelComponent'
import BillsTableComponent from './BillsTableComponent'
import PieChartComponent from '../common/components/stats/PieChartComponent'
import t from '../common/helpers/i18n'
import {
  SELECT_TYPE_ALL, getAvailableYears, getMonthNumbers, getAmountsPerMonth,
  matchesYear, matchesType, getTotal, getTypesPieChartData
} from '../common/ui/stats'
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

    let billDateToUse: any = 'date_paid'
    let selectedYear = ''

    const availableYears = getAvailableYears<BillDbModel>(this.props.bills, billDateToUse)

    if (availableYears.length >= 1) {
      selectedYear = availableYears[0]
    }

    this.state = {
      selectedBillType: SELECT_TYPE_ALL,
      billDateToUse,
      selectedYear
    }
  }

  getTotalUnpaid(): number {
    let total = 0

    // for (let bill of this.props.bills) {
    //   const matchesFilters = (matchesYear(bill.date_created, this.state.selectedYear)
    //     && matchesType<BillDbModel>(bill, this.state.selectedBillType))
    //   const isUnpaid = (bill.date_paid == null || bill.date_paid === '')

    //   if (matchesFilters && isUnpaid) {
    //     total += bill.amount
    //   }
    // }

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

    // for (let bill of this.props.bills) {
    //   if (this.matchesFilters(bill)) {
    //     if (bill.customer == null || bill.customer.id == null) {
    //       continue
    //     }

    //     let daysToPay = this.getDaysToPay(bill)
    //     let daysToPayList = []

    //     if (daysToPay != null) {
    //       daysToPayList.push(daysToPay)
    //     }

    //     if (customersWithTotals[bill.customer.id] == null) {
    //       customersWithTotals[bill.customer.id] = {
    //         total: bill.amount,
    //         id: bill.customer.id,
    //         name: bill.customer.name,
    //         daysToPayList,
    //         billCount: 1
    //       }
    //     } else {
    //       let customer = customersWithTotals[bill.customer.id]
    //       customer.total += bill.amount
    //       customer.billCount += 1
    //       customer.daysToPayList = customer.daysToPayList.concat(daysToPayList)
    //     }
    //   }
    // }

    let customers: any[] = []
    // for (let customerId of Object.keys(customersWithTotals)) {
    //   let customer = customersWithTotals[customerId]
    //   let averageTimeToPay = round(getAverage(customer.daysToPayList), 1)

    //   customers.push({
    //     name: customer.name,
    //     total: customer.total,
    //     billCount: customer.billCount,
    //     averageTimeToPay
    //   })
    // }

    return customers
  }

  getTypesPieChartLabels(): string[] {
    return this.props.billTypes.map(type => type.type)
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

  isDatefieldSelected(dateField: string): boolean {
    return this.state.billDateToUse === dateField
  }

  render() {
    return (
      <div>

        <form id="filter-container">

          <YearsFilterComponent
            years={getAvailableYears<BillDbModel>(this.props.bills, this.state.billDateToUse)}
            handleYearChange={element => this.setState({selectedYear: element.target.value})}
            selectedYear={this.state.selectedYear}
          />
          <TypesFilterComponent
            types={this.props.billTypes}
            handleTypeChange={element => this.setState({selectedBillType: element.target.value})}
            selectedType={this.state.selectedBillType}
          />
        
          <label>{t('Datumsfeld')}</label>
          <p>
            <label className="radio-inline">
              <input
                type="radio"
                checked={this.isDatefieldSelected('date_paid')}
                onChange={() => this.handleBillDateToUseChange('date_paid')}
              /> {t('Bezahldatum')} {t('liegt in')} {this.state.selectedYear}
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                checked={this.isDatefieldSelected('date_created')}
                onChange={() => this.handleBillDateToUseChange('date_created')}
              /> {t('Rechnungsdatum')} {t('liegt in')} {this.state.selectedYear}
            </label>
          </p>

        </form>

        <BillsTableComponent data={this.getTableData()} />

        <div className="panel-container">
          <div className="row">
            <div className="col-sm-1" />

            <div className="col-xs-12 col-sm-4 panel-display">
              <PanelComponent
                title={t('Jahresumsatz')}
                value={getTotal(this.props.bills, 'amount', true, this.matchesFilters.bind(this))}
                suffix="€"
                icon="fa-line-chart"
              />
            </div>

            <div className="col-sm-2" />

            <div className="col-xs-12 col-sm-4 panel-display">
              <PanelComponent
                title={t('Unbezahlte Rechnungen')}
                value={this.getTotalUnpaid()}
                suffix="€"
                icon="fa-hourglass-1"
              />
            </div>

            <div className="col-sm-1" />
          </div>
        </div>

        <LineChartComponent
          lineChartHeading={t('Umsatz in €')}
          lineChartDataLabel={t('Einkommen nach Bezahldatum')}
          lineChartLabels={getMonthNumbers()}
          lineChartDatePaidData={getAmountsPerMonth<BillDbModel>(this.props.bills, this.state.billDateToUse, 'amount', this.matchesFilters.bind(this))}
        />

        <div className="container-fluid">
          <div className="row">

            <div className="col-xs-6">
              <PieChartComponent
                data={getTypesPieChartData(this.props.bills, this.props.billTypes, this.state.billDateToUse, this.state.selectedYear)}
                labels={this.getTypesPieChartLabels()}
                heading={t('Anzahl Aufträge nach Typ')}
              />
            </div>

            <div className="col-xs-6">
              <PieChartComponent
                data={getTypesPieChartData(this.props.bills, this.props.billTypes, this.state.billDateToUse, this.state.selectedYear, 'amount')}
                labels={this.getTypesPieChartLabels()}
                heading={t('Aufträge nach Umsatz in €')}
              />
            </div>

          </div>
        </div>

      </div>
    )
  }

}

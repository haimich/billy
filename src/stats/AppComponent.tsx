import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FilterComponent from './FilterComponent'
import BillDbModel from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import TableComponent from './TableComponent'
import TotalSumComponent from './TotalSumComponent'
import ChartComponent from './ChartComponent'
import t from '../common/helpers/i18n'
import { asc, desc } from '../common/helpers/sorters'
import { dateFormatterYearView, numberFormatterView } from '../common/helpers/formatters'
import * as moment from 'moment'
import { getAverage } from '../common/helpers/math'

const SELECT_CUSTOMER_TEXT = t('Kunde auswählen')
const SELECT_TYPE_TEXT = t('Alle')
const SELECT_TYPE_TEXT_INTERPRET = t('Dolmetschen')
const SELECT_TYPE_TEXT_TRANSLATE = t('Übersetzen')
const SELECT_TYPE_TEXT_TRANSLATE_CERTIFY = t('Beglaubigen')
const SELECT_TYPE_TEXT_OTHER = t('Andere')

const TRANSLATE_REGEX = /[üÜ]bersetz/gi
const TRANSLATE_CERTIFY_REGEX = /beglaubig.*[üÜ]bersetz/gi
const INTERPRET_REGEX = /dolmetsch/gi

interface Props {
  customers: Customer[]
  bills: BillDbModel[]
}

interface CustomerStats {
  name: string
  total: number
  billCount: number
  averageTimeToPay: number
}

export default class AppComponent extends React.Component<Props, {}> {

  state: {
    customers: Customer[]
    bills: BillDbModel[]
    selectedYear: string
    selectedType: string
  }

  constructor(props) {
    super(props)

    // we convert props to state here to be able to load bills before render() is called
    this.state = {
      bills: props.bills,
      customers: props.customers,
      selectedYear: this.getAvailableYears() !== [] ? this.getAvailableYears()[0] : '',
      selectedType: SELECT_TYPE_TEXT
    }
  }

  getTotal(): string {
    let total = 0

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill)) {
        total += bill.amount
      }
    }

    return numberFormatterView(total)
  }

  getAvailableYears(dateType: 'date_paid' | 'date_created' = 'date_paid'): string[] {
    let years: string[] = []

    for (let bill of this.props.bills) {
      if (bill[dateType] == null || bill[dateType] === '') {
        continue
      }

      let newDate = dateFormatterYearView(bill[dateType])
      
      if (years.indexOf(newDate) === -1) {
        years.push(newDate)
      }
    }

    return years.sort(desc)
  }

  getAvailableTypes(): string[] {
    return [
      SELECT_TYPE_TEXT,
      SELECT_TYPE_TEXT_TRANSLATE,
      SELECT_TYPE_TEXT_TRANSLATE_CERTIFY,
      SELECT_TYPE_TEXT_INTERPRET,
      SELECT_TYPE_TEXT_OTHER,
    ]
  }

  getDaysToPay(bill: BillDbModel): number {
    let createdDate = bill.date_created
    let payDate = bill.date_paid

    if (payDate != null) {
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
      let averageTimeToPay = Math.round(getAverage(customer.daysToPayList))
      
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
    return [
      SELECT_TYPE_TEXT_INTERPRET,
      SELECT_TYPE_TEXT_TRANSLATE
    ]
  }

  getLineChartData(dateType: 'date_paid' | 'date_created'): number[] {
    let amountsPerMonth = {}

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill, dateType)) {
        if (bill[dateType] == null) {
          continue
        }

        let month = moment(bill[dateType]).month() + 1

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

  getTypesPieChartData(dateType: 'date_paid' | 'date_created' = 'date_paid'): number[] {
    let sumInterpreting = 0
    let sumTranslating = 0

    for (let bill of this.props.bills) {
      if (! this.matchesYear(bill[dateType], this.state.selectedYear)) {
        continue
      }

      if (this.matchesType(bill.comment, SELECT_TYPE_TEXT_INTERPRET)) {
        sumInterpreting += 1
      } else if (this.matchesType(bill.comment, SELECT_TYPE_TEXT_TRANSLATE)) {
        sumTranslating += 1
      } else {
        console.log('getTypesPieChartData: no match for', bill.comment)
      }
    }

    return [
      sumInterpreting,
      sumTranslating
    ]
  }

  getTypesIncomePieChartData(dateType: 'date_paid' | 'date_created' = 'date_paid'): number[] {
    let sumInterpreting = 0
    let sumTranslating = 0

    for (let bill of this.props.bills) {
      if (! this.matchesYear(bill[dateType], this.state.selectedYear)) {
        continue
      }

      if (this.matchesType(bill.comment, SELECT_TYPE_TEXT_INTERPRET)) {
        sumInterpreting += bill.amount
      } else if (this.matchesType(bill.comment, SELECT_TYPE_TEXT_TRANSLATE)) {
        sumTranslating += bill.amount
      } else {
        console.log('getTypesIncomePieChartData: no match for', bill.comment)
      }
    }
    
    return [
      parseFloat(sumInterpreting.toFixed(2)),
      parseFloat(sumTranslating.toFixed(2))
    ]
  }

  matchesFilters(bill: BillDbModel, dateType: 'date_paid' | 'date_created' = 'date_paid'): boolean {
    return this.matchesYear(bill[dateType], this.state.selectedYear) && this.matchesType(bill.comment, this.state.selectedType)
  }

  matchesYear(date: string, year: string): boolean {
    if (date == null || date === '') {
      return false
    }

    let givenYear = '' + moment(date).year()
    
    return (givenYear === year)
  }

  matchesType(text: string, type: string): boolean {
    if (text == null) {
      return false
    }

    switch (type) {
      case SELECT_TYPE_TEXT: return true
      case SELECT_TYPE_TEXT_INTERPRET: return INTERPRET_REGEX.test(text)
      case SELECT_TYPE_TEXT_TRANSLATE_CERTIFY: return TRANSLATE_CERTIFY_REGEX.test(text)
      case SELECT_TYPE_TEXT_TRANSLATE: return TRANSLATE_REGEX.test(text)
      case SELECT_TYPE_TEXT_OTHER: {
        return (!INTERPRET_REGEX.test(text) &&
          !TRANSLATE_CERTIFY_REGEX.test(text) &&
          !TRANSLATE_REGEX.test(text))
      }
    }

    return false
  }

  render() {
    return (
      <div>

        <FilterComponent
          years={this.getAvailableYears()}
          types={this.getAvailableTypes()}
          handleYearChange={element => this.setState({selectedYear: element.target.value})}
          handleTypeChange={element => this.setState({selectedType: element.target.value})}
          selectedType={this.state.selectedType}
          selectedYear={this.state.selectedYear}
        />

        <TableComponent data={this.getTableData()} />

        <TotalSumComponent total={this.getTotal()} />

        <ChartComponent
          lineChartLabels={this.getLineChartLabels()}
          lineChartDatePaidData={this.getLineChartData('date_paid')}
          typesPieChartLabels={this.getTypesPieChartLabels()}
          typesPieChartData={this.getTypesPieChartData()}
          typesIncomePieChartData={this.getTypesIncomePieChartData()}
        />

      </div>
    )
  }

}

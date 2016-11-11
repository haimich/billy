import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FilterComponent from './FilterComponent'
import Bill from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import TableComponent from './TableComponent'
import TotalSumComponent from './TotalSumComponent'
import ChartComponent from './ChartComponent'
import t from '../common/helpers/i18n'
import { asc, desc } from '../common/helpers/sorters'
import { dateFormatterYearView, numberFormatterView } from '../common/helpers/formatters'
import * as moment from 'moment'

const SELECT_CUSTOMER_TEXT = t('Kunde auswählen')
const SELECT_TYPE_TEXT = t('Alle')
const SELECT_TYPE_TEXT_INTERPRET = t('Dolmetschen')
const SELECT_TYPE_TEXT_TRANSLATE = t('Übersetzen')
const SELECT_TYPE_TEXT_TRANSLATE_CERTIFY = t('Beglaubigen')
const SELECT_TYPE_TEXT_OTHER = t('Andere')

const TRANSLATE_REGEX = /[üÜ]bersetz/gi
const TRANSLATE_CERTIFY_REGEX = /beglaubig.*[üÜ]bersetz/gi
const INTERPRET_REGEX = /dolmetsch/gi

export default class AppComponent extends React.Component<any, {}> {

  props: {
    customers: Customer[];
    bills: Bill[];
  }

  state: {
    customers: Customer[];
    bills: Bill[];
    selectedYear: string;
    selectedType: string;
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

  getAvailableYears(): string[] {
    let years: string[] = []

    for (let bill of this.props.bills) {
      let dateCreated = dateFormatterYearView(bill.date_created)
      if (years.indexOf(dateCreated) === -1) {
        years.push(dateCreated)
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

  getTableData(): Customer[] {
    let customersWithTotals = {}

    for (let bill of this.props.bills) {
      if (this.matchesFilters(bill)) {
        if (bill.customer == null || bill.customer.id == null) {
          continue
        }

        if (customersWithTotals[bill.customer.id] == null) {
          customersWithTotals[bill.customer.id] = {
            total: bill.amount,
            id: bill.customer.id,
            name: bill.customer.name,
            billCount: 1
          }
        } else {
          customersWithTotals[bill.customer.id].total += bill.amount
          customersWithTotals[bill.customer.id].billCount += 1
        }
      }
    }

    let customers: any[] = []
    for (let customerId of Object.keys(customersWithTotals)) {
      let customer = customersWithTotals[customerId]
      customers.push(customer)
    }

    return customers
  }

  matchesFilters(bill: Bill): boolean {
    return this.matchesSelectedYear(bill.date_created) && this.matchesType(bill.comment)
  }

  matchesSelectedYear(date: string): boolean {
    let year = '' + moment(date).year()
    return (year === this.state.selectedYear)
  }

  matchesType(text?: string): boolean {
    if (text == null) {
      return false
    }

    switch (this.state.selectedType) {
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

        <ChartComponent />

      </div>
    )
  }

}

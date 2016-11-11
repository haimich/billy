import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import Bill from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import t from '../common/helpers/i18n'
import { dateFormatterYearView, numberFormatterView, currencyFormatter } from '../common/helpers/formatters'
import { asc, desc } from '../common/helpers/sorters'
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

export class FormComponent extends React.Component<any, {}> {

  props: {
    customers: Customer[];
    bills: Bill[];
  }

  state: {
    selectedYear: string;
    selectedCustomer: string;
    selectedType: string;
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedCustomer: SELECT_CUSTOMER_TEXT,
      selectedYear: this.getAvailableYears() !== [] ? this.getAvailableYears()[0] : '',
      selectedType: SELECT_TYPE_TEXT
    }
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

  handleTypeChange(element) {
    this.setState({
      selectedType: element.target.value
    })
  }

  handleYearChange(element) {
    this.setState({
      selectedYear: element.target.value
    })
  }

  generateYearSelectbox() {
    let options: JSX.Element[] = []

    for (let year of this.getAvailableYears()) {
      options.push(<option key={year}>{year}</option>)
    }

    return (
      <select
        className="form-control"
        id="year"
        value={this.state.selectedYear}
        onChange={this.handleYearChange.bind(this)}
      >
        {options}
      </select>
    )
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
        return (! INTERPRET_REGEX.test(text) &&
                ! TRANSLATE_CERTIFY_REGEX.test(text) &&
                ! TRANSLATE_REGEX.test(text))
      }
    }

    return false
  }

  getTotalForCustomers(): Customer[] {
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
            name: bill.customer.name
          }
        } else {
          customersWithTotals[bill.customer.id].total += bill.amount
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

  render() {
    const tableOptions: Options = {
      sortName: 'total',
      sortOrder: 'desc',
      noDataText: t('Keine Einträge')
    }

    return (
      <div>
        <form id="filter-container">
          <label htmlFor="year">{t('Jahr')}</label>
          {this.generateYearSelectbox()}

          <label htmlFor="type">{t('Auftragsart')}</label>
          <select
            className="form-control"
            id="type"
            value={this.state.selectedType}
            onChange={this.handleTypeChange.bind(this)}
          >
            <option key="all" selected>{SELECT_TYPE_TEXT}</option>
            <option key="translate">{SELECT_TYPE_TEXT_TRANSLATE}</option>
            <option key="translate_certify">{SELECT_TYPE_TEXT_TRANSLATE_CERTIFY}</option>
            <option key="interpret">{SELECT_TYPE_TEXT_INTERPRET}</option>
            <option key="other">{SELECT_TYPE_TEXT_OTHER}</option>
          </select>
        </form>

        <div id="table-container">
          <BootstrapTable
            data={this.getTotalForCustomers()}
            striped={true}
            hover={true}
            options={tableOptions}
            pagination={true}>

            <TableHeaderColumn isKey={true} dataField="name" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
            <TableHeaderColumn dataField="total" dataFormat={currencyFormatter} dataAlign="right" dataSort={true}>{t('Umsatz')}</TableHeaderColumn>

          </BootstrapTable>
        </div>

        <div className="pull-right">
          <b>{t('SUMME')}:</b> {this.getTotal()} €
        </div>

      </div>
    )
  }

}
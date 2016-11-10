import * as React from 'react';
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import t from '../common/helpers/i18n'
import { dateFormatterYearView, numberFormatterView } from '../common/helpers/formatters'
import { asc, desc } from '../common/helpers/sorters'
import * as moment from 'moment'

const SELECT_CUSTOMER_TEXT = t('Kunde auswählen')

export class FormComponent extends React.Component<any, {}> {

  props: {
    customers: Customer[];
    bills: Bill[];
  }

  state: {
    selectedYear: string;
    selectedCustomer: string;
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedCustomer: SELECT_CUSTOMER_TEXT,
      selectedYear: this.getAvailableYears() !== [] ? this.getAvailableYears()[0] : ''
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

  getAvailableCustomers(): string[] {
    let customers: string[] = []

    for (let customer of this.props.customers) {
      if (customers.indexOf(customer.name) === -1) {
        customers.push(customer.name)
      }
    }

    return customers.sort(asc)
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

  handleCustomerChange(element) {
    this.setState({
      selectedCustomer: element.target.value
    })
  }

  generateCustomerSelectbox() {
    let options: JSX.Element[] = []

    for (let customer of this.getAvailableCustomers()) {
      options.push(<option key={customer}>{customer}</option>)
    }

    return (
      <select
        className="form-control"
        id="customer"
        value={this.state.selectedCustomer}
        onChange={this.handleCustomerChange.bind(this)}
      >
        <option>{SELECT_CUSTOMER_TEXT}</option>
        {options}
      </select>
    )
  }

  getTotal(): string {
    let total = 0

    for (let bill of this.props.bills) {
      let createdYear = '' + moment(bill.date_created).year()

      if (createdYear === this.state.selectedYear) {
        if (
          this.state.selectedCustomer === SELECT_CUSTOMER_TEXT ||
          this.state.selectedCustomer === bill.customer_name) {
          total += bill.amount
        } 
      }
    }

    return numberFormatterView(total)
  }

  render() {
    return (
      <form>

        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

        <label htmlFor="customer">{t('Kunde')}</label>
        {this.generateCustomerSelectbox()}

        <div className="panel panel-default">
          <div className="panel-heading">{t('Umsatz')}</div>
          <div className="panel-body">
            {this.getTotal()} €
          </div>
        </div>

      </form>
    )
  }

}
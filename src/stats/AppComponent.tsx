import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
import { FormComponent } from './FormComponent'
import Bill from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import * as NotificationSystem from 'react-notification-system'

let notifications

export default class AppComponent extends React.Component<any, {}> {

  props: {
    customers: Customer[];
    bills: Bill[];
  }

  state: {
    customers: Customer[];
    bills: Bill[];
  }

  constructor(props) {
    super(props)

    // we convert props to state here to be able to load bills before render() is called
    this.state = {
      bills: props.bills,
      customers: props.customers
    }
  }

  render() {
    return (
      <div>
        <FormComponent bills={this.state.bills} customers={this.state.customers} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

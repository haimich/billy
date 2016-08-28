import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBill, updateBill } from '../repositories/billsRepository'
import Bill from '../models/BillModel'
import TableComponent from '../components/TableComponent'
import EditorComponent from '../components/EditorComponent'
import * as NotificationSystem from 'react-notification-system'

let notifications

export default class AppComponent extends React.Component<any, {}> {

  state: {
    bills: Bill[]
  }

  refs: {
    notificationSystem: HTMLInputElement
  }

  notificationSystem;

  constructor(props) {
    super(props)
    
    this.state = {
      bills: props.bills // we convert props to state here to be able to load bills before render() is called
    }
  }

  componentDidMount() {
    notifications = this.refs.notificationSystem;
  }

  save(bill: Bill) {
    createBill(bill)
      .then(() => {
        notifications.addNotification({
          message: 'Die Rechnung wurde gespeichert!',
          level: 'success'
        })
      })
      .catch((err) => {
        notifications.addNotification({
          message: 'Es ist ein Fehler aufgetreten: ' + err.message,
          level: 'error'
        })
      })
  }

  update(bill: Bill) {
    updateBill(bill)
      .then(() => {
        notifications.addNotification({
          message: 'Der Eintrag wurde aktualisiert!',
          level: 'success'
        })
      })
      .catch((err) => {
        notifications.addNotification({
          message: 'Es ist ein Fehler aufgetreten: ' + err.message,
          level: 'error'
        })
      })
  }

  render() {
    return (
      <div>
        <TableComponent bills={this.state.bills} update={this.update} />
        <EditorComponent save={this.save} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

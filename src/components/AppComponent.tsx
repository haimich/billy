import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBill, updateBill, deleteBillsByIds } from '../repositories/billsRepository'
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
      .catch(this.handleError)
  }

  update(bill: Bill) {
    updateBill(bill)
      .then(() => {
        notifications.addNotification({
          message: 'Der Eintrag wurde aktualisiert!',
          level: 'success'
        })
      })
      .catch(this.handleError)
  }

  delete(billIds: String[]) {
    deleteBillsByIds(billIds)
      .then(() => {
        let msg
        if (billIds.length === 1) {
          msg = 'Der Eintrag wurde gelöscht!'
        } else {
          msg = 'Die Einträge wurden gelöscht!'
        }

        notifications.addNotification({
          message: msg,
          level: 'success'
        })
      })
      .catch(this.handleError)
  }

  handleError(err: Error) {
    notifications.addNotification({
      message: 'Es ist ein Fehler aufgetreten: ' + err.message,
      level: 'error'
    })
  }

  render() {
    return (
      <div>
        <TableComponent bills={this.state.bills} update={this.update} delete={this.delete} />
        <EditorComponent save={this.save} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

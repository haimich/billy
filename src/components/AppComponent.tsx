import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBill, updateBill, deleteBillsByIds } from '../repositories/billsRepository'
import Bill from '../models/BillModel'
import TableComponent from '../components/TableComponent'
import EditorComponent from '../components/EditorComponent'
import * as NotificationSystem from 'react-notification-system'
import t from '../helpers/i18n'

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
        this.setState({
          bills: [bill].concat(this.state.bills)
        })
      })
      .catch(this.handleError)
  }

  update(bill: Bill) {
    updateBill(bill)
      .then(() => {
        this.setState({
          bills: this.state.bills.map((element) => {
            if (element.id === bill.id) {
              return bill
            } else {
              return element
            }
          })
        })
      })
      .catch(this.handleError)
  }

  delete(billIds: String[]) {
    deleteBillsByIds(billIds)
      .then(() => {
        this.setState({
          bills: this.state.bills.filter((element) => {
            for (let id of billIds) {
              if (element.id === id) {
                return
              }
            }
            return element
          })
        })

        notifications.addNotification({
          message: t('Löschen erfolgreich', {count: billIds.length}),
          level: 'success',
          position: 'tc'
        })
      })
      .catch(this.handleError)
  }

  handleError(err: Error) {
    notifications.addNotification({
      message: t('Datenbank Fehler') + err.message,
      level: 'error',
      position: 'tc'
    })
  }

  render() {
    return (
      <div>
        <TableComponent bills={this.state.bills} update={this.update.bind(this)} delete={this.delete.bind(this)} />
        <EditorComponent save={this.save.bind(this)} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

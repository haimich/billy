import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBill, updateBill, deleteBillsByIds } from '../common/repositories/billsRepository'
import { copyToAppDir } from '../common/providers/fileProvider'
import Bill from '../common/models/BillModel'
import TableComponent from './TableComponent'
import EditorComponent from './EditorComponent'
import * as NotificationSystem from 'react-notification-system'
import t from '../common/helpers/i18n'

let notifications

export default class AppComponent extends React.Component<any, {}> {

  state: {
    bills: Bill[],
    selectedBill?: Bill
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
    notifications = this.refs.notificationSystem
  }

  async save(bill: Bill) {
    try {
      if (bill.file_path != null) {
        const newFilePath = await copyToAppDir(bill.id, bill.file_path)
        bill.file_path = newFilePath
      }

      await createBill(bill)
    } catch (err) {
      this.handleError(err)
    }

    this.setState({
      selectedBill: undefined,
      bills: [ bill ].concat(this.state.bills)
    })
  }

  async update(bill: Bill) {
    try {
      await updateBill(bill)
    } catch (err) {
      this.handleError(err)
    }

    this.setState({
      selectedBill: undefined,
      bills: this.state.bills.map((element) => {
        if (element.id === bill.id) {
          return bill
        } else {
          return element
        }
      })
    })
  }

  async delete(billIds: String[]) {
    try {
      await deleteBillsByIds(billIds)
    } catch (err) {
      this.handleError(err)
    }

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
  }

  select(row: Bill) {
    console.log(row)
    this.setState({
      selectedBill: row
    })
  }

  handleError(err: Error) {
    let message = t('Datenbank-Fehler') + err.message
    if (err['code'] === 'SQLITE_CONSTRAINT') {
      message = t('Datenbank Fehler duplicate id')
    }

    notifications.addNotification({
      message,
      level: 'error',
      position: 'tc'
    })
  }

  render() {
    return (
      <div>
        <TableComponent
            bills={this.state.bills}
            delete={this.delete.bind(this)}
            select={this.select.bind(this)}
            selectedId={this.state.selectedBill && this.state.selectedBill.id}
        />
        <EditorComponent bill={this.state.selectedBill} save={this.save.bind(this)} update={this.update.bind(this)} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

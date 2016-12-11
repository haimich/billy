import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBill, updateBill, getBillByInvoiceId, deleteBillByInvoiceId } from '../common/services/billsService'
import { performFileActions, deleteAllFilesForBill } from '../common/services/filesService'
import { updateCustomer } from '../common/services/customersService'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import FileModel from '../common/models/FileModel'
import FileActions from '../common/models/FileActions'
import Customer from '../common/models/CustomerModel'
import TableComponent from './TableComponent'
import EditorComponent from './EditorComponent'
import * as NotificationSystem from 'react-notification-system'
import t from '../common/helpers/i18n'

let notifications

interface State {
  bills: BillDbModel[];
  selectedBill?: BillDbModel;
}

export default class AppComponent extends React.Component<any, {}> {

  state: State

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

  async save(bill: Bill, fileActions: FileActions) {
    let billWithFiles

    try {
      const createdBill = await createBill(bill)
      await performFileActions(createdBill, fileActions)
      billWithFiles = await getBillByInvoiceId(createdBill.invoice_id)
    } catch (err) {
      this.handleError(err)
      return
    }

    this.setState({
      selectedBill: undefined,
      bills: [ billWithFiles ].concat(this.state.bills)
    })
  }

  async update(bill: Bill, fileActions: FileActions) {
    let billWithFiles

    try {
      const updatedBill = await updateBill(bill)
      await performFileActions(updatedBill, fileActions)
      billWithFiles = await getBillByInvoiceId(updatedBill.invoice_id)
    } catch (err) {
      this.handleError(err)
      return
    }

    this.setState({
      selectedBill: undefined,
      bills: this.state.bills.map((element) => {
        if (element.invoice_id === bill.invoice_id) {
          return billWithFiles
        } else {
          return element
        }
      })
    })
  }

  async deleteBills(invoiceIds: string[]) {
    let invoiceIdMap = {}

    try {
      for (let invoiceId of invoiceIds) {
        invoiceIdMap[invoiceId] = true

        const bill = await getBillByInvoiceId(invoiceId)
        await deleteAllFilesForBill(bill.id, invoiceId)
        await deleteBillByInvoiceId(invoiceId)
      }
    } catch (err) {
      this.handleError(err)
    }

    this.setState({
      bills: this.state.bills.filter(element => ! invoiceIdMap[element.invoice_id]),
      selectedBill: undefined
    })

    this.notify(t('Löschen erfolgreich'), 'success')
  }

  async updateCustomer(customer: Customer) {
    try {
      await updateCustomer(customer)
    } catch (err) {
      this.handleError(err)
    }
  }

  notify(message: string, level: 'error' | 'success') {
    notifications.addNotification({
      message,
      level,
      position: 'tc'
    })
  }

  handleError(err: Error) {
    let message = t('Es ist ein Fehler aufgetreten: ') + err.message

    if (err['code'] === 'SQLITE_CONSTRAINT') {
      message = t('Datenbank Fehler duplicate id')
    }

    console.error(err)
    this.notify(message, 'error')
  }

  billSelected(isSelected: boolean, bill?: BillDbModel) {
    if (isSelected) {
      this.setState({ selectedBill: bill })
    } else {
      this.setState({ selectedBill: undefined })
    }
  }

  render() {
    return (
      <div>
        <TableComponent
          bills={this.state.bills}
          delete={this.deleteBills.bind(this)}
          select={this.billSelected.bind(this)}
          selectedInvoiceId={this.state.selectedBill && this.state.selectedBill.invoice_id}
        />
        <EditorComponent
          bill={this.state.selectedBill}
          save={this.save.bind(this)}
          update={this.update.bind(this)}
          updateCustomer={this.updateCustomer.bind(this)}
          notify={this.notify.bind(this)}
        />

        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

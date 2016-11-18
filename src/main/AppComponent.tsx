import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getBillByInvoiceId, createBill, updateBill, deleteBillByInvoiceId } from '../common/repositories/billsRepository'
import { updateCustomer } from '../common/repositories/customersRepository'
import { copyToAppDir, deleteFilesByInvoiceId, rmrf } from '../common/providers/fileProvider'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
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

  async saveBill(bill: Bill) {
    let createdBill

    try {
      if (bill.file_path != null) {
        bill.file_path = await copyToAppDir(bill.invoice_id, bill.file_path)
      }

      createdBill = await createBill(bill)
    } catch (err) {
      this.handleError(err)
      return
    }

    this.setState({
      selectedBill: undefined,
      bills: [ createdBill ].concat(this.state.bills)
    })
  }

  async updateBill(bill: Bill) {
    let updatedBill

    try {
      if (bill.file_path != null) {
        bill.file_path = await copyToAppDir(bill.invoice_id, bill.file_path)
      }

      updatedBill = await updateBill(bill)
    } catch (err) {
      this.handleError(err)
      return
    }

    this.setState({
      selectedBill: undefined,
      bills: this.state.bills.map((element) => {
        if (element.invoice_id === bill.invoice_id) {
          return updatedBill
        } else {
          return element
        }
      })
    })
  }

  async deleteBill(billIds: string[]) {
    try {
      for (let invoiceId of billIds) {
        await deleteBillByInvoiceId(invoiceId)
        await deleteFilesByInvoiceId(invoiceId)
      }
    } catch (err) {
      this.handleError(err)
    }

    this.setState({
      bills: this.state.bills.filter((element) => {
        for (let invoiceId of billIds) {
          if (element.invoice_id === invoiceId) {
            return false
          }
        }
        return true
      }),
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

  async deleteFile(invoiceId: string, filepath: string) {
    console.log('TODO')
    // try {
    //   let bill: BillDbModel = await getBillByInvoiceId(invoiceId)
    //
    //   if (bill.file_path === filepath) {
    //     console.log('delete it', bill)
    //     await rmrf(bill.file_path)
    //
    //     let updatedBill = await updateBill({
    //       invoice_id: bill.invoice_id,
    //       customer_id: bill.customer.id,
    //       amount: bill.amount,
    //       date_created: bill.date_created,
    //       date_paid: bill.date_paid,
    //       comment: bill.comment,
    //       file_path: null
    //     })
    //
    //
    //     this.setState({
    //       bills: this.state.bills.map((element) => {
    //         if (element.invoice_id === bill.invoice_id) {
    //           return updatedBill
    //         } else {
    //           return element
    //         }
    //       })
    //     })
    //   }
    // } catch (err) {
    //   this.handleError(err)
    // }
    //
    // this.notify(t('Die Datei wurde erfolgreich gelöscht!'), 'success')

    // TODO: check if bill has a different filename (then new file added)
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
          delete={this.deleteBill.bind(this)}
          select={this.billSelected.bind(this)}
          selectedInvoiceId={this.state.selectedBill && this.state.selectedBill.invoice_id}
        />
        <EditorComponent
          bill={this.state.selectedBill}
          saveBill={this.saveBill.bind(this)}
          updateBill={this.updateBill.bind(this)}
          updateCustomer={this.updateCustomer.bind(this)}
          notify={this.notify.bind(this)}
          deleteFile={this.deleteFile.bind(this)}
        />

        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

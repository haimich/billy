import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron'
import { createBill, updateBill, getBillByInvoiceId, deleteBillByInvoiceId } from '../common/services/billsService'
import { createBillItem, updateBillItem, deleteBillItemById } from '../common/services/billItemsService'
import { performBillFileActions, deleteAllFilesForBill } from '../common/services/billFilesService'
import { updateCustomer } from '../common/services/customersService'
import { createExpense, updateExpense, getExpenseById, deleteExpenseById } from '../common/services/expensesService'
import { performExpenseFileActions, deleteAllFilesForExpense } from '../common/services/expenseFilesService'
import Bill from '../common/models/BillModel'
import BillItem from '../common/models/BillItemModel'
import BillDbModel from '../common/models/BillDbModel'
import Expense from '../common/models/ExpenseModel'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import BillFileModel from '../common/models/BillFileModel'
import ExpenseFileModel from '../common/models/ExpenseFileModel'
import FileActions from '../common/models/FileActionsModel'
import Customer from '../common/models/CustomerModel'
import BillsTableComponent from './BillsTableComponent'
import BillsEditorComponent from './BillsEditorComponent'
import ExpensesTableComponent from './ExpensesTableComponent'
import ExpensesEditorComponent from './ExpensesEditorComponent'
import OnOffSwitchComponent from '../common/components/OnOffSwitchComponent'
import * as NotificationSystem from 'react-notification-system'
import t from '../common/helpers/i18n'

let notifications

interface Props {
  bills: BillDbModel[]
  expenses: ExpenseDbModel[]
}

interface State {
  bills: BillDbModel[]
  expenses: ExpenseDbModel[]
  selectedBill?: BillDbModel
  selectedExpense?: ExpenseDbModel
  mode: 'bills' | 'expenses'
}

export default class AppComponent extends React.Component<Props, {}> {

  state: State

  refs: {
    notificationSystem: HTMLInputElement
  }

  constructor(props) {
    super(props)
        
    // we convert props to state here to be able to load bills before render() is called
    this.state = {
      bills: props.bills,
      expenses: props.expenses,
      mode: 'bills'
    }

    ipcRenderer.on('shortcut-CommandOrControl+d', () => {
      this.toggleMode()
    })
  }

  componentDidMount() {
    notifications = this.refs.notificationSystem
  }

  toggleMode() {
    if (this.state.mode === 'bills') {
      this.setState({ mode: 'expenses' })
    } else if (this.state.mode === 'expenses') {
      this.setState({ mode: 'bills' })
    }
  }

  saveBill(bill: Bill, billItem: BillItem, fileActions: FileActions<BillFileModel>): Promise<{}> {
    return new Promise((resolve, reject) => {
      let createdBill

      createBill(bill)
        .then(result => {
          createdBill = result

          billItem.bill_id = createdBill.id
          return createBillItem(billItem)
        })
        .then(() => {
          return performBillFileActions(createdBill, fileActions)
        })
        .then(() => {
          return getBillByInvoiceId(createdBill.invoice_id)
        })
        .then(billWithFiles => {
          resolve() // let the editor know that we're good

          // delay updating of state until resolve() is done (see https://github.com/haimich/billy/issues/68)
          process.nextTick(() => {
            this.setState({
              selectedBill: undefined,
              bills: [ billWithFiles ].concat(this.state.bills)
            })
          })
        })
        .catch(err => {
          this.handleError(err)
          reject(err)
        })
    })
  }

  updateBill(bill: Bill, billItem: BillItem, fileActions: FileActions<BillFileModel>): Promise<{}> {
    return new Promise((resolve, reject) => {
      let updatedBill

      updateBill(bill)
        .then(result => {
          updatedBill = result

          return updateBillItem(billItem)
        })
        .then(() => {
          return performBillFileActions(updatedBill, fileActions)
        })
        .then(() => {
          return getBillByInvoiceId(updatedBill.invoice_id)
        })
        .then(billWithFiles => {
          resolve() // let the editor know that we're good

          // delay updating of state until resolve() is done (see https://github.com/haimich/billy/issues/68)
          process.nextTick(() => {
            this.setState({
              selectedBill: undefined,
              bills: this.state.bills.map(element => {
                if (element.invoice_id === bill.invoice_id) {
                  return billWithFiles
                } else {
                  return element
                }
              })
            })
          })
        })
        .catch(err => {
          this.handleError(err)
          reject(err)
        })
    })
  }

  async deleteBills(invoiceIds: string[]): Promise<any> {
    let invoiceIdMap = {}

    try {
      for (let invoiceId of invoiceIds) {
        invoiceIdMap[invoiceId] = true

        const bill = await getBillByInvoiceId(invoiceId)
        await deleteAllFilesForBill(bill.id, invoiceId)
        
        for (let item of bill.items) {
          await deleteBillItemById(item.id)
        }

        await deleteBillByInvoiceId(invoiceId)
      }
    } catch (err) {
      this.handleError(err)
      throw err
    }

    this.setState({
      bills: this.state.bills.filter(element => ! invoiceIdMap[element.invoice_id]),
      selectedBill: undefined
    })

    this.notify(t('Die Rechnung wurde gelöscht!'), 'success')
  }

  async updateCustomer(customer: Customer) {
    try {
      await updateCustomer(customer)
    } catch (err) {
      this.handleError(err)
    }
  }

  saveExpense(expense: Expense, fileActions: FileActions<ExpenseFileModel>): Promise<{}> {
    return new Promise((resolve, reject) => {
      let createdExpense

      createExpense(expense)
        .then(result => {
          createdExpense = result
          return performExpenseFileActions(createdExpense, fileActions)
        })
        .then(() => {
          return getExpenseById(createdExpense.id)
        })
        .then(expenseWithFiles => {
          resolve() // let the editor know that we're good

          // delay updating of state until resolve() is done (see https://github.com/haimich/billy/issues/68)
          process.nextTick(() => {
            this.setState({
              selectedExpense: undefined,
              expenses: [ expenseWithFiles ].concat(this.state.expenses)
            })
          })
        })
        .catch(err => {
          this.handleError(err)
          reject(err)
        })
    })
  }

  updateExpense(expense: Expense, fileActions: FileActions<ExpenseFileModel>): Promise<{}> {
    return new Promise((resolve, reject) => {
      let updatedExpense

      updateExpense(expense)
        .then(result => {
          updatedExpense = result
          return performExpenseFileActions(updatedExpense, fileActions)
        })
        .then(() => {
          return getExpenseById(updatedExpense.id)
        })
        .then(expenseWithFiles => {
          resolve() // let the editor know that we're good

          // delay updating of state until resolve() is done (see https://github.com/haimich/billy/issues/68)
          process.nextTick(() => {
            this.setState({
              selectedExpense: undefined,
              expenses: this.state.expenses.map(element => {
                if (element.id === expenseWithFiles.id) {
                  return expenseWithFiles
                } else {
                  return element
                }
              })
            })
          })
        })
        .catch(err => {
          this.handleError(err)
          reject(err)
        })
    })
  }

  async deleteExpenses(ids: string[]): Promise<any> {
    let idMap = {}

    try {
      for (let id of ids) {
        idMap[id] = true

        const expense = await getExpenseById(Number(id))
        await deleteAllFilesForExpense(expense.id)
        await deleteExpenseById(Number(id))
      }
    } catch (err) {
      this.handleError(err)
      throw err
    }

    this.setState({
      expenses: this.state.expenses.filter(element => ! idMap[element.id]),
      selectedExpense: undefined
    })

    this.notify(t('Die Ausgabe wurde gelöscht!'), 'success')
  }

  notify(message: string, level: 'error' | 'success') {
    if (notifications == null) {
      console.log(level + ': ' + message)
      return
    }

    notifications.addNotification({
      message,
      level,
      position: 'tc'
    })
  }

  handleError(err: Error) {
    let message = t('Es ist ein Fehler aufgetreten: ') + err.message
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

  expenseSelected(isSelected: boolean, expense?: ExpenseDbModel) {
    if (isSelected) {
      this.setState({ selectedExpense: expense })
    } else {
      this.setState({ selectedExpense: undefined })
    }
  }

  render() {
    let tableView, editorView

    if (this.state.mode === 'bills') {
      tableView =
        <BillsTableComponent
          bills={this.state.bills}
          delete={this.deleteBills.bind(this)}
          select={this.billSelected.bind(this)}
          selectedInvoiceId={this.state.selectedBill && this.state.selectedBill.invoice_id}
        />
      editorView =
        <BillsEditorComponent
          bill={this.state.selectedBill}
          save={this.saveBill.bind(this)}
          update={this.updateBill.bind(this)}
          updateCustomer={this.updateCustomer.bind(this)}
          notify={this.notify.bind(this)}
        />
    } else if (this.state.mode === 'expenses') {
      tableView =
        <ExpensesTableComponent
          expenses={this.state.expenses}
          select={this.expenseSelected.bind(this)}
          selectedId={this.state.selectedExpense && this.state.selectedExpense.id}
          delete={this.deleteExpenses.bind(this)}
        />
      editorView =
        <ExpensesEditorComponent
          expense={this.state.selectedExpense}
          save={this.saveExpense.bind(this)}
          update={this.updateExpense.bind(this)}
          notify={this.notify.bind(this)}
        />
    }

    return (
      <div>
        <OnOffSwitchComponent
          activeLabel={t('Ausgaben')}
          inactiveLabel={t('Einnahmen')}
          selectedValue={this.state.mode}
          keys={{inactive: 'bills', active: 'expenses'}}
          handleValueChange={newValue => this.setState({ mode: newValue})}
        />

        {tableView}

        {editorView}

        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

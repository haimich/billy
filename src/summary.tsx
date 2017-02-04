import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import AppComponent from './summary/AppComponent'
import { init as initBillsRepo } from './common/repositories/billsRepository'
import { init as initExpensesRepo } from './common/repositories/expensesRepository'
import { init as initBillTypesRepo } from './common/repositories/billTypesRepository'
import { init as initCustomersRepo } from './common/repositories/customersRepository'
import { init as initExpenseFilesRepo } from './common/repositories/expenseFilesRepository'
import { init as initBillFilesRepo } from './common/repositories/billFilesRepository'
import { init as initBillItemsRepo } from './common/repositories/billItemsRepository'
import { init as initExpenseTypesRepo } from './common/repositories/expenseTypesRepository'
import { listBills } from './common/services/billsService'
import { listExpenses } from './common/services/expensesService'

async function init() {
  let bills, expenses

  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initExpensesRepo(knexInstance)
    initBillFilesRepo(knexInstance)
    initExpenseFilesRepo(knexInstance)
    initBillTypesRepo(knexInstance)
    initBillItemsRepo(knexInstance)
    initCustomersRepo(knexInstance)
    initExpenseTypesRepo(knexInstance); // semicolon intended

    [bills, expenses] = await Promise.all([
      listBills(),
      listExpenses()
    ])
  } catch (err) {
    alert('Could not load from database: ' + err.stack)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent bills={bills} expenses={expenses} />
    </div>,
    document.getElementById('app')
  )
}

init()
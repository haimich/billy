import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import AppComponent from './stats/AppComponent'
import { init as initBillsRepo } from './common/repositories/billsRepository'
import { init as initExpensesRepo } from './common/repositories/expensesRepository'
import { init as initBillTypesRepo } from './common/repositories/billTypesRepository'
import { init as initCustomersRepo } from './common/repositories/customersRepository'
import { init as initBillFilesRepo } from './common/repositories/billFilesRepository'

import { init as initExpenseTypesRepo } from './common/repositories/expenseTypesRepository'
import { listBills } from './common/services/billsService'
import { listExpenses } from './common/services/expensesService'
import { listCustomers } from './common/services/customersService'
import { listBillTypes } from './common/services/billTypesService'
import { listExpenseTypes } from './common/services/expenseTypesService'

async function init() {
  let bills, customers, billTypes, expenses, expenseTypes

  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initBillFilesRepo(knexInstance)
    initBillTypesRepo(knexInstance)
    initExpensesRepo(knexInstance)
    initExpenseTypesRepo(knexInstance)
    initCustomersRepo(knexInstance); // semicolon intended

    [bills, customers, billTypes, expenses, expenseTypes] = await Promise.all([
      await listBills(),
      await listCustomers(),
      await listBillTypes(),
      await listExpenses(),
      await listExpenseTypes(),
    ])
  } catch (err) {
    alert('Could not load from database: ' + err.message)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent
        bills={bills}
        customers={customers}
        billTypes={billTypes}
        expenses={expenses}
        expenseTypes={expenseTypes}
      />
    </div>,
    document.getElementById('app')
  )
}

init()
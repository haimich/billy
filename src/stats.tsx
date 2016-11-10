import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import AppComponent from './stats/AppComponent'
import { init as initBillsRepo, listBills } from './common/repositories/billsRepository'
import { init as initCustomersRepo, listCustomers } from './common/repositories/customersRepository'

async function init() {
  let bills, customers

  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initCustomersRepo(knexInstance); // semicolon intended

    [bills, customers] = await Promise.all([
      await listBills(),
      await listCustomers()
    ])
  } catch (err) {
    alert('Could not load from database: ' + err.message)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent bills={bills} customers={customers} />
    </div>,
    document.getElementById('app')
  )
}

init()
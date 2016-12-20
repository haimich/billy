import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import AppComponent from './stats/AppComponent'
import { init as initBillsRepo } from './common/repositories/billsRepository'
import { init as initBillTypesRepo } from './common/repositories/billTypesRepository'
import { init as initCustomersRepo } from './common/repositories/customersRepository'
import { init as initFilesRepo } from './common/repositories/filesRepository'
import { listBills } from './common/services/billsService'
import { listCustomers } from './common/services/customersService'
import { listBillTypes } from './common/services/billTypesService'

async function init() {
  let bills, customers, billTypes

  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initFilesRepo(knexInstance)
    initBillTypesRepo(knexInstance)
    initCustomersRepo(knexInstance); // semicolon intended

    [bills, customers, billTypes] = await Promise.all([
      await listBills(),
      await listCustomers(),
      await listBillTypes(),
    ])
  } catch (err) {
    alert('Could not load from database: ' + err.message)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent bills={bills} customers={customers} billTypes={billTypes} />
    </div>,
    document.getElementById('app')
  )
}

init()
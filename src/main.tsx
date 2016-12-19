import Bill from './common/models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './main/AppComponent'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import { init as initBillsRepo } from './common/repositories/billsRepository'
import { init as initCustomersRepo } from './common/repositories/customersRepository'
import { init as initFilesRepo } from './common/repositories/filesRepository'
import { init as initBillTypesRepo } from './common/repositories/billTypesRepository'
import { listBills } from './common/services/billsService'

async function init() {
  let bills

  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initCustomersRepo(knexInstance)
    initFilesRepo(knexInstance)
    initBillTypesRepo(knexInstance)

    bills = await listBills()
  } catch (err) {
    alert('Could not load bills: ' + err.message)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent bills={bills} />
    </div>,
    document.getElementById('app')
  )
}

init()
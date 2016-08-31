import Bill from './common/models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './main/AppComponent'
import { initDb, listBills } from './common/repositories/billsRepository'

async function init() {
  await initDb()
  let bills = await listBills()

  ReactDOM.render(
    <div>
      <AppComponent bills={bills} />
    </div>,
    document.getElementById('app')
  )
}

init()
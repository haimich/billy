import Bill from './models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './components/AppComponent'
import { initDb, listBills } from './repositories/billsRepository'

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
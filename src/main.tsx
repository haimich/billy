import Bill from './common/models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './main/AppComponent'
import { init as initDb, listBills } from './common/repositories/billsRepository'

async function init() {
  let bills

  try {
    await initDb()
    bills = await listBills()
  } catch (err) {
    alert('Could not load bills ' + err.message)
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
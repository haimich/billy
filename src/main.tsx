import Bill from './models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './components/AppComponent'
import { listBills } from './repositories/billsRepository'

listBills().then(bills => ReactDOM.render(
  <div>
    <AppComponent bills={bills} />
  </div>,
  document.getElementById('app')
))

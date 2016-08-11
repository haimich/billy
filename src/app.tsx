import Bill from './models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import TableView from './views/TableView'
import { listBills } from './repositories/billsRepository'

listBills().then(bills => ReactDOM.render(
  <TableView bills={bills} />,
  document.getElementById('table-container')
))

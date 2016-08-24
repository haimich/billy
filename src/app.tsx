import Bill from './models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import TableComponent from './components/TableComponent'
import EditorComponent from './components/EditorComponent'
import { listBills } from './repositories/billsRepository'

listBills().then(bills => ReactDOM.render(
  <div>
    <TableComponent bills={bills} />
    <EditorComponent />
  </div>,
  document.getElementById('app')
))

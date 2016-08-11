import Bill from './models/BillModel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import TableComponent from './components/TableComponent'
import EditorComponent from './components/EditorComponent'
import { listBills } from './repositories/billsRepository'

listBills().then(bills => ReactDOM.render(
  <TableComponent bills={bills} />,
  document.getElementById('table-container')
))

ReactDOM.render(
  <EditorComponent />,
  document.getElementById('editor-container')
)

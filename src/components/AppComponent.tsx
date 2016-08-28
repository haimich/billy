import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { listBills } from '../repositories/billsRepository'
import Bill from '../models/BillModel'
import TableComponent from '../components/TableComponent'
import EditorComponent from '../components/EditorComponent'

export default class AppComponent extends React.Component<any, {}> {

  state: {
    bills: Bill[]
  }

  constructor(props) {
    super(props)
    
    this.state = {
      bills: props.bills // we convert props to state here to be able to load bills before render() is called
    }
  }

  render() {
    return (
      <div>
        <TableComponent bills={this.state.bills} />
        <EditorComponent />
      </div>
    )
  }

}

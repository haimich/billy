import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BootstrapTable, TableHeaderColumn, CellEditClickMode } from 'react-bootstrap-table';
import Bill from '../models/BillModel';
import { dateFormatter, currencyFormatter } from '../helpers/formatters';

export default class TableComponent extends React.Component<any, {}> {

  getEditMode(): CellEditClickMode {
    return 'click'
  }

  onSaveCell(row: Bill, cellName: string, cellValue: Object) {
    this.props.update(row)
  }

  render() {

    return (
      <div id="table-container">
        <BootstrapTable 
          data={this.props.bills}
          striped={true}
          cellEdit={{
            mode: this.getEditMode(),
            blurToSave: true,
            afterSaveCell: this.onSaveCell.bind(this),
          }}
          hover={true}
          search={true}
          pagination={false}>

          <TableHeaderColumn isKey={true} dataField="id" width="140" dataSort={true}>Rechnungsnr.</TableHeaderColumn>
          <TableHeaderColumn dataField="customer" width="300" dataSort={true}>Kunde</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="90" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>Betrag</TableHeaderColumn>
          <TableHeaderColumn dataField="date_created" width="170" dataFormat={dateFormatter} dataSort={true}>Rechnungsdatum</TableHeaderColumn>
          <TableHeaderColumn dataField="date_paid" width="190" dataFormat={dateFormatter} dataSort={true}>Zahlung erhalten am</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="400" dataSort={true}>Kommentar</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  componentDidMount() {
    const lastRow:any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child');
    lastRow.scrollIntoView();
  }
}

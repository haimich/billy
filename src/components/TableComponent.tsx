import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Bill from '../models/BillModel';
import TableRowComponent from './TableRowComponent';

export default class TableComponent extends React.Component<any, {}> {

  render() {
    return (
      <table id="table-container" className="table table-striped">
        <thead>
          <tr>
            <th>Rechnungsnr.</th>
            <th>Kunde</th>
            <th>Betrag</th>
            <th>Rechnungsdatum</th>
            <th>Zahlung erhalten am</th>
            <th>Kommentar</th>
          </tr>
        </thead>
        <tbody>
          {this.props.bills.map(bill => <TableRowComponent key={bill.id} {...bill} />)}
        </tbody>
      </table>
    );
  }

  componentDidMount() {
    const lastRow:any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child');
    lastRow.scrollIntoView();
  }
}

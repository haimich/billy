import * as React from 'react';
import Bill from '../models/Bill';
import TableRowView from './TableRowView';

export default class TableView extends React.Component<any, {}> {

  render() {
    return (
      <table id="table" className="table table-striped">
        <thead>
          <tr>
            <th>Rechnungsnummer</th>
            <th>Kunde</th>
            <th>Betrag</th>
            <th>Rechnungsdatum</th>
            <th>Zahlung erhalten am</th>
          </tr>
        </thead>
        <tbody>
          {this.props.bills.map(bill => <TableRowView key={bill.id} {...bill} />)}
        </tbody>
      </table>
    );
  };
}

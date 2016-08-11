import * as React from 'react';
import Bill from '../models/BillModel';
import { formatDate } from '../helpers/dateHelper';

export default class TableComponent extends React.Component<Bill, {}> {

  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.customer}</td>
        <td>{this.props.amount}</td>
        <td>{formatDate(this.props.date_created)}</td>
        <td>{formatDate(this.props.date_paid)}</td>
      </tr>
    );
  }

}
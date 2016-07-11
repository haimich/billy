import * as moment from 'moment';
import Bill from './models/Bill';

let data = require('./data.json');

let table = document.getElementById('table');
table.querySelector('tbody').innerHTML = data.map(row).join('');

function row(bill: Bill): string {
  return `
    <tr>
      <td>${bill.id}</td>
      <td>${bill.customer}</td>
      <td>${bill.amount}</td>
      <td>${formatDate(bill.date_created)}</td>
      <td>${formatDate(bill.date_paid)}</td>
    </tr>
  `;
}

function formatDate(date) {
  return moment(date).format('DD.MM.YYYY');
}
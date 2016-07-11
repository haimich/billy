import * as moment from 'moment';

let data = require('./data.json');

let table = document.getElementById('table');
table.querySelector('tbody').innerHTML = data.map(row).join('');

function row(data) {
  return `
    <tr>
      <td>${data.id}</td>
      <td>${data.customer}</td>
      <td>${data.amount}</td>
      <td>${formatDate(data.date_created)}</td>
      <td>${formatDate(data.date_paid)}</td>
    </tr>
  `;
}

function formatDate(date) {
  return moment(date).format('DD.MM.YYYY');
}
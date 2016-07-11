import Bill from './models/Bill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TableView from './views/TableView';

let data = require('../data.json');

ReactDOM.render(
  <TableView bills={data} />,
  document.getElementById('table-container')
);

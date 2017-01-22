import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import { currencyFormatter, dayFormatter } from '../common/ui/formatters'
import t from '../common/helpers/i18n'

interface Props {
  data: any[];
}

export default class BillsTableComponent extends React.Component<Props, {}> {

  render() {
    const tableOptions: Options = {
      sortName: 'total',
      sortOrder: 'desc',
      noDataText: t('Keine Einträge'),
      sizePerPage: 5
    }

    return (
      <div id="table-container">
        <BootstrapTable
          data={this.props.data}
          striped={true}
          hover={true}
          options={tableOptions}
          pagination={true}>

          <TableHeaderColumn isKey={true} dataField="name" width="140" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="billCount" width="60" dataSort={true}>{t('Rechnungen')}</TableHeaderColumn>
          <TableHeaderColumn dataField="averageTimeToPay" width="60" dataFormat={dayFormatter} dataSort={true}>{t('Durchschn. Bezahldauer')}</TableHeaderColumn>
          <TableHeaderColumn dataField="total" width="100" dataFormat={currencyFormatter} dataAlign="right" dataSort={true}>{t('Umsatz')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )
  }
}

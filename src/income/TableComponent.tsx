import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, Options } from 'react-bootstrap-table'
import BillDbModel from '../common/models/BillDbModel'
import { dateFormatterView, currencyFormatter } from '../common/helpers/formatters'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
}

export default class TableComponent extends React.Component<Props, {}> {

  props: Props

  render() {
    const options: Options = {
      sortName: 'invoice_id',
      sortOrder: 'asc',
      noDataText: t('Keine Einträge')
    }

    return (
      <div id="table-container">
        <BootstrapTable
          data={this.props.bills}
          striped={true}
          hover={true}
          search={false}
          multiColumnSearch={false}
          columnFilter={false}
          insertRow={false}
          deleteRow={false}
          exportCSV={false}
          options={options}>

          <TableHeaderColumn isKey={true} dataField="invoice_id" width="140" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer_name" width="290" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="180" dataSort={true}>{t('Einnahmen als')}</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="95" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Bruttobetrag')}</TableHeaderColumn>
          <TableHeaderColumn dataField="" width="95" dataAlign="right" dataSort={true}>{t('Nettobetrag')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_paid" width="100" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, Options } from 'react-bootstrap-table'
import { dateFormatterView, currencyFormatter, numberFormatterView, formatTaxrate } from '../common/ui/formatters'
import { EnrichedBill } from './AppComponent'
import t from '../common/helpers/i18n'

interface Props {
  bills: EnrichedBill[]
}

export default class BillsTableComponent extends React.Component<Props, any> {

  constructor(props: Props) {
    super(props)
  }

  taxrateFormatter(value: number): string {
    return formatTaxrate(value, true)
  }

  render() {
    const options: Options = {
      sortName: 'invoice_id',
      sortOrder: 'asc',
      noDataText: t('Keine Einnahmen')
    }

    return (
      <div id="table-container" className="income">
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


          <TableHeaderColumn dataField="date_paid" width="100" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>
          <TableHeaderColumn isKey={true} dataField="invoice_id" width="120" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer_name" width="280" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="180" dataSort={true}>{t('Einnahmen als')}</TableHeaderColumn>
          <TableHeaderColumn dataField="preTaxAmount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Brutto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="netAmount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Netto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="vatAmount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('USt.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="110" dataAlign="right" dataFormat={this.taxrateFormatter} dataSort={true}>{t('Steuersatz')}</TableHeaderColumn>

        </BootstrapTable>

      </div>
    )

  }

}

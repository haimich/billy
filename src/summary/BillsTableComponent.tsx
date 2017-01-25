import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, Options } from 'react-bootstrap-table'
import BillDbModel from '../common/models/BillDbModel'
import { dateFormatterView, currencyFormatter, numberFormatterView } from '../common/ui/formatters'
import { getNetAmount } from '../common/helpers/math'
import t from '../common/helpers/i18n'

interface Props {
  bills: BillDbModel[]
}

interface State {
  enrichedBills: EnrichedBill[]
}

interface EnrichedBill extends BillDbModel {
  netAmount: string
}

export default class BillsTableComponent extends React.Component<Props, State> {

  props: Props
  state: State

  constructor(props: Props) {
    super(props)

    this.state = {
      enrichedBills: this.getEnrichedBills(props.bills)
    }
  }

  getEnrichedBills(bills: BillDbModel[]): EnrichedBill[] {
    let enriched = []

    for (let bill of bills) {
      let exp = Object.assign(bill, {
        netAmount: numberFormatterView(getNetAmount(19, bill.amount)), // TODO make taxrate dynamic!!
        taxrate: 19, //TODO make dynamic
        vatAmount: 123 //TODO
      })

      enriched.push(exp)
    }

    return enriched
  }

  render() {
    const options: Options = {
      sortName: 'invoice_id',
      sortOrder: 'asc',
      noDataText: t('Keine Einnahmen')
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

          <TableHeaderColumn dataField="date_paid" width="100" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>
          <TableHeaderColumn isKey={true} dataField="invoice_id" width="120" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer_name" width="280" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="180" dataSort={true}>{t('Einnahmen als')}</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Brutto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="netAmount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Netto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="vatAmount" width="85" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Mwst.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="110" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Steuersatz')}</TableHeaderColumn>

        </BootstrapTable>

      </div>
    )

  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      enrichedBills: this.getEnrichedBills(newProps.bills)
    })
  }

}

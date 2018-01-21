import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, Options } from 'react-bootstrap-table'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import { EnrichedExpense } from '../common/models/ExpenseDbModel'
import { dateFormatterView, currencyFormatter, percentageFormatter, formatTaxrate, numberFormatterView } from '../common/ui/formatters'
import { getNetAmount, getVatAmount, hasDecimals } from '../common/helpers/math'
import { getEnrichedExpenses } from '../common/helpers/item'
import t from '../common/helpers/i18n'

interface Props {
  expenses: ExpenseDbModel[]
}

interface State {
  enrichedExpenses: EnrichedExpense[]
}

export default class ExpensesTableComponent extends React.Component<Props, State> {
  
  props: Props
  state: State

  constructor(props: Props) {
    super(props)

    this.state = {
      enrichedExpenses: getEnrichedExpenses(props.expenses)
    }
  }

  render() {
    const options: Options = {
      sortName: 'date',
      sortOrder: 'asc',
      noDataText: t('Keine Ausgaben')
    }

    return (
      <div id="table-container" className="expenses">
        <BootstrapTable
          data={this.props.expenses}
          striped={true}
          hover={true}
          search={false}
          multiColumnSearch={false}
          columnFilter={false}
          insertRow={false}
          deleteRow={false}
          exportCSV={false}
          options={options}>

          <TableHeaderColumn isKey={true} hidden={true} dataField="id" dataSort={true}>{t('ID')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date" width="10%" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="20%" dataSort={true}>{t('Typ')}</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="38%" dataSort={true}>{t('Kommentar')}</TableHeaderColumn>
          <TableHeaderColumn dataField="preTaxAmount" width="8%" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Brutto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="netAmount" width="8%" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Netto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="vatAmount" width="8%" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Mwst.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="8%" dataAlign="right" dataFormat={formatTaxrate} dataSort={true}>{t('Steuersatz')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      enrichedExpenses: getEnrichedExpenses(newProps.expenses)
    })
  }

}

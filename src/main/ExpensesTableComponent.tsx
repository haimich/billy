import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import { dateFormatterView, currencyFormatter, percentageFormatter, numberFormatterView } from '../common/ui/formatters'
import { preventDragAndDrop } from '../common/ui/dom'
import t from '../common/helpers/i18n'
import { getNetAmount, getVatAmount, hasDecimals } from '../common/helpers/math'

interface Props {
  delete: (rowIds: String[]) => void;
  select: (isSelected: boolean, row?: ExpenseDbModel) => void;
  expenses: ExpenseDbModel[];
  selectedId?: number;
}

interface State {
  enrichedExpenses: EnrichedExpense[]
}

interface EnrichedExpense extends ExpenseDbModel {
  netAmount: string
  vatAmount: string
}

export default class ExpensesTableComponent extends React.Component<Props, State> {

  props: Props
  state: State

  constructor(props: Props) {
    super(props)

    this.state = {
      enrichedExpenses: this.getEnrichedExpenses(props.expenses)
    }
  }

  getEnrichedExpenses(expenses: ExpenseDbModel[]): EnrichedExpense[] {
    let enriched = []

    for (let expense of expenses) {
      let exp = Object.assign(expense, {
        netAmount: numberFormatterView(getNetAmount(expense.taxrate, expense.preTaxAmount)),
        vatAmount: numberFormatterView(getVatAmount(expense.taxrate, expense.preTaxAmount))
      })

      enriched.push(exp)
    }

    return enriched
  }

  onSelectRow(row: any, isSelected: boolean, event: any): boolean {
    this.props.select(isSelected, row)
    return true
  }

  onDeleteRows(rowKeys: string[]) {
    this.props.delete(rowKeys)
  }

  handleConfirm(next: any, dropRowKeys: string[]) {
    if (confirm(`Möchtest du die ${t('Ausgabe', { count: dropRowKeys.length })} wirklich löschen?`)) {
      next()
    }
  }

  handleAdd(event) {
    this.props.select(false, undefined)
  }

  formatTaxrate(value: number): string {
    let tax = hasDecimals(value)
      ? numberFormatterView(value)
      : numberFormatterView(value, 0)

    return tax + ' %'
  }

  render() {
    const options: Options = {
      sortName: 'date',
      sortOrder: 'asc',
      afterDeleteRow: this.onDeleteRows.bind(this),
      deleteText: t('Löschen'),
      noDataText: t('Keine Einträge'),
      insertText: t('Neu'),
      clearSearch: true,
      handleConfirmDeleteRow: this.handleConfirm.bind(this)
    }
    const selectRowProp: any = {
      mode: 'radio',
      clickToSelect: true,
      bgColor: '#d9edf7',
      onSelect: this.onSelectRow.bind(this),
      selected: this.props.selectedId ? [this.props.selectedId] : [],
      hideSelectColumn: true
    }
    const editMode: CellEditClickMode = 'click'

    return (
      <div id="table-container">
        <BootstrapTable
          data={this.state.enrichedExpenses}
          striped={true}
          hover={true}
          search={true}
          searchPlaceholder={t('Suchen')}
          multiColumnSearch={false}
          columnFilter={false}
          insertRow={true}
          deleteRow={true}
          selectRow={selectRowProp}
          exportCSV={false}
          options={options}
          height="340 px">

          <TableHeaderColumn isKey={true} hidden={true} dataField="id" width="140" dataSort={true}>{t('ID')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="150" dataSort={true}>{t('Typ')}</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="350" dataSort={true}>{t('Kommentar')}</TableHeaderColumn>
          <TableHeaderColumn dataField="preTaxAmount" width="80" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Brutto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="netAmount" width="80" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Netto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="vatAmount" width="80" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Mwst.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="80" dataAlign="right" dataFormat={this.formatTaxrate.bind(this)} dataSort={true}>{t('Steuersatz')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date" width="130" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  scrollDown() {
    if (this.state.enrichedExpenses.length >= 1) {
      const lastRow: any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child')
      lastRow.scrollIntoView()
    }
  }

  componentDidMount() {
    preventDragAndDrop(ReactDOM.findDOMNode(this))
    this.scrollDown()

    document.querySelector(`.react-bs-table-search-form button`).innerHTML = t('Leeren')
    document.querySelector(`.react-bs-table-add-btn`).addEventListener('click', this.handleAdd.bind(this))
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      enrichedExpenses: this.getEnrichedExpenses(newProps.expenses)
    })
  }

}

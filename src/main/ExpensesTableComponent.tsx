import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import { dateFormatterView, currencyFormatter, percentageFormatter } from '../common/helpers/formatters'
import { preventDragAndDrop } from '../common/helpers/dom' 
import t from '../common/helpers/i18n'

interface Props {
  // delete: (rowIds: String[]) => void;
  select: (isSelected: boolean, row?: ExpenseDbModel) => void;
  expenses: any[]; //ExpenseDbModel
  selectedId?: number;
}

export default class ExpensesTableComponent extends React.Component<Props, {}> {

  props: Props

  onSelectRow(row: any, isSelected: boolean, event: any): boolean {
    this.props.select(isSelected, row)
    return true
  }

  onDeleteRows(rowKeys: string[]) {
    // this.props.delete(rowKeys)
  }

  handleConfirm(next: any, dropRowKeys: string[]) {
    if (confirm(`Möchtest du die ${t('Ausgabe', { count: dropRowKeys.length })} wirklich löschen?`)) {
      next()
    }
  }

  handleAdd(event) {
    // this.props.select(false, undefined)
  }

  render() {
    const options: Options = {
      sortName: 'id',
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
          data={this.props.expenses}
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
          <TableHeaderColumn dataField="type" width="290" dataSort={true}>{t('Typ')}</TableHeaderColumn>
          <TableHeaderColumn dataField="preTaxAmount" width="90" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Brutto')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="90" dataAlign="right" dataFormat={percentageFormatter} dataSort={true}>{t('Steuersatz')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date" width="170" dataFormat={dateFormatterView} dataSort={true}>{t('Datum')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  scrollDown() {
    // if (this.props.expenses.length >= 1) {
    //   const lastRow: any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child')
    //   lastRow.scrollIntoView()
    // }
  }

  componentDidMount() {
    preventDragAndDrop(ReactDOM.findDOMNode(this))
    this.scrollDown()

    document.querySelector(`.react-bs-table-search-form button`).innerHTML = t('Leeren')
    document.querySelector(`.react-bs-table-add-btn`).addEventListener('click', this.handleAdd.bind(this))
  }

}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import BillDbModel from '../common/models/BillDbModel'
import { dateFormatterView, currencyFormatter } from '../common/helpers/formatters'
import { preventDragAndDrop } from '../common/helpers/dom' 
import t from '../common/helpers/i18n'

interface Props {
  delete: (rowIds: String[]) => void;
  select: (isSelected: boolean, row?: BillDbModel) => void;
  bills: BillDbModel[];
  selectedInvoiceId?: string;
}

export default class BillsTableComponent extends React.Component<Props, {}> {

  props: Props

  onSelectRow(row: any, isSelected: boolean, event: any): boolean {
    this.props.select(isSelected, row)
    return true
  }

  onDeleteRows(rowKeys: string[]) {
    this.props.delete(rowKeys)
  }

  handleConfirm(next: any, dropRowKeys: string[]) {
    if (confirm(`Möchtest du die ${t('Rechnung', { count: dropRowKeys.length })} wirklich löschen?`)) {
      next()
    }
  }

  handleAdd(event) {
    this.props.select(false, undefined)
  }

  render() {
    const options: Options = {
      sortName: 'invoice_id',
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
      selected: this.props.selectedInvoiceId ? [this.props.selectedInvoiceId] : [],
      hideSelectColumn: true
    }
    const editMode: CellEditClickMode = 'click'

    return (
      <div id="table-container">
        <BootstrapTable
          data={this.props.bills}
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

          <TableHeaderColumn isKey={true} dataField="invoice_id" width="140" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer_name" width="290" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="90" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Betrag')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_created" width="170" dataFormat={dateFormatterView} dataSort={true}>{t('Rechnungsdatum')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_paid" width="160" dataFormat={dateFormatterView} dataSort={true}>{t('Zahlungsdatum')}</TableHeaderColumn>
          <TableHeaderColumn dataField="type_name" width="180" dataSort={true}>{t('Typ')}</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="400" dataSort={true}>{t('Kommentar')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  scrollDown() {
    // if (this.props.bills.length >= 1) {
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

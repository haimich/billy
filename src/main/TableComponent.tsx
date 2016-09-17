import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import BillDbModel from '../common/models/BillDbModel'
import { dateFormatter, currencyFormatter } from '../common/helpers/formatters'
import t from '../common/helpers/i18n'

export default class TableComponent extends React.Component<any, {}> {

  props: {
    delete: (rowIds: String[]) => void,
    select: (row: BillDbModel) => void,
    bills: BillDbModel[],
    selectedId?: string
  }

  onSelectRow(row: any, isSelected: boolean, event: any): boolean {
    if (isSelected) {
      this.props.select(row)
    }
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

  render() {
    const options: Options = {
      sortName: 'date_created',
      sortOrder: 'asc',
      afterDeleteRow: this.onDeleteRows.bind(this),
      deleteText: t('Löschen'),
      noDataText: t('Keine Einträge'),
      handleConfirmDeleteRow: this.handleConfirm.bind(this)
    }
    const selectRowProp: any = {
      mode: 'radio',
      clickToSelect: true,
      bgColor: '#d9edf7',
      onSelect: this.onSelectRow.bind(this),
      hideSelectColumn: true,
      selected: this.props.selectedId ? [this.props.selectedId] : []
    }
    const editMode: CellEditClickMode = 'click'
    const height: any = 300

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
          insertRow={false}
          deleteRow={true}
          selectRow={selectRowProp}
          exportCSV={false}
          options={options}
          height={height}>

          <TableHeaderColumn isKey={true} dataField="id" width="140" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer_name" width="300" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="90" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Betrag')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_created" width="170" dataFormat={dateFormatter} dataSort={true}>{t('Rechnungsdatum')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_paid" width="190" dataFormat={dateFormatter} dataSort={true}>{t('Zahlung erhalten am')}</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="400" dataSort={true}>{t('Kommentar')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  scrollDown() {
    const lastRow: any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child')
    lastRow.scrollIntoView()
  }

  // componentDidUpdate() {
  //   this.scrollDown()
  // }

  componentDidMount() {
    this.scrollDown()
  }
}

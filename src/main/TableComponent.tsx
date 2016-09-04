import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import Bill from '../common/models/BillModel'
import { dateFormatter, currencyFormatter } from '../common/helpers/formatters'
import t from '../common/helpers/i18n'

export default class TableComponent extends React.Component<any, {}> {

  props: {
    update: (row: Bill) => void,
    delete: (rowIds: String[]) => void,
    bills: Bill[]
  }

  onSelectRow(row: any, isSelected: boolean, event: any): boolean {
    console.log(row)
    return true
  }

  render() {
    const options: Options = {
      noDataText: t('Keine Einträge'),
      sortName: 'date_created',
      sortOrder: 'asc'
    }
    const selectMode: SelectRowMode = 'radio'
    const selectRowProp = {
      mode: selectMode,
      clickToSelect: true,
      bgColor: '#d9edf7',
      onSelect: this.onSelectRow,
      hideSelectColumn: true
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
          deleteRow={false}
          selectRow={selectRowProp}
          exportCSV={false}
          options={options}
          height={height}>

          <TableHeaderColumn isKey={true} dataField="id" width="140" dataSort={true}>{t('Rechnungsnr.')}</TableHeaderColumn>
          <TableHeaderColumn dataField="customer" width="300" dataSort={true}>{t('Kunde')}</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" width="90" dataAlign="right" dataFormat={currencyFormatter} dataSort={true}>{t('Betrag')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_created" width="170" dataFormat={dateFormatter} dataSort={true}>{t('Rechnungsdatum')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_paid" width="190" dataFormat={dateFormatter} dataSort={true}>{t('Zahlung erhalten am')}</TableHeaderColumn>
          <TableHeaderColumn dataField="comment" width="400" dataSort={true}>{t('Kommentar')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

  scrollDown() {
    const lastRow:any = ReactDOM.findDOMNode(this).querySelector('tbody tr:last-child')
    lastRow.scrollIntoView()
  }

  // componentDidUpdate() {
  //   this.scrollDown()
  // }

  componentDidMount() {
    this.scrollDown()
  }
}

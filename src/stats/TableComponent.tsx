import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import { currencyFormatter } from '../common/helpers/formatters'
import t from '../common/helpers/i18n'

interface Props {
  data: any[];
}

export default class TableComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  dayFormatter(cell, row): string {
    if (cell == null || cell === 0) {
      return ''
    }

    return cell + ' ' + (cell === 1 ? t('Tag') : t('Tage'))
  }

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
          <TableHeaderColumn dataField="averageTimeToPay" width="60" dataFormat={this.dayFormatter.bind(this)} dataSort={true}>{t('Durchschn. Bezahldauer')}</TableHeaderColumn>
          <TableHeaderColumn dataField="total" width="100" dataFormat={currencyFormatter} dataAlign="right" dataSort={true}>{t('Umsatz')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )
  }
}

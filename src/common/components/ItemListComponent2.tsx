import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BootstrapTable, TableHeaderColumn, CellEditClickMode, SelectRowMode, Options } from 'react-bootstrap-table'
import ItemModel from '../models/ItemModel'
import { numberFormatterView } from '../ui/formatters'
import t from '../helpers/i18n'

interface Props {
  items: ItemModel[]
  handleItemChange: (item: ItemModel) => void
}

export default class ItemListComponent2 extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  handleAdd(event) {
    console.log('add');
  }

  onAfterSaveCell(row, cellName, cellValue) {
    this.props.handleItemChange(row)
  }

  render() {
    const options: Options = {
      // TODO make sorting work
      // sortName: 'position',
      // sortOrder: 'asc',
      noDataText: t('Keine Einträge'),
    }
    const editMode: CellEditClickMode = 'click'
    const cellEditProp = {
      mode: editMode,
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell.bind(this)
    }

    return (
      <div id="table-container">
        <BootstrapTable
          data={this.props.items}
          cellEdit={cellEditProp}
          striped={true}
          hover={true}
          columnFilter={false}
          options={options}>

          <TableHeaderColumn isKey={true} hidden={true} dataField="id" width="140" dataSort={false}>{t('Id')}</TableHeaderColumn>
          <TableHeaderColumn dataField="description" width="200" dataSort={false}>{t('Beschreibung')}</TableHeaderColumn>
          <TableHeaderColumn dataField="taxrate" width="95" dataSort={false}>{t('Steuersatz (%)')}</TableHeaderColumn>
          <TableHeaderColumn dataField="preTaxAmount" width="140" dataSort={false}>{t('Betrag (€)')}</TableHeaderColumn>

        </BootstrapTable>
      </div>
    )

  }

}

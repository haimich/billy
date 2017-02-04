import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ItemModel from '../models/ItemModel'
import t from '../helpers/i18n'

interface Props {
  items: ItemModel[]
  addItem: (item: ItemModel) => void
}

export default class ItemListComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  getTableRows() {
    let rows = []

    for (let item of this.props.items) {
      rows.push((
        <tr key={item.id}>
          <td>
            <input
              type="text"
              className="form-control input-sm"
              id="id"
              value={item.description}
            />
          </td>
          <td style={{width: '95px'}}>
            <div className="input-group">
              <span className="input-group-addon">%</span>
              <input
                type="text"
                className="form-control input-sm"
                style={{ textAlign: 'right' }}
                id="id"
                value={item.taxrate}
              />
            </div>
          </td>
          <td style={{width: '160px'}}>
            <div className="input-group">
              <span className="input-group-addon">€</span>
              <input
                type="text"
                className="form-control input-sm"
                style={{ textAlign: 'right' }}
                id="id"
                value={item.preTaxAmount}
              />
            </div>
          </td>
        </tr>
      ))
    }

    return rows
  }

  handleAddItem() {

  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t('Beschreibung')}</th>
                  <th>{t('Steuersatz')}</th>
                  <th>{t('Betrag (€)')}</th>
                </tr>
              </thead>
              <tbody>
                {this.getTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <button type="button" className="btn btn-success btn-sm" onClick={this.handleAddItem.bind(this)}>
              <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
              {t('Position hinzufügen')}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

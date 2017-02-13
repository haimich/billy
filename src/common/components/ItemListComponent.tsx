import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ItemModel from '../models/ItemModel'
import t from '../helpers/i18n'

interface Props {
  items: ItemModel[]
  handleItemValueChange: (itemId: number, fieldName: string, newValue: string) => void
  addItem: () => void
}

export default class ItemListComponent extends React.Component<Props, {}> {

  state: {
    items: ItemModel[]
  }

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
              onChange={(event: any) => this.props.handleItemValueChange(item.id, 'description', event.target.value)}
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
                pattern={'[+-]?[0-9]+(,[0-9]+)?'}
                onChange={(event: any) => this.props.handleItemValueChange(item.id, 'taxrate', event.target.value)}
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
                pattern={'[+-]?[0-9]+(,[0-9]+)?'}
                onChange={(event: any) => this.props.handleItemValueChange(item.id, 'preTaxAmount', event.target.value)}
              />
            </div>
          </td>
        </tr>
      ))
    }

    return rows
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">{t('Beschreibung')}</th>
                  <th className="text-center">{t('Steuersatz')}</th>
                  <th className="text-center">{t('Betrag (€)')}</th>
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
            <button type="button" className="btn btn-success btn-sm" onClick={this.props.addItem}>
              <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
              {t('Position hinzufügen')}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

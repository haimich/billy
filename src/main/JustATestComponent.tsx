import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ItemListComponent from '../common/components/ItemListComponent'
import ItemModel from '../common/models/ItemModel'
import t from '../common/helpers/i18n'
import { numberFormatterView, numberFormatterDb } from '../common/ui/formatters'
import { hasDecimals } from '../common/helpers/math'

interface Props {
}

interface State {
  description?: string
  taxrate: number
  preTaxAmount: number
  position: number
}

export default class JustATestComponent extends React.Component<Props, {}> {

  state: {
    items
  }

  constructor(props) {
    super(props)

    this.state = {
      items: [{
        id: 123,
        bill_id: 1,
        position: 0,
        preTaxAmount: numberFormatterView(123.45),
        taxrate: this.formatTaxrate(19),
        description: 'Tanzschule'
      }, {
        id: 234,
        bill_id: 1,
        position: 1,
        preTaxAmount: numberFormatterView(456),
        taxrate: this.formatTaxrate(10),
        description: 'Waschanlage'
      }]
    }
  }

  formatTaxrate(taxrate) {
    return hasDecimals(taxrate)
      ? numberFormatterView(taxrate)
      : numberFormatterView(taxrate, 0)
  }

  handleItemValueChange(billItemId: number, fieldName: string, newValue: string) {
    this.setState({
      items: this.state.items.map(item => {
        if (item.id === billItemId) {
          item[fieldName] = newValue
        }
        
        return item
      })
    })
  }

  addItem() {
    this.setState({
      items: this.state.items.concat([ {} ])
    })
  }

  render() {
    return (
      <div id="editor-container">
        <form className="form-horizontal container">
          <div className="row">
            <div className="col-md-6"></div>

            <div className="col-md-6">
              <ItemListComponent
                items={this.state.items}
                addItem={this.addItem.bind(this)}
                handleItemValueChange={this.handleItemValueChange.bind(this)}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

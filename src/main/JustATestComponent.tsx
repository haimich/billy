import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ItemListComponent from '../common/components/ItemListComponent'
import { amountType } from '../common/components/PreTaxNetAmountComponent'
import t from '../common/helpers/i18n'
import { numberFormatterView, numberFormatterDb } from '../common/ui/formatters'
import { hasDecimals } from '../common/helpers/math'

interface Props {
}

interface State {
  amount: string
  amountType: amountType
  taxrate?: string
}

export default class JustATestComponent extends React.Component<Props, {}> {

  state: State

  constructor(props) {
    super(props)

    this.state = {
      amount: numberFormatterView(123.45),
      amountType: 'preTax',
      taxrate: this.formatTaxrate(19)
    }
  }

  formatTaxrate(taxrate) {
    return hasDecimals(taxrate)
      ? numberFormatterView(taxrate)
      : numberFormatterView(taxrate, 0)
  }

  render() {
    return (
      <div id="editor-container">
        <form className="form-horizontal container">
          <div className="row">
            <div className="col-md-4"></div>

            <div className="col-md-8">
              <ItemListComponent
                amount={this.state.amount}
                amountType={this.state.amountType}
                taxrate={this.state.taxrate}
                handleAmountChange={(newValue) => this.setState({ amount: newValue })}
                handleAmountTypeChange={(newValue) => this.setState({ amountType: newValue })}
                handleTaxrateChange={(newValue) => this.setState({ taxrate: newValue })}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

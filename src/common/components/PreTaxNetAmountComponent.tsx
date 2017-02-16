import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Toggle from 'react-bootstrap-toggle'
import t from '../helpers/i18n'

export type amountType = 'preTax' | 'net'

interface Props {
  amount?: string
  amountType?: amountType
  handleAmountTypeChange: (newType: amountType) => void
  handleAmountChange: (newAmount: string) => void
}

export default class PreTaxNetAmountComponent extends React.Component<Props, {}> {

  refs: {
    amount: any
  }

  handleAmountTypeChange() {
    let newType

    if (this.props.amountType === 'preTax') {
      newType = 'net'
    } else {
      newType = 'preTax'
    }

    this.props.handleAmountTypeChange(newType)
    this.refs.amount.focus()
  }

  isAmountTypeActive() {
    return this.props.amountType === 'preTax'
  }

  render() {
    return (
      <div className="amount-inputgroup">
        <span className="toggle-button">
          <Toggle
            onClick={this.handleAmountTypeChange.bind(this)}
            on={t('Brutto')}
            off={t('Netto')}
            size="sm"
            offstyle="success"
            active={this.isAmountTypeActive()}
          />
        </span>

        <div className="col-sm-8">
          <div className="input-group">
            <span className="input-group-addon">€</span>
            <input
              type="text"
              className="form-control input-sm"
              ref="amount"
              id="amount"
              value={this.props.amount}
              onChange={(event: any) => this.props.handleAmountChange(event.target.value)}
              style={{ textAlign: 'right' }}
              required
              pattern={'[+-]?[0-9]+(,[0-9]+)?'}
            />
          </div>
        </div>
      </div>
    )
  }

}

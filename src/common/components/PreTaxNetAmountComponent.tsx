import * as React from 'react'
import * as ReactDOM from 'react-dom'
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

  handleAmountButtonChange(newType: amountType) {
    this.props.handleAmountTypeChange(newType)
    this.refs.amount.focus()
  }

  render() {
    let classesPreTaxAmountBtn = 'btn btn-default'
    let classesNetAmountBtn = 'btn btn-default'

    if (this.props.amountType === 'preTax') {
      classesPreTaxAmountBtn += ' active'
    } else if (this.props.amountType === 'net') {
      classesNetAmountBtn += ' active'
    }

    return (
      <div className="form-group">
        <div className="btn-group toggle-button col-sm-4" role="group">
          <button
            type="button"
            htmlFor="amount"
            className={classesPreTaxAmountBtn}
            onClick={() => this.handleAmountButtonChange('preTax')}>
            {t('Brutto')}
          </button>
          <button
            type="button"
            htmlFor="amount"
            className={classesNetAmountBtn}
            onClick={() => this.handleAmountButtonChange('net')}>
            {t('Netto')}
          </button>
        </div>

        <div className="col-sm-8">
          <div className="input-group">
            <span className="input-group-addon">€</span>
            <input
              type="text"
              className="form-control"
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

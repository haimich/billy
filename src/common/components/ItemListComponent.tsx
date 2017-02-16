import * as React from 'react'
import * as ReactDOM from 'react-dom'
import PreTaxNetAmountComponent from '../components/PreTaxNetAmountComponent'
import { amountType } from '../components/PreTaxNetAmountComponent'
import { getCalculatedAmount, getVatAmount } from '../ui/preNetVat' //, getPreTaxAmount, 
import t from '../helpers/i18n'

interface Props {
  amount: string
  amountType: amountType
  taxrate?: string
  handleAmountChange: (newValue: string) => void
  handleAmountTypeChange: (newValue: string) => void
  handleTaxrateChange: (newValue: string) => void
}

export default class ItemListComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  getCalculatedHeading(): string {
    if (this.props.amountType === 'preTax') {
      return t('Netto')
    } else if (this.props.amountType === 'net') {
      return t('Brutto')
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">{t('Betrag')}</th>
                <th className="text-center">{t('Steuersatz')}</th>
                <th className="text-center">{this.getCalculatedHeading()}</th>
                <th className="text-center">{t('Umsatzsteuer')}</th>
              </tr>
            </thead>
            <tbody>       
              <tr key={0}>
                <td style={{width: '230px'}}>
                  <PreTaxNetAmountComponent
                    amount={this.props.amount}
                    amountType={this.props.amountType}
                    handleAmountTypeChange={amountType => this.props.handleAmountTypeChange(amountType)}
                    handleAmountChange={amount => this.props.handleAmountChange(amount)}
                  />
                </td>
                <td style={{width: '95px'}}>
                  <div className="input-group">
                    <span className="input-group-addon">%</span>
                    <input
                      type="text"
                      className="form-control input-sm"
                      style={{ textAlign: 'right' }}
                      id="taxrate"
                      value={this.props.taxrate}
                      pattern={'[+-]?[0-9]+(,[0-9]+)?'}
                      onChange={(event: any) => this.props.handleTaxrateChange(event.target.value)}
                    />
                  </div>
                </td>
                <td style={{width: '130px'}}>
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input
                      type="text"
                      className="form-control input-sm"
                      style={{ textAlign: 'right' }}
                      id="calculatedAmount"
                      value={getCalculatedAmount(this.props.amount, this.props.taxrate, this.props.amountType)}
                      readOnly
                    />
                  </div>
                </td>
                <td style={{width: '130px'}}>
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input
                      type="text"
                      className="form-control input-sm"
                      style={{ textAlign: 'right' }}
                      id="calculatedVaxAmount"
                      value={getVatAmount(this.props.amount, this.props.taxrate, this.props.amountType)}
                      readOnly
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

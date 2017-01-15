import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import Expense from '../common/models/ExpenseModel'
import { expenseExists } from '../common/services/expensesService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb } from '../common/helpers/formatters'
import { stringIsEmpty } from '../common/helpers/text'
import { round, getNetAmount, getTaxrate, getVatAmount, getPreTaxAmount } from '../common/helpers/math'

const Datetime = require('react-datetime')

interface State {
  id?: number
  type: string
  amount?: string
  amountType?: 'preTax' | 'net'
  taxrate?: string
  date?: string
  isNew: boolean
  isDirty: boolean
}

interface Props {
  update: (model: Expense) => void
  save: (model: Expense) => void
  expense?: ExpenseDbModel
  notify: any
}

export default class ExpensesEditorComponent extends React.Component<Props, {}> {

  state: State
  refs: {
    type
    date
    amount
  }

  constructor(props) {
    super(props)

    this.state = this.getDefaultState()
  }

  resetState() {
    this.setState(this.getDefaultState())
    process.nextTick(() => this.refs.type.focus())
    this.resetFormValidationErrors()
  }

  getDefaultState(): State {
    return {
      id: undefined,
      type: '',
      amount: '',
      amountType: 'preTax',
      taxrate: '19',
      date: undefined,
      isNew: true,
      isDirty: false
    }
  }

  async onSave(event) {
    event.preventDefault()

    const expense: Expense = {
      id: this.state.id,
      type: this.state.type,
      preTaxAmount: numberFormatterDb(
        this.state.amountType === 'preTax'
        ? this.state.amount
        : this.getPreTaxAmount()),
      taxrate: numberFormatterDb(this.state.taxrate),
      date: dateFormatterDb(this.state.date)
    }

    try {
      if (this.state.isNew) {
        await this.props.save(expense)
      } else {
        await this.props.update(expense)
      }
    } catch (err) {
      return // don't reset state on error
    }

    this.resetState()
  }

  handleDateChange(newDate: Date) {
    this.setState({ date: newDate })
    this.revalidate(ReactDOM.findDOMNode(this.refs.date).querySelector('input'))
  }

  getNetAmount(): string {
    if (this.state.amount === '' || this.state.taxrate === '') {
      return ''
    }

    let net = getNetAmount(numberFormatterDb(this.state.taxrate), numberFormatterDb(this.state.amount))
    return numberFormatterView(net)
  }

  getPreTaxAmount(): string {
    if (this.state.amount === '' || this.state.taxrate === '') {
      return ''
    }

    let preTax = getPreTaxAmount(numberFormatterDb(this.state.taxrate), numberFormatterDb(this.state.amount))
    return numberFormatterView(preTax)
  }

  getVatAmount(): string {
    if (this.state.amount === '' || this.state.taxrate === '') {
      return ''
    }

    let vat = getVatAmount(numberFormatterDb(this.state.taxrate), numberFormatterDb(this.state.amount))
    return numberFormatterView(vat)
  }

  getCalculatedAmount(): string {
    if (this.state.amountType == null) {
      return ''
    } else if (this.state.amountType === 'preTax') {
      return this.getNetAmount()
    } else if (this.state.amountType === 'net') {
      return this.getPreTaxAmount()
    }
  }

  isAmountButtonSelected(type: string): boolean {
    return this.state.amountType === type
  }

  handleAmountButtonChange(newType: string) {
    this.setState({
      amountType: newType
    })
    this.refs.amount.focus()
  }

  render() {
    let classesPreTaxAmountBtn = 'btn btn-default'
    let classesNetAmountBtn = 'btn btn-default'
    let calculatedInputLabel = ''

    if (this.state.amountType === 'preTax') {
      calculatedInputLabel = t('Netto')
      classesPreTaxAmountBtn += ' active'
    } else if (this.state.amountType === 'net') {
      calculatedInputLabel = t('Brutto')
      classesNetAmountBtn += ' active'
    }

    return (
      <div id="editor-container">
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="type" className="col-sm-4 control-label">{t('Typ der Ausgabe')}</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    ref="type"
                    required
                    value={this.state.type}
                    onChange={(event: any) => this.setState({ type: event.target.value })}
                    autoFocus
                    />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="date" className="col-sm-4 control-label">{t('Datum')}</label>
                <Datetime
                  ref="date"
                  value={this.state.date}
                  inputProps={{
                    id: 'date',
                    required: 'required'
                  }}
                  dateFormat={'DD.MM.YYYY'}
                  closeOnSelect={true}
                  timeFormat={false}
                  className={'col-sm-8'}
                  onChange={this.handleDateChange.bind(this)}
                  />
              </div>
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
                      value={this.state.amount}
                      onChange={(event: any) => this.setState({ amount: event.target.value })}
                      style={{ textAlign: 'right' }}
                      required
                      pattern={'[+-]?[0-9]+(,[0-9]+)?'}
                      />
                  </div>
                </div>
              </div>
              <div className="form-group">
                  <label htmlFor="taxrate" className="col-sm-4 control-label">{t('Steuersatz')}</label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-addon">%</span>
                      <input
                        type="text"
                        className="form-control"
                        id="taxrate"
                        value={this.state.taxrate}
                        onChange={(event: any) => this.setState({ taxrate: event.target.value })}
                        style={{ textAlign: 'right' }}
                        pattern={'[+-]?[0-9]+(,[0-9]?)?'}
                        />
                    </div>
                  </div>
                </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="calculatedAmount" className="col-sm-4 control-label">{calculatedInputLabel}</label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-addon">€</span>
                      <input
                        type="text"
                        className="form-control"
                        id="calculatedAmount"
                        value={this.getCalculatedAmount()}
                        style={{ textAlign: 'right' }}
                        readOnly
                        />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="vatAmount" className="col-sm-4 control-label">{t('Mehrwertsteuer')}</label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-addon">€</span>
                      <input
                        type="text"
                        className="form-control"
                        id="vatAmount"
                        value={this.getVatAmount()}
                        style={{ textAlign: 'right' }}
                        readOnly
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="pull-right">
                <button type="button" className="btn btn-secondary" onClick={this.resetState.bind(this)}>{t('Abbrechen')}</button> &nbsp;
                <button type="submit" className="btn btn-primary">{t('Speichern')}</button>
              </div>
            </div>
          </div>

          <p></p>
        </form>

        <div className="overlay"><span>{t('Datei ablegen')}</span></div>
      </div>
    )
  }

  addFormValidation() {
    for (let input of this.getInputs()) {
      input.addEventListener('input', event => this.revalidate(event.target))

      input.addEventListener('invalid', (event) => {
        const input: any = event.target;
        input.closest('.form-group').classList.add('has-error')
      })
    }
  }

  resetFormValidationErrors() {
    this.getInputs().forEach(input => input.closest('.form-group') !.classList.remove('has-error'))
  }

  getInputs() {
    return [...ReactDOM.findDOMNode(this).querySelectorAll('input,textarea')]
  }

  revalidate(input) {
    this.state.isDirty = true
    input.closest('.form-group').classList.remove('has-error')
    setTimeout(() => input.checkValidity())
  }
  
  enableTypeaheadFeatures(typeahead: any, name: string, required: boolean) {
    const typeaheadInput =
      ReactDOM.findDOMNode(typeahead.getInstance()).querySelector(`input[name=${name}]`)
    typeaheadInput.setAttribute('id', name)

    if (required) {
      typeaheadInput.setAttribute('required', 'true')
    }
  }

  componentDidMount() {
    this.addFormValidation()
  }

  componentWillReceiveProps(nextProps: Props) {
    const expense: ExpenseDbModel = nextProps.expense
    const isNew = (expense == null)

    if (this.state.isDirty && !confirm(t('Möchtest du die Änderungen verwerfen?'))) return

    this.resetFormValidationErrors()

    if (isNew) {
      this.resetState()
    } else {
      this.setState({
        id: expense.id,
        type: expense.type,
        preTaxAmount: numberFormatterView(expense.preTaxAmount),
        date: dateFormatterView(expense.date),
        taxrate: expense.taxrate,
        isNew,
        isDirty: false
      })
    }
  }
}

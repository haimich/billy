import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import Expense from '../common/models/ExpenseModel'
import { expenseExists } from '../common/services/expensesService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb } from '../common/helpers/formatters'
import { round } from '../common/helpers/math'

const Datetime = require('react-datetime')

interface State {
  id?: number
  type: string
  preTaxAmount?: string
  taxrate?: number
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
      preTaxAmount: '',
      taxrate: 19,
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
      preTaxAmount: numberFormatterDb(this.state.preTaxAmount),
      taxrate: this.state.taxrate,
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
    if (this.state.taxrate != null && this.state.preTaxAmount != null && this.state.preTaxAmount !== '') {
      let preTax = numberFormatterDb(this.state.preTaxAmount)
      let tax = this.state.taxrate / 100 + 1

      return numberFormatterView(round(preTax / tax))
    } else {
      return ''
    }
  }

  getVatAmount(): string {
    if (this.getNetAmount() == this.state.preTaxAmount) {
      return ''
    }

    return numberFormatterView(numberFormatterDb(this.state.preTaxAmount) - numberFormatterDb(this.getNetAmount()))
  }

  render() {
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
                <label htmlFor="preTaxamount" className="col-sm-4 control-label">{t('Brutto')}</label>
                <div className="col-sm-8">
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input
                      type="text"
                      className="form-control"
                      id="preTaxamount"
                      value={this.state.preTaxAmount}
                      onChange={(event: any) => this.setState({ preTaxAmount: event.target.value })}
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
                        type="number"
                        className="form-control"
                        id="taxrate"
                        value={this.state.taxrate}
                        onChange={(event: any) => this.setState({ taxrate: event.target.value })}
                        style={{ textAlign: 'right' }}
                        required
                        />
                    </div>
                  </div>
                </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="netAmount" className="col-sm-4 control-label">{t('Netto')}</label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-addon">€</span>
                      <input
                        type="text"
                        className="form-control"
                        id="netAmount"
                        value={this.getNetAmount()}
                        style={{ textAlign: 'right' }}
                        readOnly
                        />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="vat" className="col-sm-4 control-label">{t('Mehrwertsteuer')}</label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-addon">€</span>
                      <input
                        type="text"
                        className="form-control"
                        id="vat"
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

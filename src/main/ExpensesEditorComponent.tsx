import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import Expense from '../common/models/ExpenseModel'
import ExpenseType from '../common/models/ExpenseTypeModel'
import { expenseExists } from '../common/services/expensesService'
import { listExpenseTypes, getExpenseTypeById, createExpenseType } from '../common/services/expenseTypesService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb } from '../common/ui/formatters'
import { stringIsEmpty } from '../common/helpers/text'
import { getNetAmount, getVatAmount, getPreTaxAmount, hasDecimals } from '../common/helpers/math'
import { enableTypeaheadFeatures, getInputs, resetFormValidationErrors, addFormValidation, revalidateInput } from '../common/ui/forms'
import Textarea from 'react-textarea-autosize'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  id?: number
  selectedExpenseType?: ExpenseType[]
  amount?: string
  amountType?: 'preTax' | 'net'
  taxrate?: string
  date?: string
  comment?: string
  expenseTypeList: ExpenseType[]
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
    expenseTypeTypeahead
  }

  constructor(props) {
    super(props)

    this.state = this.getDefaultState()
    this.fetchTypeaheadData()
  }

  resetState() {
    this.setState(this.getDefaultState())
    this.refs.expenseTypeTypeahead.getInstance().clear()
    this.fetchTypeaheadData()
    resetFormValidationErrors(getInputs(this))
  }

  getDefaultState(): State {
    return {
      id: undefined,
      selectedExpenseType: undefined,
      amount: '',
      amountType: 'preTax',
      taxrate: '19',
      date: undefined,
      comment: '',
      expenseTypeList: [],
      isNew: true,
      isDirty: false
    }
  }

  async fetchTypeaheadData() {
    try {
      this.setState({
        expenseTypeList: await listExpenseTypes()
      })
    } catch (err) {
      this.props.notify(t('Typeahead-Daten konnten nicht geladen werden') + err, 'error')
    }
  }

  async onSave(event) {
    event.preventDefault()

    const expense: Expense = {
      id: this.state.id,
      type_id: (this.state.selectedExpenseType == null || this.state.selectedExpenseType[0] == null)
        ? undefined
        : this.state.selectedExpenseType[0].id,
      preTaxAmount: numberFormatterDb(
        this.state.amountType === 'preTax'
        ? this.state.amount
        : this.getPreTaxAmount()),
      taxrate: numberFormatterDb(this.state.taxrate),
      date: dateFormatterDb(this.state.date),
      comment: this.state.comment
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

    let vat

    if (this.state.amountType === 'preTax') {
      vat = getVatAmount(numberFormatterDb(this.state.taxrate), numberFormatterDb(this.state.amount))
    } else if (this.state.amountType === 'net') {
      vat = getVatAmount(numberFormatterDb(this.state.taxrate), numberFormatterDb(this.getPreTaxAmount()))
    }

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

  async handleExpenseTypeChange(selected: any) {
    if (selected == null || selected.length !== 1) {
      return
    }

    let selectedExpenseType = selected[0]
    let isNewExpenseType = false

    if (selectedExpenseType.customOption && (await getExpenseTypeById(selectedExpenseType.id) == null)) {
      isNewExpenseType = true
    }

    if (isNewExpenseType) {
      let expenseType

      try {
        expenseType = await createExpenseType({
          type: selectedExpenseType.type
        })
      } catch (err) {
        this.props.notify(t('Der Ausgabenstyp konnte nicht angelegt werden: ') + err, 'error')
      }

      this.setState({
        selectedExpenseType: [expenseType],
        expenseTypeList: [expenseType].concat(this.state.expenseTypeList)
      })
    } else {
      this.setState({ selectedExpenseType: selected })
    }

    this.revalidate(ReactDOM.findDOMNode(this.refs.expenseTypeTypeahead.getInstance()).querySelector('input[name=expenseType]'))
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
                  <Typeahead
                    options={this.state.expenseTypeList}
                    allowNew={true}
                    onChange={this.handleExpenseTypeChange.bind(this)}
                    onBlur={this.handleExpenseTypeChange.bind(this)}
                    selected={this.state.selectedExpenseType}
                    labelKey={'type'}
                    ref='expenseTypeTypeahead'
                    name="expenseType"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
                    paginationText={t('Mehr anzeigen')}
                    maxResults={20}
                    newSelectionPrefix={t('Typ anlegen: ')}
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
                        pattern={'[+-]?[0-9]+(,[0-9]+)?'}
                        required
                        />
                    </div>
                  </div>
                </div>
            </div>

            <div className="col-md-6">
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
              <div className="form-group">
                <label htmlFor="comment" className="col-sm-4 control-label">{t('Kommentar')}</label>
                <div className="col-sm-8">
                  <Textarea
                    className="form-control"
                    minRows={1}
                    maxRows={3}
                    id="comment"
                    value={this.state.comment}
                    onChange={(event: any) => this.setState({ comment: event.target.value })}
                  />
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

  revalidate(input) {
    this.state.isDirty = true // manipulate directly to prevent endless loop
    revalidateInput(input)
  }

  componentDidMount() {
    addFormValidation(getInputs(this), this.revalidate.bind(this))
    enableTypeaheadFeatures(this.refs.expenseTypeTypeahead, 'expenseType', true)
  }

  componentWillReceiveProps(nextProps: Props) {
    const expense: ExpenseDbModel = nextProps.expense
    const isNew = (expense == null)

    if (this.state.isDirty && !confirm(t('Möchtest du die Änderungen verwerfen?'))) return

    resetFormValidationErrors(getInputs(this))

    if (isNew) {
      this.resetState()
    } else {
      this.setState({
        id: expense.id,
        selectedExpenseType: [expense.type],
        amount: numberFormatterView(expense.preTaxAmount),
        amountType: 'preTax',
        date: dateFormatterView(expense.date),
        taxrate: hasDecimals(expense.taxrate)
          ? numberFormatterView(expense.taxrate)
          : numberFormatterView(expense.taxrate, 0),
        comment: expense.comment || '',
        isNew,
        isDirty: false
      })
    }
  }
}

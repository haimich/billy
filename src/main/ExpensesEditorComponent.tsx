import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ExpenseDbModel from '../common/models/ExpenseDbModel'
import Expense from '../common/models/ExpenseModel'
import ExpenseType from '../common/models/ExpenseTypeModel'
import ExpenseFileModel from '../common/models/ExpenseFileModel'
import FileActions from '../common/models/FileActions'
import FileViewComponent from '../common/components/FileViewComponent'
import FileUploadComponent from '../common/components/FileUploadComponent'
import PreTaxNetAmountComponent from '../common/components/PreTaxNetAmountComponent'
import { amountType } from '../common/components/PreTaxNetAmountComponent'
import { FileEndabledComponent } from '../common/components/FileEnabledComponent'
import { listExpenseTypes, getExpenseTypeById, createExpenseType } from '../common/services/expenseTypesService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb, formatTaxrate} from '../common/ui/formatters'
import { stringIsEmpty } from '../common/helpers/text'
import { hasDecimals } from '../common/helpers/math'
import { enableTypeaheadFeatures, getInputs, resetFormValidationErrors, addFormValidation, revalidateInput } from '../common/ui/forms'
import { getCalculatedAmount, getPreTaxAmount, getVatAmount } from '../common/ui/preNetVat'
import Textarea from 'react-textarea-autosize'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  id?: number
  selectedExpenseType?: ExpenseType[]
  amount?: string
  amountType?: amountType
  taxrate?: string
  date?: string
  comment?: string
  expenseTypeList: ExpenseType[]
  isNew: boolean
  isDirty: boolean
  fileActions: FileActions<ExpenseFileModel>
}

interface Props {
  update: (model: Expense, fileActions: FileActions<ExpenseFileModel>) => void
  save: (model: Expense, FileActions: FileActions<ExpenseFileModel>) => void
  expense?: ExpenseDbModel
  notify: any
}

export default class ExpensesEditorComponent extends FileEndabledComponent<Props, {}> {

  state: State
  refs: {
    type
    date
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
      isDirty: false,
      fileActions: { add: [], keep: [], delete: [] }
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
        : getPreTaxAmount(this.state.amount, this.state.taxrate)),
      taxrate: numberFormatterDb(this.state.taxrate),
      date: dateFormatterDb(this.state.date),
      comment: this.state.comment
    }

    try {
      if (this.state.isNew) {
        await this.props.save(expense, this.state.fileActions)
      } else {
        await this.props.update(expense, this.state.fileActions)
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
  
  getFileModels(files: File[]): ExpenseFileModel[] {
    let fileModels = []

    for (let file of files) {
      fileModels.push({
        expense_id: this.state.id,
        path: file.path
      })
    }

    return fileModels
  }
  
  getFilesForView(): ExpenseFileModel[] {
    return this.state.fileActions.keep.concat(this.state.fileActions.add)
  }

  handleAddFiles(files: ExpenseFileModel[]) {
    let newFileActions = this.addFiles(files, this.state.fileActions.keep, this.state.fileActions.delete, this.state.fileActions.add)

    this.setState({
      fileActions: newFileActions,
      isDirty: true
    })
  }

  handleDeleteFile(file: ExpenseFileModel) {
    let newFileActions = this.deleteFile(file, this.state.fileActions.keep, this.state.fileActions.delete, this.state.fileActions.add)

    if (newFileActions != null) {
      this.setState({
        fileActions: newFileActions,
        isDirty: true
      })
    }
  }

  render() {
    let calculatedInputLabel = ''

    if (this.state.amountType === 'preTax') {
      calculatedInputLabel = t('Netto')
    } else if (this.state.amountType === 'net') {
      calculatedInputLabel = t('Brutto')
    }

    return (
      <div id="editor-container" onDragOver={this.onDrag.bind(this)} onDragEnter={this.onEnter.bind(this)} onDragLeave={this.onLeave.bind(this)} onDrop={this.onDrop.bind(this)}>
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="col-md-6">

              <div className="form-group">
                <label htmlFor="type" className="col-sm-4 control-label">{t('Typ')}</label>
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

            <div className="col-md-6">

              <PreTaxNetAmountComponent
                amount={this.state.amount}
                amountType={this.state.amountType}
                handleAmountTypeChange={amountType => this.setState({ amountType })}
                handleAmountChange={amount => this.setState({ amount })}
              />

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

              <div className="form-group">
                <label htmlFor="calculatedAmount" className="col-sm-4 control-label">{calculatedInputLabel}</label>
                <div className="col-sm-8">
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input
                      type="text"
                      className="form-control"
                      id="calculatedAmount"
                      value={getCalculatedAmount(this.state.amount, this.state.taxrate, this.state.amountType)}
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
                      value={getVatAmount(this.state.amount, this.state.taxrate, this.state.amountType)}
                      style={{ textAlign: 'right' }}
                      readOnly
                      />
                  </div>
                </div>
              </div>

              <FileViewComponent files={this.getFilesForView()} handleDeleteFile={this.handleDeleteFile.bind(this)} />
              <FileUploadComponent handleFileChange={(files) => this.handleAddFiles(this.getFileModels(files))} />

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
        fileActions: (expense.files != null)
          ? { add: [], keep: expense.files, delete: [] }
          : { add: [], keep: [], delete: [] },
        date: dateFormatterView(expense.date),
        amount: numberFormatterView(expense.preTaxAmount),
        amountType: 'preTax',
        taxrate: formatTaxrate(expense.taxrate, false),
        comment: expense.comment || '',
        isNew,
        isDirty: false
      })
    }
  }
}

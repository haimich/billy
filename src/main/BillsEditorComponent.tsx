import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import BillFileModel from '../common/models/BillFileModel'
import FileActions from '../common/models/FileActions'
import FileViewComponent from '../common/components/FileViewComponent'
import FileUploadComponent from '../common/components/FileUploadComponent'
import { billExists } from '../common/services/billsService'
import { listBillTypes, getBillTypeById, createBillType } from '../common/services/billTypesService'
import { listCustomers, createCustomer, getCustomerById, deleteCustomerById } from '../common/services/customersService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb, getFilename } from '../common/ui/formatters'
import { enableTypeaheadFeatures, getInputs, resetFormValidationErrors, addFormValidation, revalidateInput } from '../common/ui/forms'
import Textarea from 'react-textarea-autosize'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  id?: number
  invoice_id: string
  amount?: string
  date_created?: string
  date_paid?: string
  comment: string
  selectedCustomer?: Customer[]
  selectedBillType?: BillTypeModel[]
  customerList: Customer[]
  billTypeList: BillTypeModel[]
  isNew: boolean
  isDirty: boolean
  invoiceIdValid: boolean
  fileActions: FileActions<BillFileModel>
}

interface Props {
  update: (model: Bill, fileActions: FileActions<BillFileModel>) => void
  save: (model: Bill, FileActions: FileActions<BillFileModel>) => void
  updateCustomer: (model: Customer) => void
  bill?: BillDbModel
  notify: any
}

export default class BillsEditorComponent extends React.Component<Props, {}> {

  state: State
  refs: {
    customerTypeahead: any,
    billTypeTypeahead: any,
    invoice: any,
    date_created: any,
    date_paid: any
  }

  dragCounter: number

  constructor(props) {
    super(props)

    this.state = this.getDefaultState()
    this.fetchTypeaheadData()
    this.dragCounter = 0;
  }

  resetState() {
    this.setState(this.getDefaultState())
    this.refs.customerTypeahead.getInstance().clear()
    this.refs.billTypeTypeahead.getInstance().clear()
    this.fetchTypeaheadData()
    process.nextTick(() => this.refs.invoice.focus())
    this.dragCounter = 0
    resetFormValidationErrors(getInputs(this))
  }

  getDefaultState(): State {
    return {
      id: undefined,
      invoice_id: '',
      amount: '',
      date_created: undefined,
      date_paid: undefined,
      comment: '',
      selectedCustomer: undefined,
      selectedBillType: undefined,
      customerList: [],
      billTypeList: [],
      isNew: true,
      isDirty: false,
      invoiceIdValid: true,
      fileActions: { add: [], keep: [], delete: [] }
    }
  }

  async fetchTypeaheadData() {
    try {
      let results = await Promise.all([
        listCustomers(),
        listBillTypes()
      ])

      this.setState({
        customerList: results[0],
        billTypeList: results[1]
      })
    } catch (err) {
      this.props.notify(t('Typeahead-Daten konnten nicht geladen werden') + err, 'error')
    }
  }

  async onSave(event) {
    event.preventDefault()

    if (this.state.selectedCustomer == null || this.state.selectedCustomer[0] == null) {
      this.props.notify(t('Bitte wähle einen Kunden aus oder erstelle einen neuen'), 'error')
      return
    }

    const bill: Bill = {
      invoice_id: this.state.invoice_id,
      customer_id: this.state.selectedCustomer[0].id!,
      amount: numberFormatterDb(this.state.amount),
      date_created: dateFormatterDb(this.state.date_created),
      date_paid: dateFormatterDb(this.state.date_paid),
      type_id: (this.state.selectedBillType == null || this.state.selectedBillType[0] == null)
        ? undefined
        : this.state.selectedBillType[0].id,
      comment: this.state.comment
    }

    try {
      const result = await this.checkValidity(bill)
      if (result) {
        this.props.notify(result, 'error')
        return
      }
    } catch (err) {
      this.props.notify(t('Die Validierung ist fehlgeschlagen: ') + err, 'error')
      return
    }

    try {
      await this.props.updateCustomer(this.state.selectedCustomer[0])

      if (this.state.isNew) {
        await this.props.save(bill, this.state.fileActions)
      } else {
        await this.props.update(bill, this.state.fileActions)
      }
    } catch (err) {
      return // don't reset state on error
    }

    this.resetState()
  }

  async checkValidity(bill: Bill): Promise<string | undefined> {
    if (this.state.isNew && await billExists(bill.invoice_id)) {
      return t('Eine Rechnung mit dieser Rechnungsnummer existiert bereits.')
    }

    return
  }

  getFileModels(files: File[]): BillFileModel[] {
    let fileModels = []

    for (let file of files) {
      fileModels.push({
        bill_id: this.state.id,
        path: file.path
      })
    }

    return fileModels
  }

  addFiles(files: BillFileModel[]) {
    if (files == null) {
      return
    }

    let keepList = this.state.fileActions.keep
    let deleteList = this.state.fileActions.delete
    let addList = this.state.fileActions.add

    for (let file of files) {
      if (this.fileExists(file, this.state.fileActions.add)) {
        continue
      }

      if (this.fileWithNameExists(file.path, this.state.fileActions.keep)) {
        if (!confirm(t(`Eine Datei mit dem Namen "${getFilename(file.path)}" existiert bereits. Soll sie überschrieben werden?`))) {
          continue
        }

        let originalFile

        keepList = keepList.filter(element => {
          if (getFilename(element.path) !== getFilename(file.path)) {
            return true
          } else {
            // we found the file to be overwritten
            originalFile = element
            return false
          }
        })
        deleteList = deleteList.concat(originalFile)
      }

      addList = addList.concat(file)
    }

    this.setState({
      fileActions: {
        keep: keepList,
        add: addList,
        delete: deleteList
      },
      isDirty: true
    })
  }

  fileWithNameExists(filePath: string, existingFiles: BillFileModel[]): boolean {
    for (let file of existingFiles) {
      if (getFilename(file.path) === getFilename(filePath)) {
        return true
      }
    }

    return false
  }

  fileExists(file: BillFileModel, fileList: BillFileModel[]): boolean {
    for (let element of fileList) {
      if (file.id != null && element.id != null && file.id === element.id) {
        return true
      } else if (file.path === element.path) {
        return true
      }
    }

    return false
  }

  onDrag(event) {
    event.preventDefault()
  }

  onEnter() {
    this.dragCounter++
    ReactDOM.findDOMNode(this).classList.add('busy')
  }

  onLeave() {
    this.dragCounter--
    if (this.dragCounter === 0) {
      ReactDOM.findDOMNode(this).classList.remove('busy')
    }
  }

  onDrop(event) {
    event.preventDefault()
    this.addFiles(this.getFileModels(event.dataTransfer.files))
    this.onLeave()
  }

  handleFileChange(files: File[]) {
    this.addFiles(this.getFileModels(files))
  }

  async handleCustomerChange(selected: any) {
    if (selected == null || selected.length !== 1) {
      return
    }

    let selectedCustomer = selected[0]
    let isNewCustomer = false

    if (selectedCustomer.customOption && (await getCustomerById(selectedCustomer.id) == null)) {
      isNewCustomer = true
    }

    if (isNewCustomer) {
      let customer

      try {
        customer = await createCustomer({
          name: selectedCustomer.name,
          telephone: selectedCustomer.telephone
        })
      } catch (err) {
        this.props.notify(t('Could not create customer'), 'error')
      }

      this.setState({
        selectedCustomer: [customer],
        customerList: [customer].concat(this.state.customerList)
      })
    } else {
      this.setState({ selectedCustomer: selected })
    }

    this.revalidate(ReactDOM.findDOMNode(this.refs.customerTypeahead.getInstance()).querySelector('input[name=customer]'))
  }

  async handleBillTypeChange(selected: any) {
    if (selected == null || selected.length !== 1) {
      return
    }

    let selectedBillType = selected[0]
    let isNewBillType = false

    if (selectedBillType.customOption && (await getBillTypeById(selectedBillType.id) == null)) {
      isNewBillType = true
    }

    if (isNewBillType) {
      let billType

      try {
        billType = await createBillType({
          type: selectedBillType.type
        })
      } catch (err) {
        this.props.notify(t('Der Rechnungstyp konnte nicht angelegt werden: ') + err, 'error')
      }

      this.setState({
        selectedBillType: [billType],
        billTypeList: [billType].concat(this.state.billTypeList)
      })
    } else {
      this.setState({ selectedBillType: selected })
    }
  }

  handleCustomerTelephoneChange(event: any) {
    if (this.state.selectedCustomer && this.state.selectedCustomer[0]) {
      this.setState({
        selectedCustomer: [{
          id: this.state.selectedCustomer[0].id,
          name: this.state.selectedCustomer[0].name,
          telephone: event.target.value // new number
        }]
      })
    }
  }

  handleDateCreatedChange(newDate: Date) {
    this.setState({ date_created: newDate })
    this.revalidate(ReactDOM.findDOMNode(this.refs.date_created).querySelector('input'))
  }

  handleDatePaidChange(newDate: Date) {
    this.setState({ date_paid: newDate })
    this.revalidate(ReactDOM.findDOMNode(this.refs.date_paid).querySelector('input'))
  }

  selectedCustomerTelephone() {
    if (this.state.selectedCustomer && this.state.selectedCustomer[0] && this.state.selectedCustomer[0].telephone) {
      return this.state.selectedCustomer[0].telephone
    } else {
      return ''
    }
  }

  async handleDeleteCustomer() {
    if (this.state.selectedCustomer == null || this.state.selectedCustomer[0] == null) {
      return
    }

    let customer = this.state.selectedCustomer[0]
    if (! confirm(t(`Möchtest du den Kunden "${customer.name}" wirklich löschen?`))) {
      return
    }

    try {
      await deleteCustomerById(customer.id!)
    } catch (err) {
      console.warn(err)
      this.props.notify(t('Der Kunde konnte nicht gelöscht werden. Eventuell wird er noch in anderen Rechnungen verwendet.'), 'error')
      return
    }

    this.refs.customerTypeahead.getInstance().clear()

    let newCustomerList: Customer[] = []
    for (let i = 0; i < this.state.customerList.length; i++) {
      if (customer.id === this.state.customerList[i].id) {
        continue
      }
      newCustomerList.push(this.state.customerList[i])
    }

    this.setState({
      customerList: newCustomerList,
      selectedCustomer: undefined
    })
  }

  handleDeleteFile(file: BillFileModel) {
    if (confirm(t('Möchtest du die Datei wirklich entfernen?'))) {
      const isExisting = (file.id != null)

      this.setState({
        fileActions: {
          keep: this.state.fileActions.keep.filter(element => {
            if (isExisting && file.id === element.id) {
              // existing file should be deleted
              return false
            } else {
              return true
            }
          }),
          add: this.state.fileActions.add.filter(element => {
            if (file.path === element.path) {
              // added file should be unadded
              return false
            } else {
              return true
            }
          }),
          delete: (isExisting)
            ? this.state.fileActions.delete.concat([file])
            : this.state.fileActions.delete
        }
      })
    }
  }

  getFilesForView(): BillFileModel[] {
    return this.state.fileActions.keep.concat(this.state.fileActions.add)
  }

  render() {
    return (
      <div id="editor-container" onDragOver={this.onDrag.bind(this)} onDragEnter={this.onEnter.bind(this)} onDragLeave={this.onLeave.bind(this)} onDrop={this.onDrop.bind(this)}>
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="customer" className="col-sm-4 control-label">{t('Kunde')}</label>
                <div className="col-sm-8">
                  <Typeahead
                    options={this.state.customerList}
                    allowNew={true}
                    onChange={this.handleCustomerChange.bind(this)}
                    onBlur={this.handleCustomerChange.bind(this)}
                    selected={this.state.selectedCustomer}
                    labelKey={'name'}
                    ref='customerTypeahead'
                    name="customer"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
                    newSelectionPrefix={t('Kunden anlegen: ')}
                    paginationText={t('Mehr anzeigen')}
                    maxResults={20}
                    />
                  <span className="sub-label">
                    <input
                      value={this.selectedCustomerTelephone()}
                      onChange={this.handleCustomerTelephoneChange.bind(this)}
                      placeholder={t('keine Telefonnr.')}
                      className="sub-input"
                      tabIndex={-1}
                      /> {
                      this.state.selectedCustomer != null
                        ? <span className="glyphicon glyphicon-remove-circle" aria-hidden="true" onClick={this.handleDeleteCustomer.bind(this)}></span>
                        : ''
                    }
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="id" className="col-sm-4 control-label">{t('Rechnungsnummer')}</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    ref="invoice"
                    readOnly={!this.state.isNew}
                    required
                    value={this.state.invoice_id}
                    onChange={(event: any) => this.setState({ invoice_id: event.target.value })}
                    />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="date_created" className="col-sm-4 control-label">{t('Rechnungsdatum')}</label>
                <Datetime
                  ref="date_created"
                  value={this.state.date_created}
                  inputProps={{
                    id: 'date_created',
                    required: 'required'
                  }}
                  dateFormat={'DD.MM.YYYY'}
                  closeOnSelect={true}
                  timeFormat={false}
                  className={'col-sm-8'}
                  onChange={this.handleDateCreatedChange.bind(this)}
                  />
              </div>
              <div className="form-group">
                <label htmlFor="amount" className="col-sm-4 control-label">{t('Betrag')}</label>
                <div className="col-sm-8">
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input
                      type="text"
                      className="form-control"
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
            </div>

            <div className="col-md-6">
             <div className="form-group">
                <label htmlFor="billType" className="col-sm-4 control-label">{t('Auftragsart')}</label>
                <div className="col-sm-8">
                  <Typeahead
                    options={this.state.billTypeList}
                    allowNew={true}
                    onChange={this.handleBillTypeChange.bind(this)}
                    onBlur={this.handleBillTypeChange.bind(this)}
                    selected={this.state.selectedBillType}
                    labelKey={'type'}
                    ref='billTypeTypeahead'
                    name="billType"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
                    newSelectionPrefix={t('Typ anlegen: ')}
                    paginationText={t('Mehr anzeigen')}
                    maxResults={20}
                    tabIndex={5}
                    />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="date_paid" className="col-sm-4 control-label">{t('Zahlungsdatum')}</label>
                <Datetime
                  ref="date_paid"
                  value={this.state.date_paid}
                  inputProps={{
                    id: 'date_paid'
                  }}
                  dateFormat={'DD.MM.YYYY'}
                  closeOnSelect={true}
                  timeFormat={false}
                  className={'col-sm-8'}
                  onChange={this.handleDatePaidChange.bind(this)}
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

              <FileViewComponent files={this.getFilesForView()} handleDeleteFile={this.handleDeleteFile.bind(this)} />
              <FileUploadComponent handleFileChange={this.handleFileChange.bind(this)} />
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
    enableTypeaheadFeatures(this.refs.customerTypeahead, 'customer', true)
    enableTypeaheadFeatures(this.refs.billTypeTypeahead, 'billType', false)
  }

  componentWillReceiveProps(nextProps: Props) {
    const bill: BillDbModel = nextProps.bill
    const isNew = (bill == null)

    if (this.state.isDirty && !confirm(t('Möchtest du die Änderungen verwerfen?'))) return

    resetFormValidationErrors(getInputs(this))

    if (isNew) {
      this.resetState()
    } else {
      this.setState({
        id: bill.id,
        invoice_id: bill.invoice_id,
        fileActions: (bill.files != null)
          ? { add: [], keep: bill.files, delete: [] }
          : { add: [], keep: [], delete: [] },
        selectedCustomer: [bill.customer],
        selectedBillType: [bill.type],
        date_created: dateFormatterView(bill.date_created),
        date_paid: dateFormatterView(bill.date_paid),
        amount: numberFormatterView(bill.amount),
        comment: bill.comment,
        invoiceIdValid: true,
        isNew,
        isDirty: false
      })
    }
  }
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import BillItem from '../common/models/BillItemModel'
import BillFileModel from '../common/models/BillFileModel'
import FileActions from '../common/models/FileActionsModel'
import FileListComponent from '../common/components/FileListComponent'
import { FileEndabledComponent } from '../common/components/FileEnabledComponent'
import ItemListComponent from '../common/components/ItemListComponent'
import { amountType } from '../common/components/PreTaxNetAmountComponent'
import { billExists } from '../common/services/billsService'
import { listBillTypes, getBillTypeById, createBillType } from '../common/services/billTypesService'
import { listCustomers, createCustomer, getCustomerById, deleteCustomerById } from '../common/services/customersService'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb, formatTaxrate } from '../common/ui/formatters'
import { getPreTaxAmount } from '../common/ui/preNetVat'
import { enableTypeaheadFeatures, getInputs, resetFormValidationErrors, addFormValidation, revalidateInput } from '../common/ui/forms'
import Textarea from 'react-textarea-autosize'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  id?: number
  invoice_id: string
  date_created?: string
  date_paid?: string
  amount?: string
  amountType?: amountType
  taxrate?: string
  billItemId: number
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
  update: (model: Bill, billItem: BillItem, fileActions: FileActions<BillFileModel>) => void
  save: (model: Bill, billItem: BillItem, FileActions: FileActions<BillFileModel>) => void
  updateCustomer: (model: Customer) => void
  bill?: BillDbModel
  notify: any
}

export default class BillsEditorComponent extends FileEndabledComponent<Props, {}> {

  state: State
  refs: {
    customerTypeahead: any,
    billTypeTypeahead: any,
    invoice: any,
    date_created: any,
    date_paid: any
  }

  constructor(props) {
    super(props)

    this.state = this.getDefaultState()
    this.fetchTypeaheadData()
  }

  resetState() {
    this.setState(this.getDefaultState())
    this.refs.customerTypeahead.getInstance().clear()
    this.refs.billTypeTypeahead.getInstance().clear()
    this.fetchTypeaheadData()
    process.nextTick(() => this.refs.invoice.focus())
    this.resetDragCounter()
    resetFormValidationErrors(getInputs(this))
  }

  getDefaultState(): State {
    return {
      id: undefined,
      invoice_id: '',
      date_created: undefined,
      date_paid: undefined,
      amount: '',
      amountType: 'preTax',
      taxrate: '19',
      billItemId: undefined,
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

    const billItem: BillItem = {
      id: this.state.billItemId,
      bill_id: this.state.id,
      position: 0,
      preTaxAmount: numberFormatterDb(
        this.state.amountType === 'preTax'
        ? this.state.amount
        : getPreTaxAmount(this.state.amount, this.state.taxrate)),
      taxrate: numberFormatterDb(this.state.taxrate),
    }

    const bill: Bill = {
      invoice_id: this.state.invoice_id,
      customer_id: this.state.selectedCustomer[0].id!,
      date_created: dateFormatterDb(this.state.date_created),
      date_paid: dateFormatterDb(this.state.date_paid),
      type_id: (this.state.selectedBillType == null || this.state.selectedBillType[0] == null)
        ? undefined
        : this.state.selectedBillType[0].id,
      comment: this.state.comment,
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
        await this.props.save(bill, billItem, this.state.fileActions)
      } else {
        await this.props.update(bill, billItem, this.state.fileActions)
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

  getFilesForView(): BillFileModel[] {
    return this.state.fileActions.keep.concat(this.state.fileActions.add)
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

  handleAddFiles(files: BillFileModel[]) {
    let newFileActions = this.addFiles(files, this.state.fileActions.keep, this.state.fileActions.delete, this.state.fileActions.add)

    this.setState({
      fileActions: newFileActions,
      isDirty: true
    })
  }

  handleDeleteFile(file: BillFileModel) {
    let newFileActions = this.deleteFile(file, this.state.fileActions.keep, this.state.fileActions.delete, this.state.fileActions.add)

    if (newFileActions != null) {
      this.setState({
        fileActions: newFileActions,
        isDirty: true
      })
    }
  }

  render() {
    return (
      <div id="editor-container" onDragOver={this.onDrag.bind(this)} onDragEnter={this.onEnter.bind(this)} onDragLeave={this.onLeave.bind(this)} onDrop={this.onDrop.bind(this)}>
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="customer">{t('Kunde')}</label>
                <div>
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
                      placeholder={t('Telefonr. eingeben')}
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
                <label htmlFor="id">{t('Rechnungsnummer')}</label>
                <div>
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
              <div className="row">
                <span className="form-group col-md-6">
                  <label htmlFor="date_created">{t('Rechnungsdatum')}</label>
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
                    onChange={this.handleDateCreatedChange.bind(this)}
                    />
                </span>
                <span className="form-group col-md-6 date-input-group-right">
                  <label htmlFor="date_paid">{t('Zahlungsdatum')}</label>
                  <Datetime
                    ref="date_paid"
                    value={this.state.date_paid}
                    inputProps={{
                      id: 'date_paid'
                    }}
                    dateFormat={'DD.MM.YYYY'}
                    closeOnSelect={true}
                    timeFormat={false}
                    onChange={this.handleDatePaidChange.bind(this)}
                    />
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="billType">{t('Auftragsart')}</label>
                <div>
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
            </div>

            <div className="col-md-8 right-formarea">
                <div className="item-list">
                  <ItemListComponent
                    amount={this.state.amount}
                    amountType={this.state.amountType}
                    taxrate={this.state.taxrate}
                    handleAmountChange={(newValue) => this.setState({ amount: newValue })}
                    handleAmountTypeChange={(newValue) => this.setState({ amountType: newValue })}
                    handleTaxrateChange={(newValue) => this.setState({ taxrate: newValue })}
                  />
                </div>

              <div className="row additional-items">
                <div className="col-md-6">
                  <FileListComponent
                    files={this.getFilesForView()}
                    handleAddFiles={files => this.handleAddFiles(this.getFileModels(files))}
                    handleDeleteFile={this.handleDeleteFile.bind(this)}
                  />
                </div>

                <div className="col-md-1"></div>

                <div className="col-md-5">
                  <div className="row">
                    <div className="form-group editor-comment">
                      <label htmlFor="comment">{t('Kommentar')}</label>
                      <div>
                        <Textarea
                          className="form-control"
                          minRows={3}
                          maxRows={3}
                          id="comment"
                          value={this.state.comment}
                          onChange={(event: any) => this.setState({ comment: event.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row editor-buttons">
                    <div className="col-md-12">
                      <div className="pull-right">
                        <button type="button" className="btn btn-secondary" onClick={this.resetState.bind(this)}>{t('Abbrechen')}</button> &nbsp;
                        <button type="submit" className="btn btn-primary">{t('Speichern')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p></p>
        </form>

        <div className="overlay"><span>{t('Datei(en) ablegen')}</span></div>
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
      let item = bill.items[0] // adapt this line when multiple bill items are implemented

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
        amount: numberFormatterView(item.preTaxAmount),
        amountType: 'preTax',
        taxrate: formatTaxrate(item.taxrate, false),
        billItemId: item.id,
        comment: bill.comment,
        invoiceIdValid: true,
        isNew,
        isDirty: false
      })
    }
  }
}
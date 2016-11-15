import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import FileViewComponent from './FileViewComponent'
import { billExists } from '../common/repositories/billsRepository'
import { listCustomers, createCustomer, getCustomerById, deleteCustomerById } from '../common/repositories/customersRepository'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb } from '../common/helpers/formatters'
import * as path from 'path'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  invoice_id: string;
  amount?: string;
  date_created?: string;
  date_paid?: string;
  comment: string;
  selectedCustomer?: Customer[];
  customerList: Customer[];
  isNew: boolean;
  isDirty: boolean;
  invoiceIdValid: boolean;
  file?: File;
}

interface Props {
  updateBill: (row: Bill) => void;
  saveBill: (row: Bill) => void;
  updateCustomer: (row: Customer) => void;
  bill?: BillDbModel;
  notify: any;
}

export default class EditorComponent extends React.Component<Props, {}> {

  state: State
  props: Props
  refs: {
    typeahead: any,
    invoiceId: any,
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
    this.refs.typeahead.getInstance().clear()
    this.fetchTypeaheadData()
    setTimeout(() => this.refs.invoiceId.focus())
    this.dragCounter = 0;
  }

  getDefaultState(): State {
    return {
      invoice_id: '',
      amount: '',
      date_created: undefined,
      date_paid: undefined,
      comment: '',
      selectedCustomer: undefined,
      customerList: [],
      isNew: true,
      isDirty: false,
      invoiceIdValid: true,
      file: undefined
    }
  }

  async fetchTypeaheadData() {
    try {
      let customerList = await listCustomers()
      this.setState({ customerList })
    } catch (err) {
      this.props.notify(t('Could not fetch typeahead data'), 'error')      
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
      comment: this.state.comment,
      file_path: this.state.file && this.state.file.path
    }

    try {
      const result = await this.checkValidity(bill)
      if (result) {
        this.props.notify(result, 'error')
        return
      }
    } catch (err) {
      this.props.notify(t('checkValidity threw an error'), 'error')
      return
    }

    if (this.state.isNew) {
      this.props.saveBill(bill)
    } else {
      this.props.updateBill(bill)
    }

    this.props.updateCustomer(this.state.selectedCustomer[0])

    this.resetState()
  }

  async checkValidity(bill: Bill): Promise<string | undefined> {
    if (this.state.isNew && await billExists(bill.invoice_id)) {
      return t('Datenbank Fehler duplicate id')
    }

    return
  }

  getFile(files) {
    if (files.length >= 1) {
      return files[0]
    }
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
    this.setState({ file: this.getFile(event.dataTransfer.files) })
    this.onLeave()
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

    this.revalidate(ReactDOM.findDOMNode(this.refs.typeahead.getInstance()).querySelector('input[name=customer]'))
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
    if (this.state.selectedCustomer != null && this.state.selectedCustomer[0] != null) {
      let customer = this.state.selectedCustomer[0]
      if (confirm(t(`Möchtest du den Kunden "${customer.name}" wirklich löschen?`))) {
        try {
          await deleteCustomerById(customer.id!)
        } catch (err) {
          this.props.notify(t('Could not delete customer'), 'error')
          return
        }

        this.refs.typeahead.getInstance().clear()

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
    }
  }

  render() {
    return (
      <div id="editor-container" onDragOver={this.onDrag.bind(this)} onDragEnter={this.onEnter.bind(this)} onDragLeave={this.onLeave.bind(this)} onDrop={this.onDrop.bind(this)}>
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="id" className="col-sm-4 control-label">{t('Rechnungsnr.')}</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    ref="invoiceId"
                    readOnly={!this.state.isNew}
                    required
                    value={this.state.invoice_id}
                    onChange={(event: any) => this.setState({ invoice_id: event.target.value })}
                    autoFocus
                    />
                </div>
              </div>
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
                    ref='typeahead'
                    name="customer"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
                    newSelectionPrefix={t('Kunden anlegen: ')}
                    tabIndex={2}
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
                <label htmlFor="date_paid" className="col-sm-4 control-label">{t('Zahlung erhalten am')}</label>
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
                  <textarea className="form-control" rows={3} id="comment" value={this.state.comment} onChange={(event: any) => this.setState({ comment: event.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-4 col-sm-8">
                  <label className="btn btn-default btn-sm">
                    {t('Datei auswählen')}
                    <input type="file" className="form-control hidden" onChange={(event: any) => this.setState({ file: this.getFile(event.target.files) })} />
                  </label> &nbsp;
                  
                  <FileViewComponent file={this.state.file} />
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
    this.getInputs().forEach(input => input.closest('.form-group')!.classList.remove('has-error'))
  }

  getInputs() {
    return [ ...ReactDOM.findDOMNode(this).querySelectorAll('input,textarea') ]
  }

  revalidate(input) {
    this.state.isDirty = true
    input.closest('.form-group').classList.remove('has-error')
    setTimeout(() => input.checkValidity())
  }

  componentDidMount() {
    this.addFormValidation()

    // Hack: enable features for Typeahead component
    const typeaheadInput =
      ReactDOM.findDOMNode(this.refs.typeahead.getInstance()).querySelector('input[name=customer]')
    typeaheadInput.setAttribute('id', 'customer')
    typeaheadInput.setAttribute('required', 'true')
  }

  componentWillReceiveProps(nextProps) {
    const bill: BillDbModel = nextProps.bill
    const isNew = (bill == null)

    if (this.state.isDirty && ! confirm(t('Möchtest du die Änderungen verwerfen?'))) return

    this.resetFormValidationErrors()

    if (isNew) {
      this.resetState()
    } else {
      this.setState({
        invoice_id: bill.invoice_id,
        file: {
          path: bill.file_path,
          name: bill.file_path && path.basename(bill.file_path)
        },
        selectedCustomer: [bill.customer],
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

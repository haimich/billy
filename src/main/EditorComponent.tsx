import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import { billExists } from '../common/repositories/billsRepository'
import { listCustomers, createCustomer } from '../common/repositories/customersRepository'
import t from '../common/helpers/i18n'
import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb } from '../common/helpers/formatters'
import { open } from '../common/providers/fileProvider'
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
  customerTelephone?: string;
  isNew: boolean;
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

export default class EditorComponent extends React.Component<any, {}> {

  state: State
  props: Props
  refs: {
    typeahead: any,
    invoiceId: any
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
      invoiceIdValid: true,
      file: undefined
    }
  }

  async fetchTypeaheadData() {
    try {
      let customerList = await listCustomers()
      this.setState({ customerList })
    } catch (err) {
      console.warn('Could not fetch typeahead data', err)
    }
  }

  async onSave(event) {
    event.preventDefault()

    const bill: Bill = {
      invoice_id: this.state.invoice_id,
      customer_id: this.state.selectedCustomer![0].id!,
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
      console.error('checkValidity threw an error', err)
      return
    }

    if (this.state.isNew) {
      this.props.saveBill(bill)
    } else {
      this.props.updateBill(bill)
    }

    this.props.updateCustomer(this.state.selectedCustomer![0])

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

  openFile(event) {
    event.preventDefault()
    if (this.state.file != null) {
      open(this.state.file.path)
    }
  }

  async handleCustomerChange(selected: any) {
    if (selected == null || selected.length !== 1) {
      return
    }

    if (selected[0].customOption) {
      let customer

      try {
        customer = await createCustomer({
          name: selected[0].name
        })
      } catch (err) {
        console.error('Could not create customer', err)
      }

      this.setState({
        selectedCustomer: [customer],
        customerList: [customer].concat(this.state.customerList)
      })
    } else {
      this.setState({ selectedCustomer: selected })
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

  selectedCustomerTelephone() {
    if (this.state.selectedCustomer && this.state.selectedCustomer[0] && this.state.selectedCustomer[0].telephone) {
      return this.state.selectedCustomer[0].telephone
    } else {
      return ''
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
                    onChange={(event: any) => this.setState({ invoice_id: event.target.value})}
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
                    selected={this.state.selectedCustomer}
                    labelKey={'name'}
                    ref='typeahead'
                    name="customer"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
                    newSelectionPrefix={t('Kunden anlegen: ')}
                    tabIndex={2}
                    />
                  <input
                    value={this.selectedCustomerTelephone()}
                    onChange={this.handleCustomerTelephoneChange.bind(this)}
                    placeholder={t('keine Telefonnr.')}
                    className="sub-input"
                    tabIndex={-1}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="date_created" className="col-sm-4 control-label">{t('Rechnungsdatum')}</label>
                <Datetime
                  value={this.state.date_created}
                  inputProps={{
                    id: 'date_created',
                    required: 'required'
                  }}
                  dateFormat={'DD.MM.YYYY'}
                  closeOnSelect={true}
                  timeFormat={false}
                  className={'col-sm-8'}
                  onChange={newDate => this.setState({ date_created: newDate })}
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
                  value={this.state.date_paid}
                  inputProps={{
                    id: 'date_paid'
                  }}
                  dateFormat={'DD.MM.YYYY'}
                  closeOnSelect={true}
                  timeFormat={false}
                  className={'col-sm-8'}
                  onChange={newDate => this.setState({ date_paid: newDate })}
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
                  <small className="fileview" onClick={this.openFile.bind(this)}>{this.state.file && this.state.file.name}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="pull-right">
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
    const inputs: Element[] = [...ReactDOM.findDOMNode(this).querySelectorAll('input')]

    for (let input of inputs) {
      input.addEventListener('input', (event) => {
        const input: any = event.target;
        input.closest('.form-group').classList.remove('has-error')
        input.checkValidity()
      })

      input.addEventListener('invalid', (event) => {
        const input: any = event.target;
        input.closest('.form-group').classList.add('has-error')
      })
    }
  }

  componentDidMount() {
    this.addFormValidation()

    // Hack: enable htmlFor feature for Typeahead component
    const typeaheadInput = 
      ReactDOM.findDOMNode(this.refs.typeahead.getInstance()).querySelectorAll('input[name=customer]')[0]
    typeaheadInput.setAttribute('id', 'customer')
  }

  componentWillReceiveProps(nextProps) {
    const bill: BillDbModel = nextProps.bill
    const isNew = (bill == null)

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
        isNew
      })
    }
  }
}

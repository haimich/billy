import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import BillDbModel from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import { listCustomers } from '../common/repositories/customersRepository'
import t from '../common/helpers/i18n'
import { convertToNumber, dateToString, stringToDate } from '../common/helpers/formatters'
import { open } from '../common/providers/fileProvider'

const Datetime = require('react-datetime')
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  invoice_id: string;
  amount?: string;
  date_created?: Date;
  date_paid?: Date;
  comment: string;
  file_path: string;
  selectedCustomer?: Customer[];
  customerList: Customer[];
  isNew: boolean;
  file?: File;
}

interface Props {
  update: (row: Bill) => void;
  save: (row: Bill) => void;
  bill?: BillDbModel;
}

export default class EditorComponent extends React.Component<any, {}> {

  state: State
  props: Props
  refs: {
    typeahead: any
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
      file_path: '',
      selectedCustomer: undefined,
      customerList: [],
      isNew: true,
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

  onSave(event) {
    event.preventDefault()

    const bill: Bill = {
      invoice_id: this.state.invoice_id,
      customer_id: this.state.selectedCustomer![0].id!,
      amount: convertToNumber(this.state.amount),
      date_created: dateToString(this.state.date_created)!,
      date_paid: dateToString(this.state.date_paid),
      comment: this.state.comment,
      file_path: this.state.file && this.state.file.path
    }

    if (this.state.isNew) {
      this.props.save(bill)
    } else {
      this.props.update(bill)
    }

    this.resetState()
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
                    allowNew={false}
                    onChange={selected => this.setState({ selectedCustomer: selected })}
                    selected={this.state.selectedCustomer}
                    labelKey={'name'}
                    ref='typeahead'
                    name="customer"
                    placeholder=""
                    emptyLabel={t('Keine Einträge vorhanden')}
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
    // Hack: enable some features for Typeahead component
    const typeaheadInput = 
      ReactDOM.findDOMNode(this.refs.typeahead.getInstance()).querySelectorAll('input[name=customer]')[0]
    typeaheadInput.setAttribute('id', 'customer')

    this.addFormValidation()
  }

  componentWillReceiveProps(nextProps) {
    const bill: BillDbModel = nextProps.bill
    const isExisting = (bill != null)

    if (isExisting) {
      let newState: State
      
      newState = Object.assign(bill)
      newState.amount = String(newState.amount).replace('.', ',')
      newState.selectedCustomer = [bill.customer]
      newState.date_created = stringToDate(bill.date_created)!
      newState.date_paid = stringToDate(bill.date_paid)!
      newState = Object.assign(newState, { isNew: !isExisting })
      
      this.setState(newState)
    } else {
      this.resetState()
    }
  }
}

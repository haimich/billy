import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'
import { importCsv } from '../common/providers/importProvider'
import { importBills, deleteAll } from '../common/repositories/billsRepository'
import { listCustomers, createCustomer } from '../common/repositories/customersRepository'
import Customer from '../common/models/CustomerModel'
import SummaryComponent from './SummaryComponent'
import Bill from '../common/models/BillModel'

export default class FormComponent extends React.Component<any, {}> {

  refs: {
    file: HTMLInputElement,
    importButton: HTMLButtonElement
  }

  state: {
    file?: File,
    shouldDelete?,
    failed: Bill[],
    successful: Bill[]
  }

  constructor(props) {
    super(props)

    this.state = {
      file: undefined,
      shouldDelete: false,
      failed: [],
      successful: []
    }
  }

  onCheckboxChange(event) {
    this.setState({
      shouldDelete: !this.state.shouldDelete
    })
  }

  onFileinputChange(event) {
    const files = event.target.files
    if (files.length >= 1) {
      this.setState({ file: files[0] })
      this.refs.importButton.removeAttribute('disabled')
    }
  }

  userConfirmed(): boolean {
    if (this.state.shouldDelete) {
      return window.confirm(t('Bist du sicher, dass die bestehenden Daten gelöscht werden sollen?'))
    } else {
      return true
    }
  }

  async handleSubmit(event) {
    event.preventDefault()

    if (this.state.file && this.userConfirmed()) {
      try {
        const bills = await importCsv(this.state.file.path)
        
        if (this.state.shouldDelete) {
          await deleteAll()
        }

        let customerNames = await this.getCustomerNames()

        const createCustomers: { [id: string]: Promise<Customer> } = {}
        bills.forEach(bill => {
          const customer = bill.customer
          if (! (customer in customerNames || customer in createCustomers)) {
            createCustomers[customer] = createCustomer({ name: bill.customer })
          }
        })

        await Promise.all(values(createCustomers))

        customerNames = await this.getCustomerNames()

        bills.forEach(bill => {
          bill.customer_id = customerNames[bill.customer]
          delete bill.customer
        })

        const results = await importBills(bills)

        console.log(results)

        this.setState({
          failed: results.failed,
          successful: results.successful
        })
      } catch (err) {
        console.error('Import failed', err)
      }
    }
  }

  async getCustomerNames() {
    const customers = await listCustomers()
    return customers.reduce((lookup, c) => (lookup[c.name] = c.id, lookup), {})
  }

  render() {
    return (
      <div id="form-container">
        <form className="form-horizontal container" onSubmit={this.handleSubmit.bind(this)}>

          <div className="row">
            <div className="checkbox">
              <label>
                <input 
                  type="checkbox"
                  checked={this.state.shouldDelete}
                  onChange={this.onCheckboxChange.bind(this)} />
                {t('Bestehende Daten löschen?')}
              </label>
              <p></p>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <div className="col-sm-offset-4 col-sm-8">
                <label className="btn btn-default btn-sm">
                  {t('Datei auswählen')}
                  <input type="file" className="form-control hidden" id="file" ref="file" onChange={this.onFileinputChange.bind(this)} />
                </label> &nbsp;
                  <small className="fileview">{this.state.file && this.state.file.name}</small>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="pull-right">
                <button type="submit" className="btn btn-primary" ref="importButton" disabled>{t('Importieren')}</button>
              </div>
            </div>
          </div>
        </form>

        <SummaryComponent failed={this.state.failed} successful={this.state.successful} />
      </div>
    )
  }
}

function values(obj) {
  return Object.keys(obj).map(k => obj[k]);
}
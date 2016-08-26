import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../models/BillModel'
import { createBill } from '../repositories/billsRepository'

export default class EditorComponent extends React.Component<any, {}> {

  refs: {
    id: HTMLInputElement,
    customer: HTMLInputElement,
    amount: HTMLInputElement,
    date_created: HTMLInputElement,
    date_paid: HTMLInputElement
  }

  onSave(event) {
    event.preventDefault()

    const refs = this.refs
    const bill = new Bill(
      refs.id.value,
      refs.customer.value,
      Number(refs.amount.value),
      refs.date_created.valueAsDate,
      refs.date_paid.valueAsDate,
    )

    createBill(bill).then(console.log, console.log)
  }

  render() {
    return (
      <div className="container">
        <form className="form-horizontal" onSubmit={this.onSave.bind(this)}>
          <div className="form-group">
            <label htmlFor="id" className="col-sm-2 control-label">Rechnungsnr.</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="id" ref="id" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="customer" className="col-sm-2 control-label">Kunde</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="customer" ref="customer" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount" className="col-sm-2 control-label">Betrag</label>
            <div className="col-sm-10 input-group">
              <span className="input-group-addon">€</span>
              <input type="number" className="form-control" id="amount" ref="amount" required min="0" step="0.01" pattern="[+-]?\d+(,\d+)?" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date_created" className="col-sm-2 control-label">Rechnungsdatum</label>
            <div className="col-sm-10">
              <input type="date" className="form-control currency" id="date_created" ref="date_created" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date_paid" className="col-sm-2 control-label">Rechnung bezahlt am</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="date_paid" ref="date_paid" required />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Speichern</button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  componentDidMount() {
    const inputs:Element[] = [ ...ReactDOM.findDOMNode(this).querySelectorAll('input') ]

    inputs.forEach(input => input.addEventListener('input', function (event) {
      const input:any = event.target;
      input.closest('.form-group').classList.remove('has-error')
      input.checkValidity()
    }))

    inputs.forEach(input => input.addEventListener('invalid', function (event) {
      const input:any = event.target;
      input.closest('.form-group').classList.add('has-error')
    }))
  }
}

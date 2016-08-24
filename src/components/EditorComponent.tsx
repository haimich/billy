import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../models/BillModel'
import * as DatePicker from 'react-datepicker'

export default class EditorComponent extends React.Component<any, {}> {

  refs: {
    id: HTMLInputElement,
    customer: HTMLInputElement,
    amount: HTMLInputElement
  }

  state: {
    date_created: Date,
    date_paid: Date
  }

  onSave(event) {
    event.preventDefault()

    const refs = this.refs

    console.log({
      id: refs.id.value,
      customeer: refs.customer.value,
      amount: Number(refs.amount.value),
      date_created: this.state.date_created,
      date_paid: this.state.date_paid
    })
  }

  onChangeDateCreated(date) {
    this.setState({ date_created: date.toDate() })
  }

  onChangeDatePaid(date) {
    this.setState({ date_paid: date.toDate() })
  }

  render() {
    return (
      <div className="container">
        <form className="form-horizontal" onSubmit={this.onSave.bind(this)}>
          <div className="form-group">
            <label htmlFor="id" className="col-sm-2 control-label">Rechnungsnr.</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="id" ref="id" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="customer" className="col-sm-2 control-label">Kunde</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="customer" ref="customer" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount" className="col-sm-2 control-label">Betrag</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="amount" ref="amount" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date_created" className="col-sm-2 control-label">Rechnungsdatum</label>
            <div className="col-sm-10">
              <DatePicker className="form-control" id="date_created" onChange={this.onChangeDateCreated.bind(this)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date_paid" className="col-sm-2 control-label">Rechnung bezahlt am</label>
            <div className="col-sm-10">
              <DatePicker className="form-control" id="date_paid" onChange={this.onChangeDatePaid.bind(this)} />
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
    const el:Element = ReactDOM.findDOMNode(this)
  }
}

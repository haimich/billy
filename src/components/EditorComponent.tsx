import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../models/BillModel'

export default class EditorComponent extends React.Component<any, {}> {

  refs: {
    id: HTMLInputElement,
    customer: HTMLInputElement,
    amount: HTMLInputElement,
    date_created: HTMLInputElement,
    date_paid: HTMLInputElement,
    comment: HTMLInputElement
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
      refs.comment.value
    )

    this.props.save(bill)
  }

  render() {
    return (
      <div id="editor-container">
        <form className="form-horizontal container" onSubmit={this.onSave.bind(this)}>

          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="id" className="col-sm-4 control-label">Rechnungsnr.</label>
              <div className="col-sm-8">
                <input type="text" className="form-control" id="id" ref="id" required />
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="customer" className="col-sm-4 control-label">Kunde</label>
              <div className="col-sm-8">
                <input type="text" className="form-control" id="customer" ref="customer" required />
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="amount" className="col-sm-4 control-label">Betrag</label>
              <div className="col-sm-8 input-group">
                <span className="input-group-addon">€</span>
                <input type="number" className="form-control" id="amount" ref="amount" style={{textAlign: "right"}} required min="0" step="0.01" pattern="[+-]?\d+(,\d+)?" />
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="date_created" className="col-sm-4 control-label">Rechnungsdatum</label>
              <div className="col-sm-8">
                <input type="date" className="form-control currency" id="date_created" ref="date_created" required />
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="date_paid" className="col-sm-4 control-label">Rechnung bezahlt am</label>
              <div className="col-sm-8">
                <input type="date" className="form-control" id="date_paid" ref="date_paid" />
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="comment" className="col-sm-4 control-label">Kommentar</label>
              <div className="col-sm-8">
                <textarea className="form-control" rows={3} id="comment" ref="comment" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <div className="pull-right">
                <button type="submit" className="btn btn-primary">Speichern</button>
              </div>
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

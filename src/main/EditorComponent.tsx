import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillModel'
import t from '../common/helpers/i18n'
import { formatDateForInput } from '../common/helpers/formatters'
import { open } from '../common/providers/openFileProvider'

export default class EditorComponent extends React.Component<any, {}> {

  refs: {
    id: HTMLInputElement,
    customer: HTMLInputElement,
    amount: HTMLInputElement,
    date_created: HTMLInputElement,
    date_paid: HTMLInputElement,
    comment: HTMLInputElement,
    file: HTMLInputElement,
    fileLabel: HTMLInputElement
  }

  state: {
    file?: File
  }

  props: {
    update: (row: Bill) => void,
    save: (row: Bill) => void,
    bill?: Bill
  }

  counter: number

  constructor(props) {
    super(props)

    this.state = {
      file: undefined
    }

    this.counter = 0;
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
      refs.comment.value,
      this.state.file && this.state.file.path
    )

    this.props.save(bill)
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
    this.counter++
    ReactDOM.findDOMNode(this).classList.add('busy')
  }

  onLeave() {
    this.counter--
    if (this.counter == 0) {
      ReactDOM.findDOMNode(this).classList.remove('busy')
    }
  }

  onDrop(event) {
    event.preventDefault()
    this.setState({ file: this.getFile(event.dataTransfer.files) })
    this.onLeave()
  }

  onFileinputChange(event) {
    this.setState({ file: this.getFile(event.target.files) })
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
                  <input type="text" className="form-control" id="id" ref="id" required autoFocus />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="customer" className="col-sm-4 control-label">{t('Kunde')}</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" id="customer" ref="customer" defaultValue="Don Jeere" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="date_created" className="col-sm-4 control-label">{t('Rechnungsdatum')}</label>
                <div className="col-sm-8">
                  <input type="date" className="form-control currency" id="date_created" defaultValue={formatDateForInput(new Date())} ref="date_created" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="amount" className="col-sm-4 control-label">{t('Betrag')}</label>
                <div className="col-sm-8">
                  <div className="input-group">
                    <span className="input-group-addon">€</span>
                    <input type="number" className="form-control" id="amount" ref="amount" defaultValue="100" style={{ textAlign: "right" }} required min="0" step="0.01" pattern="[+-]?\d+(,\d+)?" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="date_paid" className="col-sm-4 control-label">{t('Zahlung erhalten am')}</label>
                <div className="col-sm-8">
                  <input type="date" className="form-control" id="date_paid" defaultValue="2016-12-11" ref="date_paid" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="comment" className="col-sm-4 control-label">{t('Kommentar')}</label>
                <div className="col-sm-8">
                  <textarea className="form-control" rows={3} id="comment" defaultValue="Comment" ref="comment" />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-4 col-sm-8">
                  <label className="btn btn-default btn-sm">
                    {t('Datei auswählen')}
                    <input type="file" className="form-control hidden" id="file" ref="file" onChange={this.onFileinputChange.bind(this)} />
                  </label> &nbsp;
                  <small className="fileview" ref="fileLabel" onClick={this.openFile.bind(this)}>{this.state.file && this.state.file.name}</small>
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

    inputs.forEach(input => input.addEventListener('input', function (event) {
      const input: any = event.target;
      input.closest('.form-group').classList.remove('has-error')
      input.checkValidity()
    }))

    inputs.forEach(input => input.addEventListener('invalid', function (event) {
      const input: any = event.target;
      input.closest('.form-group').classList.add('has-error')
    }))
  }

  componentDidMount() {
    this.addFormValidation()
  }
}

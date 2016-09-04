import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'

export default class FormComponent extends React.Component<any, {}> {

  refs: {
    file: HTMLInputElement,
    importButton: HTMLButtonElement
  }

  state: {
    file?: File
  }

  constructor(props) {
    super(props)

    this.state = {
      file: undefined
    }
  }

  onFileinputChange(event) {
    const files = event.target.files
    if (files.length >= 1) {
      this.setState({ file: files[0] })
      this.refs.importButton.removeAttribute('disabled')
    }
  }

  handleButtonClick(event) {
    console.log('Import it')
  }

  render() {
    return (
      <div id="form-container">
        <form className="form-horizontal container" onSubmit={this.handleButtonClick.bind(this)}>

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
      </div>
    )
  }
}
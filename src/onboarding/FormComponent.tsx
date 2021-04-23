import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { resourceLimits } from 'worker_threads';
import t from '../common/helpers/i18n'
const { dialog } = require('electron').remote

export interface FormComponentValues {
  folder: string
}

interface Props { 
  finishSetup: (values: FormComponentValues) => any;
}

export class FormComponent extends React.Component<Props, {}> {

  refs: {
    file: HTMLInputElement,
    next: HTMLButtonElement
  }

  state: {
    folder?: string
  }

  constructor(props) {
    super(props)

    this.state = {
      folder: undefined
    }
  }

  async openFileDialog() {
    let result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    
    if (result.canceled || result.filePaths == null || result.filePaths.length === 0) {
      return
    }

    this.setState({ folder: result.filePaths[0] })
  }

  onSubmit(event) {
    event.preventDefault()
    this.props.finishSetup({
      folder: this.state.folder
    })
  }

  render() {
    return (
      <form className="container" onSubmit={this.onSubmit.bind(this)}>

        <p>
          <b>{t('Wo soll ich Deine Rechnungen ablegen?')}</b>
        </p>

        <p className="onboardingForm">
          <label className="btn btn-default">
            {t('Ordner auswählen')}
            <button className="form-control hidden" onClick={this.openFileDialog.bind(this)} />
          </label> &nbsp;

          <small ref="fileLabel" className="fileLabel" title={this.state.folder}>
            {this.state.folder}
          </small>

          <button type="submit" className="btn btn-primary" ref="next">{t('Weiter')}</button>
        </p>
      </form>
    )
  }
}
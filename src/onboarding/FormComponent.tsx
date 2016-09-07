import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'

export interface FormComponentValues {
  folder: string
}

export class FormComponent extends React.Component<any, {}> {

  refs: {
    file: HTMLInputElement,
    next: HTMLButtonElement
  }

  state: {
    folder?: File
  }

  props: {
    finish
  }

  constructor(props) {
    super(props)

    this.state = {
      folder: undefined
    }
  }

  onFileinputChange(event) {
    const files = event.target.files
    if (files.length >= 1) {
      this.setState({ folder: files[0] })
      this.refs.next.removeAttribute('disabled')
    }
  }

  onSubmit(event) {
    event.preventDefault()
    this.props.finish({
      folder: this.state.folder!.path
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
            <input type="file" className="form-control hidden" id="file" ref="file" onChange={this.onFileinputChange.bind(this)} />
          </label> &nbsp;
          <small ref="fileLabel" className="fileLabel">{this.state.folder && this.state.folder.path}</small>
          <button type="submit" className="btn btn-primary" ref="next" disabled>{t('Weiter')}</button>
        </p>
      </form>
    )
  }

  componentDidMount() {
    // set file input attributes so it only selects folders
    this.refs.file.setAttribute('directory', '')
    this.refs.file.setAttribute('webkitdirectory', '')
  }
}
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

interface Props {
  handleFileChange: (files: File[]) => any
}

export default class FileUploadComponent extends React.Component<Props, {}> {

  refs: {
    fileinput: HTMLInputElement
  }

  handleOnChange(event: any) {
    this.props.handleFileChange(event.target.files)
  }

  resetValue() {
    this.refs.fileinput.value = null
  }

  render() {
   return (
     <div className="form-group">
       <div className="col-sm-offset-4 col-sm-8">
         <label className="btn btn-default btn-sm">
          {t('Datei auswählen')}
          <input
            type="file"
            ref="fileinput"
            className="form-control hidden"
            onChange={this.handleOnChange.bind(this)}
            onClick={this.resetValue.bind(this)}
          />
        </label>
       </div>
     </div>
   )
  }

}

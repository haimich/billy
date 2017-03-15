import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../helpers/i18n'

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
     <div className="form-group pull-right">
       <div className="col-sm-12">
         <label className="btn btn-default btn-sm">
          {t('Datei auswählen')}
          <input
            type="file"
            ref="fileinput"
            className="form-control hidden"
            multiple
            onChange={this.handleOnChange.bind(this)}
            onClick={this.resetValue.bind(this)}
          />
        </label>
       </div>
     </div>
   )
  }

}

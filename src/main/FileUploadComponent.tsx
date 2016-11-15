import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

interface Props {
  handleFileChange: (files: File[]) => any
}

export default class FileUploadComponent extends React.Component<Props, {}> {

  handleOnChange(event: any) {
    this.props.handleFileChange(event.target.files)
  }

  render() {
   return (
     <span>
       <label className="btn btn-default btn-sm">
         {t('Datei auswählen')}
         <input type="file" className="form-control hidden" onChange={this.handleOnChange.bind(this)} />
       </label>
     </span>
   )
  }

}

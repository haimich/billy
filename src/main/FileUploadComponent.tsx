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
     <div className="form-group">
       <div className="col-sm-offset-4 col-sm-8">
         <label className="btn btn-default btn-sm">
          {t('Datei auswählen')}
          <input type="file" className="form-control hidden" onChange={this.handleOnChange.bind(this)} />
        </label>
       </div>
     </div>
   )
  }

}

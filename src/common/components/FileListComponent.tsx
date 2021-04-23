import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FileUploadComponent from './FileUploadComponent'
import FileModel from '../models/FileModel'
import { getFilename } from '../ui/formatters'
import { open } from '../providers/fileProvider'
import { shortenFilename } from '../helpers/text'
import { getFileIconHtml } from '../ui/icons'
import t from '../helpers/i18n'

interface Props {
  files: FileModel[]
  handleDeleteFile
  handleAddFiles
}

export default class FileListComponent extends React.Component<Props, {}> {

  getFileList() {
    let fileList = []

    for (let i = 0; i < this.props.files.length; i++) {
      const file = this.props.files[i]

      fileList.push(
        <tr key={i} title={t('Klicken um zu öffnen (' + file.path + ')')}>
          <td>
            <span className="file-open" onClick={event => {
                event.preventDefault()
                open(file.path)
              }}
            >
              <span className="file-icon">{getFileIconHtml(getFilename(file.path))}</span>
              <span className="file-view">{shortenFilename(getFilename(file.path), 38)}</span>
            </span>

            <span className="glyphicon glyphicon-remove-circle pull-right" aria-hidden="true" onClick={event => {
              event.preventDefault()
              this.props.handleDeleteFile(file)
            }} />
          </td>
        </tr>
      )
    }

    if (fileList.length === 0) {
      return (
        <tr key="-1">
          <td>
            <span className="empty">- {t('keine Dateien')} -</span>
          </td>
        </tr>
      )
    } else {
      return (
        fileList
      )
    }
  }

  render() {
    return (
      <div className="row file-list">
        <div className="col-md-12">
          <table className="table table-condensed">
            <thead>
              <tr>
                <th className="text-center">{t('Dateiname')}</th>
              </tr>
            </thead>
            <tbody>       
              {this.getFileList()}
            </tbody>
          </table>

          <FileUploadComponent handleFileChange={files => this.props.handleAddFiles(files)} />
        </div>
      </div>
    )
  }
}

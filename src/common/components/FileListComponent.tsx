import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FileViewComponent from './FileViewComponent'
import FileUploadComponent from './FileUploadComponent'
import FileModel from '../models/FileModel'
import t from '../helpers/i18n'

interface Props {
  files: FileModel[]
  idField: string
  parentId: string | number
  handleDeleteFile
  handleAddFiles
}

export default class FileListComponent extends React.Component<Props, {}> {

  getFileModels(files: File[]): FileModel[] {
    let fileModels = []

    for (let file of files) {
      let newFile = {
        path: file.path
      }
      newFile[this.props.idField] = this.props.parentId

      fileModels.push(newFile)
    }

    return fileModels
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <FileViewComponent files={this.props.files} handleDeleteFile={this.props.handleDeleteFile.bind(this)} />
          <FileUploadComponent handleFileChange={(files) => this.props.handleAddFiles(this.getFileModels(files))} />
        </div>
      </div>
    )
  }
}

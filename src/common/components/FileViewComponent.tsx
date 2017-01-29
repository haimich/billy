import * as React from 'react'
import File from '../models/FileModel'
import { getFilename } from '../ui/formatters'
import { open } from '../providers/fileProvider'
import { shortenFilename } from '../helpers/text'
import { getFileIconHtml } from '../ui/icons'
import t from '../helpers/i18n'

interface Props {
  files: File[];
  handleDeleteFile: (file: File) => void
}

export default class FileViewComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  getFileList() {
    let fileList = []

    for (let i = 0; i < this.props.files.length; i++) {
      const file = this.props.files[i]

      fileList.push(
        <li key={i} title={t('Klicken um zu öffnen')}>
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
        </li>
      )
    }

    if (fileList.length === 0) {
      return (
        <span className="empty">- {t('keine Dateien')} -</span>
      )
    } else {
      return (
        <ul>{fileList}</ul>
      )
    }
  }

  render() {
    return (
      <div className="form-group file-list">
        <div className="col-sm-offset-4 col-sm-8">
          {this.getFileList()}
        </div>
      </div>
    )

  }
}

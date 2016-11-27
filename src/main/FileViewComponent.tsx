import * as React from 'react'
import { open } from '../common/providers/fileProvider'
import { shortenFilename } from '../common/helpers/text'
import { getFileIconHtml } from '../common/helpers/icons'

interface Props {
  file?: File;
  handleDeleteFile: () => void
}

export default class FileViewComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  openFile(event) {
    event.preventDefault()
    if (this.props.file != null) {
      open(this.props.file.path)
    }
  }

  render() {
    if (this.props.file == null || this.props.file.name == null) {
      return(<span />)
    }

    return (
      <div className="form-group">
        <div className="col-sm-offset-4 col-sm-8">
          <ul className="file-list">
            <li>
              <span className="file-open" onClick={this.openFile.bind(this)}>
                <span className="file-icon">{getFileIconHtml(this.props.file.name)}</span>

                <span className="file-view">{shortenFilename(this.props.file.name, 38)}</span>
              </span>

              <span className="glyphicon glyphicon-remove-circle pull-right" aria-hidden="true" onClick={this.props.handleDeleteFile.bind(this)} />
            </li>
          </ul>
        </div>
      </div>
    )

  }
}

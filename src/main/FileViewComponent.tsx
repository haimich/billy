import * as React from 'react'
import { open } from '../common/providers/fileProvider'
import { getFileIconHtml } from '../common/helpers/icons'

interface Props {
  file?: File;
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
    if (this.props.file == null) {
      return(<span />)
    }

    return (
      <div className="form-group">
        <div className="col-sm-offset-4 col-sm-8">
          <ul className="file-list">
            <li>
              <span className="file-icon">{getFileIconHtml(this.props.file.name)}</span>

              <span className="file-view" onClick={this.openFile.bind(this)}>{this.props.file.name}</span>
            </li>
          </ul>
        </div>
      </div>
    )

  }
}

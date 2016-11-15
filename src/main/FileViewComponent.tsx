import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { open } from '../common/providers/fileProvider'

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
          <small className="fileview" onClick={this.openFile.bind(this)}>{this.props.file.name}</small>
        </div>
      </div>
    )

  }
}

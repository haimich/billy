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
   return (
     <small className="fileview" onClick={this.openFile.bind(this)}>{this.props.file && this.props.file.name}</small>
   )
  }

}

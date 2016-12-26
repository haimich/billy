import * as React from 'react';
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let CountUp = require('react-countup').default

interface Props {
  title: string
  value: number
  icon: string
}

export default class PanelComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-3">
          <i className={`fa fa-5x ${this.props.icon}`} aria-hidden="true"></i>
        </div>
        <div className="col-xs-9 text-right">
          <div className="panel-value">
            <CountUp
              start={0}
              end={this.props.value}
              duration={1.5}
              useGrouping={true}
              separator="."
            /> €
          </div>

          <div className="panel-title">{this.props.title}</div>            
        </div>
      </div>
    )
  }

}
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import t from '../helpers/i18n'
let CountUp = require('react-countup').default

interface Props {
  title: string
  value: number
  icon: string
  suffix?: string
}

export default class PanelComponent extends React.Component<Props, {}> {

  render() {
    return (
      <div className="row panel-row">
        <div className="col-xs-3 panel-icon">
          <i className={`fa fa-4x ${this.props.icon}`} aria-hidden="true"></i>
        </div>
        <div className="col-xs-9 text-right">
          <div className="panel-value">
            <CountUp
              start={0}
              end={this.props.value}
              duration={1.5}
              useGrouping={true}
              separator="."
            />&nbsp;{this.props.suffix}
          </div>

          <div className="panel-title">{this.props.title}</div>
        </div>
      </div>
    )
  }

}
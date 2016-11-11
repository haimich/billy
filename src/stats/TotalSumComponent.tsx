import * as React from 'react';
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

export default class TotalSumComponent extends React.Component<any, {}> {

  props: {
    total: string;
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="pull-right">
        <b>{t('SUMME')}:</b> {this.props.total} €
      </div>
    )
  }

}
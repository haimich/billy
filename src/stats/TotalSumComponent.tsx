import * as React from 'react';
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

interface Props {
  total: string;
}

export default class TotalSumComponent extends React.Component<Props, {}> {

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
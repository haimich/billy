import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'
import Bill from '../common/models/BillModel'

export default class SummaryComponent extends React.Component<any, {}> {

  props: {
    failed: Bill[],
    successful: Bill[]
  }

  render() {
    return (
      <div>
        <div>{t('Erfolgreich')}: {this.props.successful.length}</div>
        <div>{t('Fehlgeschlagen')}: {this.props.failed.length}</div>
      </div>
    )
  }
}
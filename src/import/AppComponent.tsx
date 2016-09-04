import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import t from '../common/helpers/i18n'
import * as NotificationSystem from 'react-notification-system'
import FormComponent from './FormComponent'

let notifications

export default class AppComponent extends React.Component<any, {}> {

  refs: {
    notificationSystem: HTMLInputElement
  }

  componentDidMount() {
    notifications = this.refs.notificationSystem
  }

  render() {
    return (
      <div>
        <h2>{t('Daten importieren')}</h2>

        <FormComponent />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

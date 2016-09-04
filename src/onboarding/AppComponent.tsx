import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import t from '../common/helpers/i18n'
import { set } from '../common/providers/settingsProvider'
import { setupDb } from '../common/providers/dbProvider'
import { ensureFolderExists, exists, BILL_FOLDER_SUFFIX } from '../common/providers/fileProvider'
import { FormComponent, FormComponentValues } from './FormComponent'
import * as NotificationSystem from 'react-notification-system'

let notifications

export default class AppComponent extends React.Component<any, {}> {

  refs: {
    notificationSystem: HTMLInputElement
  }

  componentDidMount() {
    notifications = this.refs.notificationSystem
  }

  async finishSetup(values: FormComponentValues): Promise<any> {
    try {
      const appDir = values.folder
      await set('appDir', appDir)

      const dbFileName =  appDir + '/' + 'bills.sqlite'

      await set('knex', {
        client: 'sqlite3',
        connection: {
          filename: dbFileName
        },
        migrations: {
          tableName: 'migrations',
          directory: './sql/migrations'
        },
        seeds: {
          directory: './sql/seeds'
        },
        useNullAsDefault: true // see http://knexjs.org/#Builder-insert
      })

      if (! await exists(dbFileName)) {
        await setupDb()
      }

      await ensureFolderExists(appDir + BILL_FOLDER_SUFFIX)

      ipcRenderer.send('onboarding-finished')
    } catch (err) {
      notifications.addNotification({
        message: err,
        level: 'error',
        position: 'tc'
      })
    }
  }

  render() {
    return (
      <div>
        <h2>{t('Willkommen bei Billy!')}</h2>
        <img src="../../static/images/accountants.png" />

        <FormComponent finish={this.finishSetup.bind(this)} />
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

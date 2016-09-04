import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import t from '../common/helpers/i18n'
import { set } from '../common/providers/settingsProvider'
import { setupDb } from '../common/providers/dbProvider'
import { createFolder } from '../common/providers/fileProvider'
import { FormComponent, FormComponentValues } from './FormComponent'
const isDev = require('electron-is-dev')

export default class AppComponent extends React.Component<any, {}> {

  async finishSetup(values: FormComponentValues): Promise<any> {
    const appDir: string = values.folder
    await set('appDir', appDir)

    await set('knex', {
      client: 'sqlite3',
      connection: {
        filename: appDir + '/bills.sqlite'
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

    await setupDb()
    await createFolder(appDir + '/files')

    ipcRenderer.send('onboarding-finished')
  }

  render() {
    return (
      <div>
        <h2>{t('Willkommen bei Billy!')}</h2>
        <img src="../static/images/accountants.png" />

        <FormComponent finish={this.finishSetup.bind(this)} />
      </div>
    )
  }

}

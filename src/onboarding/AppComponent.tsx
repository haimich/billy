import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import t from '../common/helpers/i18n'
import { set } from '../common/repositories/settingsRepository'
import { FormComponent, FormComponentValues } from './FormComponent'

export default class AppComponent extends React.Component<any, {}> {

  async finish(values: FormComponentValues) {
    await set('appFolder', values.folder)

    await set('knex', {
      client: 'sqlite3',
      migrations: {
        tableName: 'migrations',
        directory: './sql/migrations'
      },
      seeds: {
        directory: './sql/seeds'
      },
      useNullAsDefault: true // see http://knexjs.org/#Builder-insert
    })

    ipcRenderer.send('onboarding-finished')
  }

  render() {
    return (
      <div>
        <h2>{t('Willkommen bei Billy!')}</h2>
        <img src="../static/images/accountants.png" />

        <FormComponent finish={this.finish.bind(this)} />
      </div>
    )
  }

}

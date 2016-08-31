import { get, set } from '../common/repositories/settingsRepository'
import { BrowserWindow } from 'electron'

export async function checkOnboardingRequired() {
  const appDir = await get('appDir')

  if (appDir == null || appDir === '') {
    return true
  } else {
    return false
  }
}

export async function startOnboarding(app_dir) {
  return new Promise((resolve, reject) => {
    let window = new BrowserWindow({ width: 410, height: 400 })
    window.loadURL(`file://${app_dir}/onboarding.html`)
  })

  // settings.defaults({
  //   knex: {
  //     client: 'sqlite3',
  //     migrations: {
  //       tableName: 'migrations',
  //       directory: './sql/migrations'
  //     },
  //     seeds: {
  //       directory: './sql/seeds'
  //     },
  //     useNullAsDefault: true // see http://knexjs.org/#Builder-insert
  //   }
  // })
  // if (isDev) {
  //   await set('knex.connection.filename', './bills.sqlite')
  // }

}
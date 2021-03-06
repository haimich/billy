/**
 * The electron-settings module saves settings to a location that fits the operating system.
 * @see https://www.npmjs.com/package/electron-settings
 */

import { isDev } from '../helpers/app';
const settings = require('electron-settings')

settings.configure({
  prettify: true
})

const DEV_CONFIG = {
  appDir: process.cwd(),
  knex: {
    client: 'sqlite3',
    connection: {
      filename: 'bills.sqlite'
    },
    migrations: {
      tableName: 'migrations',
      directory: './sql/migrations'
    },
    pool: {
      afterCreate: (conn, done) => conn.run('PRAGMA foreign_keys = ON', done) // see https://github.com/tgriesser/knex/issues/453
    },
    useNullAsDefault: true // see http://knexjs.org/#Builder-insert
  }
};

export async function userInputNeeded(): Promise<boolean> {
  const appDir = await get('appDir')

  if (appDir == null || appDir === '') {
    return true
  } else {
    return false
  }
}

type settingKeys = 'appDir' | 'knex'

export function get(value: settingKeys): Promise<any> {
  if (isDev) {
    return Promise.resolve(DEV_CONFIG[value])
  }

  return settings.get(value)
}

export function set(key: settingKeys, value: any): Promise<void> {
  if (isDev) {
    DEV_CONFIG[key] = value;
    return Promise.resolve(null)
  }

  return settings.set(key, value)
}

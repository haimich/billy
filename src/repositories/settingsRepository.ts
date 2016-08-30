/**
 * The electron-settings module saves settings to a location that fits the operating system.
 * @see https://www.npmjs.com/package/electron-settings
 */

const settings = require('electron-settings')
const isDev = require('electron-is-dev')

export function initSettings() {
  settings.configure({
    prettify: true
  })

  let test = settings.defaults({
    knex: {
      client: 'sqlite3',
      migrations: {
        tableName: 'migrations',
        directory: './sql/migrations'
      },
      seeds: {
        directory: './sql/seeds'
      },
      useNullAsDefault: true // see http://knexjs.org/#Builder-insert
    }
  })
}

export function get(value: string): Promise<string> {
  return settings.get(value)
}

export function set(key: string, value: any): Promise<string> {
  return settings.set(key, value)
}

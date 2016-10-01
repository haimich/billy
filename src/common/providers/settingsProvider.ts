/**
 * The electron-settings module saves settings to a location that fits the operating system.
 * @see https://www.npmjs.com/package/electron-settings
 */

const settings = require('electron-settings')

settings.configure({
  prettify: true
})

export async function userInputNeeded(): Promise<boolean> {
  const appDir = await get('appDir')

  if (appDir == null || appDir === '') {
    return true
  } else {
    return false
  }
}

type settingKeys = 'appDir' | 'knex' | 'windowSettings'

export function get(value: settingKeys): Promise<string> {
  return settings.get(value)
}

export function set(key: settingKeys, value: any): Promise<string> {
  return settings.set(key, value)
}

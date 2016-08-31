/**
 * The electron-settings module saves settings to a location that fits the operating system.
 * @see https://www.npmjs.com/package/electron-settings
 */

const settings = require('electron-settings')

settings.configure({
  prettify: true
})

export async function userInputNeeded(): Promise<boolean> {
  const appDir = await settings.get('appDir')

  if (appDir == null || appDir === '') {
    return true
  } else {
    return false
  }
}

export function get(value: string): Promise<string> {
  return settings.get(value)
}

export function set(key: string, value: any): Promise<string> {
  return settings.set(key, value)
}

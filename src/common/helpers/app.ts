import * as path from 'path'

export function isDev(): boolean {
  return require('electron-is-dev')
}

export function getAppFolder(): string {
  return path.join(__dirname, '../../../')
}
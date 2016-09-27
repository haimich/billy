import * as path from 'path'

export const isDev: boolean = (process.env['NODE_ENV'] === 'development')

export function getAppFolder(): string {
  return path.join(__dirname, '../../../')
}
import * as path from 'path'
import { env } from 'process'

export const isDev: boolean = (env['NODE_ENV'] === 'development')

export function getAppFolder(): string {
  return path.join(__dirname, '../../../')
}
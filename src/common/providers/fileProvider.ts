import { isMac, getPlatform } from '../helpers/platform'
import { get } from './settingsProvider'
import * as child_process from 'child_process'
import * as mkdirp from 'mkdirp'
import { stat } from 'fs'

export function open(fileName) {
  if (isMac()) {
    child_process.exec(`open "${fileName}"`, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }

      console.log('exec: ', stdout, stderr)
    })
  } else {
    console.warn('File open is not implemented on your platform: ' + getPlatform())
  }
}

export async function copyToBillDir(billId: string, inputFilePath: string): Promise<void> {
  // await ensureFolderExists()
  const appDir = await get('appDir')
  // return 'test'
}

export function ensureFolderExists(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function exists(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stat(path, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        resolve(true)
      }
    })
  })
}
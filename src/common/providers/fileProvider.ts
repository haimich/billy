import { isMac, getPlatform } from '../helpers/platform'
import { get } from './settingsProvider'
import * as child_process from 'child_process'
import * as mkdirp from 'mkdirp'

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

export async function copyToBillDir(billId: string, inputFilePath: string): Promise<any> {
  // await ensureFolderExists()
  const appDir = await get('appDir')
  return 'test'
}

export function ensureFolderExists(path: string): Promise<any> {
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
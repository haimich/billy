import { isMac, getPlatform } from '../helpers/platform'
import { get } from './settingsProvider'
import * as child_process from 'child_process'
import * as fs from 'fs'

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

export async function copyToAppDir(inputFilePath: string): Promise<any> {
  const appDir = get('appDir')
  return 'test'
}

export async function createFolder(path: string): Promise<any> {
  console.log('create ' + path)
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      console.log('done', err)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
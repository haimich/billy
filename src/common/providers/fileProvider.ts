import { isMac, getPlatform } from '../helpers/platform'
import { get } from './settingsProvider'
import * as mkdirp from 'mkdirp'
const openWithOs = require('open')
import { stat } from 'fs'
import { ncp } from 'ncp'
import { posix } from 'path'

export const BILL_FOLDER_SUFFIX = '/files'

export function open(fileName) {
  openWithOs(fileName)
}

export function copyToAppDir(billId: string, inputFilePath: string): Promise<string> {
  return get('appDir')
    .then((appDir) => {
      const targetFolder = `${appDir}${BILL_FOLDER_SUFFIX}/${billId}`
      return ensureFolderExists(targetFolder)
    })
    .then((targetFolder) => {
      const filename = posix.basename(inputFilePath)
      const targetFilePath = `${targetFolder}/${filename}`

      return new Promise((resolve, reject) => {
        ncp(inputFilePath, targetFilePath, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(targetFilePath)
          }
        })
      })
    })
}

/**
 * Checks if a folder exists, if not it creates it in a "mkdir -p" style.
 */
export function ensureFolderExists(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(path)
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
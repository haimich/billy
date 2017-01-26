import { isMac, getPlatform } from '../helpers/platform'
import { get } from './settingsProvider'
import * as mkdirp from 'mkdirp'
const openWithOs = require('open')
import { stat, readFile, writeFile } from 'fs'
import { posix } from 'path'
import * as rimraf from 'rimraf'
import FileModel from '../models/FileModel'

export const BILL_FOLDER_SUFFIX = 'bills'
export const EXPENSE_FOLDER_SUFFIX = 'expenses'

type availableFileTypes = 'bills' | 'expenses'

export function open(fileName) {
  openWithOs(fileName)
}

export async function copyToAppDir(folderName: string, inputFilePath: string, fileType: availableFileTypes): Promise<string> {
  if (! await exists(inputFilePath)) {
    throw new Error('The file does not exist: ' + inputFilePath)
  } else if (await isDirectory(inputFilePath)) {
    throw new Error('You can only store files, no directories')
  }

  const targetFolder = await ensureFolderExists(await getFilePath(folderName, fileType))

  const filename = posix.basename(inputFilePath)
  const targetFilePath = `${targetFolder}/${filename}`

  return await copyFile(inputFilePath, targetFilePath)
}

async function getFilePath(folderName: string, fileType: availableFileTypes): Promise<string> {
  const appDir = await get('appDir')
  let FOLDER_SUFFIX

  if (fileType === 'bills') {
    FOLDER_SUFFIX = BILL_FOLDER_SUFFIX
  } else if (fileType === 'expenses') {
    FOLDER_SUFFIX = EXPENSE_FOLDER_SUFFIX
  } else {
    throw new Error('Unsupported file type: ' + fileType)
  }

  return `${appDir}/files/${FOLDER_SUFFIX}/${encode(folderName)}`
}

export function encode(fileName: string): string {
  return fileName
    .replace(/ /g, '_')
    .replace(/\/|\\/g, '-')
    .replace(/<|>/g, '-')
    .replace(/:|;|\|/g, '-')
    .replace(/!|\?|\*/g, '-')
    .replace(/\n|\r|\t/g, '-')
}

function copyFile(inputFilePath, targetFilePath): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(inputFilePath, (err, data) => {
      if (err) reject(err)

      writeFile(targetFilePath, data, (err) => {
        if (err) reject(err)

        resolve(targetFilePath)
      });
    });
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

/**
 * Checks if a file or folder exists
 */
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

export async function deleteFile(file: FileModel): Promise<any> {
  return rmrf(await get('appDir') + file.path)
}

export async function deleteDir(folderName: string, fileType: availableFileTypes): Promise<any> {
  return rmrf(await getFilePath(folderName, fileType))
}

export function rmrf(filePattern: string): Promise<any> {
  return new Promise((resolve, reject) => {
    rimraf(filePattern, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function isDirectory(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stat(path, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats.isDirectory())
      }
    })
  })
}

import { isMac, getPlatform } from '../helpers/platform'
import * as child_process from 'child_process'

export function open(fileName) {
  if (isMac()) {
    child_process.exec('open ' + fileName, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }

      console.log('exec: ', stdout, stderr)
    })
  } else {
    console.warn('File open is not implemented on your platform: ' + getPlatform())
  }
}
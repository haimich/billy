import * as path from 'path' 

const MIN_PREFIX = 3
const SUFFIX_LENGTH = 3

export function shortenFilename(filename: string, length = 100): string {
  const name = path.parse(filename).name
  const extension = path.parse(filename).ext

  if (name.length < length) {
    return filename
  } else {
    const shortened = shortenText(name, length)

    if (shortened.length - SUFFIX_LENGTH >= MIN_PREFIX) {
      const prefix = shortened.substr(0, shortened.length - SUFFIX_LENGTH)
      const suffix = name.substr(name.length - SUFFIX_LENGTH, name.length)
      
      return prefix + '...' + suffix + extension
    } else {
      return shortened + '...' + extension
    }
  }
}

function shortenText(text: string, length): string {
  return text.substr(0, length)
}

export function stringIsEmpty(field): boolean {
  return field == null || field === ''
}
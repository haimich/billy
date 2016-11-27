import * as path from 'path' 

export function shortenFilename(filename: string, length = 100): string {
  const name = path.parse(filename).name
  const extension = path.parse(filename).ext

  if (name.length < length) {
    return filename
  } else {
    return shortenText(name, length) + '...' + extension
  }
}

function shortenText(text: string, length): string {
  return text.substr(0, length)
}
import FileModel from './FileModel'

interface FileActions<T> {
  keep?: T[]
  delete?: T[]
  add?: T[]
}

export default FileActions
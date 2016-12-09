import FileModel from './FileModel'

interface FileActions {
  keep?: FileModel[]
  delete?: FileModel[]
  add?: FileModel[]
}

export default FileActions
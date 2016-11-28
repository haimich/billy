import File from '../models/FileModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createFile(file: File): Promise<File> {
  return db('files')
    .insert(file)
    .then((rows) => {
      return getFileById(rows[0])
    })
}

export function getFileById(id: number): Promise<File> {
  return db('files')
    .where('id', id)
    .first()
}

export function deleteFileById(id: number): Promise<void> {
  return db('files')
    .delete()
    .where('id', id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return db('files')
    .delete()
    .where('path', 'like', pathPattern)
}
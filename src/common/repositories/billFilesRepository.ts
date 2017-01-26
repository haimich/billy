import BillFileModel from '../models/BillFileModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createFile(file: BillFileModel): Promise<BillFileModel> {
  return db('bill_files')
    .insert(file)
    .then((rows) => {
      return getFileById(rows[0])
    })
}

export function getFileById(id: number): Promise<BillFileModel> {
  return db('bill_files')
    .where('id', id)
    .first()
}

export function getFilesForBillId(id: number): Promise<BillFileModel[]> {
  return db('bill_files')
    .select('*')
    .where('bill_id', id)
}

export function deleteFileById(id: number): Promise<void> {
  return db('bill_files')
    .delete()
    .where('id', id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return db('bill_files')
    .delete()
    .where('path', 'like', pathPattern)
}

export function deleteAllFilesForBillId(id: number): Promise<void> {
  return db('bill_files')
    .delete()
    .where('bill_id', id)
}
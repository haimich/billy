import ExpenseFileModel from '../models/ExpenseFileModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createFile(file: ExpenseFileModel): Promise<ExpenseFileModel> {
  return db('expense_files')
    .insert(file)
    .then((rows) => {
      return getFileById(rows[0])
    })
}

export function getFileById(id: number): Promise<ExpenseFileModel> {
  return db('expense_files')
    .where('id', id)
    .first()
}

export function getFilesForExpenseId(id: number): Promise<ExpenseFileModel[]> {
  return db('expense_files')
    .select('*')
    .where('expense_id', id)
}

export function deleteFileById(id: number): Promise<void> {
  return db('expense_files')
    .delete()
    .where('id', id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return db('expense_files')
    .delete()
    .where('path', 'like', pathPattern)
}

export function deleteAllFilesForExpenseId(id: number): Promise<void> {
  return db('expense_files')
    .delete()
    .where('expense_id', id)
}
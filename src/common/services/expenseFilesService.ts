import ExpenseDbModel from '../models/ExpenseDbModel'
import ExpenseFileModel from '../models/ExpenseFileModel'
import FileActions from '../models/FileActionsModel'
import { copyToAppDir, deleteFile, deleteDir } from '../providers/fileProvider'
import * as filesRepo from '../repositories/expenseFilesRepository'

/**
 * Save all new files for an expense and remove files that are marked for deletion.
 */
export async function performExpenseFileActions(expense: ExpenseDbModel, fileActions: FileActions<ExpenseFileModel>) {
  if (fileActions.delete != null) {
    await Promise.all(
      fileActions.delete.map(file => del(file))
    )
  }

  if (fileActions.add != null) {
    await Promise.all(
      fileActions.add.map(file => save(expense.id, file))
    )
  }
}

async function save(expenseId: number, file: ExpenseFileModel): Promise<any> {
  const copiedFilePath = await copyToAppDir('' + expenseId, file.path, 'expenses')
  await createFile({ path: copiedFilePath, expense_id: expenseId })
}

async function del(file: ExpenseFileModel): Promise<any> {
  if (file.id == null) {
    throw new Error(`Could not delete file due to missing "id" field: ${file.expense_id} - ${file.path}`)
  }
  await deleteFileById(file.id)
  await deleteFile(file)
}

export function createFile(file: ExpenseFileModel): Promise<ExpenseFileModel> {
  return filesRepo.createFile(file)
}

export function getFileById(id: number): Promise<ExpenseFileModel> {
  return filesRepo.getFileById(id)
}

export function deleteFileById(id: number): Promise<void> {
  return filesRepo.deleteFileById(id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return filesRepo.deleteFilesByPathPattern(pathPattern)
}

export function getFilesForExpenseId(id: number): Promise<ExpenseFileModel[]> {
  return filesRepo.getFilesForExpenseId(id)
}

export async function deleteAllFilesForExpense(id: number): Promise<void> {
  await filesRepo.deleteAllFilesForExpenseId(id)
  await deleteDir('' + id, 'expenses')
}
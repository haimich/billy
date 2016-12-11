import BillDbModel from '../models/BillDbModel'
import FileModel from '../models/FileModel'
import FileActions from '../models/FileActions'
import { copyToAppDir, deleteFile } from '../providers/fileProvider'
import * as filesRepo from '../repositories/filesRepository'

/**
 * Save all new files for a bill and remove files that are marked for deletion.
 */
export async function performFileActions(bill: BillDbModel, fileActions: FileActions) {
  if (fileActions.add != null) {
    await Promise.all(
      fileActions.add.map(file => save(bill.invoice_id, bill.id, file))
    )
  }

  if (fileActions.delete != null) {
    await Promise.all(
      fileActions.delete.map(file => del(file))
    )
  }
}

async function save(invoiceId: string, billId: number, file: FileModel): Promise<any> {
  const copiedFilePath = await copyToAppDir(invoiceId, file.path)
  await createFile({ path: copiedFilePath, bill_id: billId })
}

async function del(file: FileModel): Promise<any> {
  await deleteFileById(file.id)
  await deleteFile(file)
}

export function createFile(file: FileModel): Promise<FileModel> {
  return filesRepo.createFile(file)
}

export function getFileById(id: number): Promise<FileModel> {
  return filesRepo.getFileById(id)
}

export function deleteFileById(id: number): Promise<void> {
  return filesRepo.deleteFileById(id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return filesRepo.deleteFilesByPathPattern(pathPattern)
}

export function getFilesForBillId(id: number): Promise<FileModel[]> {
  return filesRepo.getFilesForBillId(id)
}

export function deleteAllFilesForBillId(id: number): Promise<void> {
  return filesRepo.deleteAllFilesForBillId(id)
}
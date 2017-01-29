import BillDbModel from '../models/BillDbModel'
import BillFileModel from '../models/BillFileModel'
import FileActions from '../models/FileActions'
import { copyToAppDir, deleteFile, deleteDir } from '../providers/fileProvider'
import * as filesRepo from '../repositories/billFilesRepository'

/**
 * Save all new files for a bill and remove files that are marked for deletion.
 */
export async function performFileActions(bill: BillDbModel, fileActions: FileActions<BillFileModel>) {
  if (fileActions.delete != null) {
    console.log('delete yo');
    
    await Promise.all(
      fileActions.delete.map(file => del(file))
    )
  }

  if (fileActions.add != null) {
    await Promise.all(
      fileActions.add.map(file => save(bill.invoice_id, bill.id, file))
    )
  }
}

async function save(invoiceId: string, billId: number, file: BillFileModel): Promise<any> {
  const copiedFilePath = await copyToAppDir(invoiceId, file.path, 'bills')
  await createFile({ path: copiedFilePath, bill_id: billId })
}

async function del(file: BillFileModel): Promise<any> {
  if (file.id == null) {
    throw new Error(`Could not delete file due to missing "id" field: ${file.bill_id} - ${file.path}`)
  }
  await deleteFileById(file.id)
  await deleteFile(file)
}

export function createFile(file: BillFileModel): Promise<BillFileModel> {
  return filesRepo.createFile(file)
}

export function getFileById(id: number): Promise<BillFileModel> {
  return filesRepo.getFileById(id)
}

export function deleteFileById(id: number): Promise<void> {
  return filesRepo.deleteFileById(id)
}

export function deleteFilesByPathPattern(pathPattern: string): Promise<any> {
  return filesRepo.deleteFilesByPathPattern(pathPattern)
}

export function getFilesForBillId(id: number): Promise<BillFileModel[]> {
  return filesRepo.getFilesForBillId(id)
}

export async function deleteAllFilesForBill(billId: number, invoiceId: string): Promise<void> {
  await filesRepo.deleteAllFilesForBillId(billId)
  await deleteDir(invoiceId, 'bills')
}
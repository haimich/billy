import BillDbModel from '../models/BillDbModel'
import FileModel from '../models/FileModel'
import { copyToAppDir, deleteFile } from '../providers/fileProvider'
import { createFile, deleteFileById, getFilesForBillId } from '../repositories/filesRepository'

export async function saveFiles(bill: BillDbModel, files: FileModel[]) {
  const existingFiles = await getFilesForBillId(bill.id)

  await Promise.all(saveNewFiles(bill.invoice_id, files))
  await Promise.all(deleteObsoleteFiles(existingFiles, files))
}

function saveNewFiles(invoiceId, files): Promise<any>[] {
  return files
    .filter(file => file.id == null)
    .map(file => save(invoiceId, file))
}

async function save(invoiceId: string, file: FileModel): Promise<any> {
  const copiedFilePath = await copyToAppDir(invoiceId, file.path)
  await createFile({ path: copiedFilePath, bill_id: file.bill_id })
}

function deleteObsoleteFiles(existingFiles, files): Promise<any>[] {
  return existingFiles
    .filter(file => ! isIncluded(file.id, files))
    .map(del)
}

async function del(file: FileModel): Promise<any> {
  await deleteFileById(file.id)
  await deleteFile(file)
}

function isIncluded(fileId: number, files: FileModel[]): boolean {
  for (let file of files) {
    if (isExisting(file)) {
      if (file.id === fileId) {
        return true
      }
    }
  }

  return false
}

function isExisting(file: FileModel): boolean {
  return file.id != null
}
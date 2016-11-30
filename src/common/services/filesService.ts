import BillDbModel from '../models/BillDbModel'
import FileModel from '../models/FileModel'
import { copyToAppDir, deleteFile } from '../providers/fileProvider'
import { createFile, deleteFileById, getFilesForBillId } from '../repositories/filesRepository'

export async function saveFiles(bill: BillDbModel, files: FileModel[]) {
  await Promise.all(saveNewFiles(bill.invoice_id, files))

  const existingFiles = await getFilesForBillId(bill.id)
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
  const fileIds = files.reduce((ids, file) => (ids[file.id] = true, ids), {})
  return existingFiles
    .filter(file => ! fileIds[file.id])
    .map(del)
}

async function del(file: FileModel): Promise<any> {
  await deleteFileById(file.id)
  await deleteFile(file)
}
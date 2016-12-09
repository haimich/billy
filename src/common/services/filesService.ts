import BillDbModel from '../models/BillDbModel'
import FileModel from '../models/FileModel'
import FileActions from '../models/FileActions'
import { copyToAppDir, deleteFile } from '../providers/fileProvider'
import { createFile, deleteFileById, getFilesForBillId } from '../repositories/filesRepository'

export async function saveFiles(bill: BillDbModel, fileActions: FileActions) {
  if (fileActions.add != null) {
    await Promise.all(
      fileActions.add.map(file => save(bill.invoice_id, file))
    )
  }

  if (fileActions.delete != null) {
    await Promise.all(
      fileActions.delete.map(file => del(file))
    )
  }
}

async function save(invoiceId: string, file: FileModel): Promise<any> {
  const copiedFilePath = await copyToAppDir(invoiceId, file.path)
  await createFile({ path: copiedFilePath, bill_id: file.bill_id })
}

async function del(file: FileModel): Promise<any> {
  await deleteFileById(file.id)
  await deleteFile(file)
}

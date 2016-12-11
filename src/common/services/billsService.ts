import BillDbModel from '../models/BillDbModel'
import * as billsRepo from '../repositories/billsRepository'
import * as filesRepo from '../repositories/filesRepository'

/**
 * Return a list of all bills with files.
 */
export async function listBills(): Promise<BillDbModel[]> {
  let bills = await billsRepo.listBills()

  return await Promise.all(bills.map(addFiles))
}

async function addFiles(bill: BillDbModel): Promise<BillDbModel> {
  let files = await filesRepo.getFilesForBillId(bill.id)

  return Object.assign(bill, {
    files
  })
}

/**
 * Return a single bill with its files.
 */
export async function getBillByInvoiceId(invoiceId: string): Promise<BillDbModel> {
  let bill = await billsRepo.getBillByInvoiceId(invoiceId)
  
  return await addFiles(bill)
}
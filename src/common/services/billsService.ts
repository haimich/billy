import Bill from '../models/BillModel'
import BillDbModel from '../models/BillDbModel'
import * as billsRepo from '../repositories/billsRepository'
import * as filesRepo from '../repositories/billFilesRepository'

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

export function createBill(bill: Bill): Promise<BillDbModel> {
  return billsRepo.createBill(bill)
}

export function updateBill(bill: Bill): Promise<BillDbModel> {
  return billsRepo.updateBill(bill)
}

export async function importBills(bills): Promise<any> {
  return billsRepo.importBills(bills)
}

export async function deleteBillByInvoiceId(invoiceId: string): Promise<any> {
  return billsRepo.deleteBillByInvoiceId(invoiceId)
}

export function billExists(invoiceId: string): Promise<boolean> {
  return billsRepo.billExists(invoiceId)
}

export function deleteBillsByInvoiceIdPattern(idPattern: string): Promise<any> {
  return billsRepo.deleteBillsByInvoiceIdPattern(idPattern)
}

export function deleteAll(): Promise<any> {
  return billsRepo.deleteAll()
}
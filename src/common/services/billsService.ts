import Bill from '../models/BillModel'
import BillDbModel from '../models/BillDbModel'
import * as billsRepo from '../repositories/billsRepository'
import * as filesRepo from '../repositories/billFilesRepository'
import * as billItemsRepo from '../repositories/billItemsRepository'

/**
 * Return a list of all bills with files and items.
 */
export async function listBills(): Promise<BillDbModel[]> {
  let bills = await billsRepo.listBills()

  await Promise.all(bills.map(addFiles))
  return await Promise.all(bills.map(addBillItems))
}

/**
 * Return a single bill with its files and items.
 */
export async function getBillByInvoiceId(invoiceId: string): Promise<BillDbModel> {
  let bill = await billsRepo.getBillByInvoiceId(invoiceId)
  
  await addFiles(bill)
  return await addBillItems(bill)
}

async function addFiles(bill: BillDbModel): Promise<BillDbModel> {
  let files = await filesRepo.getFilesForBillId(bill.id)

  return Object.assign(bill, {
    files
  })
}

async function addBillItems(bill: BillDbModel): Promise<BillDbModel> {
  let items = await billItemsRepo.getBillItemsByBillId(bill.id)

  return Object.assign(bill, {
    items
  })
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
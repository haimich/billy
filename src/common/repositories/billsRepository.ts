import Bill from '../models/BillModel'
import { get } from '../providers/settingsProvider'
import { initDb } from '../providers/dbProvider'

let db

export async function init(): Promise<any> {
  db = await initDb()
}

export function listBills(): Promise<any> {
  return db('bills')
    .select('*')
    .orderBy('date_created')
}

export function createBill(bill: Bill): Promise<any> {
  return db('bills')
    .insert(bill)
}

export function updateBill(bill: Bill): Promise<any> {
  return db('bills')
    .update({
      amount: bill.amount,
      customer: bill.customer,
      date_created: bill.date_created,
      date_paid: bill.date_paid,
      comment: bill.comment,
      file_path: bill.file_path
    })
    .where('id', bill.id)
}

export function deleteBillsByIds(billIds): Promise<any> {
  return db('bills')
    .delete()
    .whereIn('id', billIds)
}
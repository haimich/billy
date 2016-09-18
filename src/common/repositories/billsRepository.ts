import Customer from '../models/CustomerModel'
import Bill from '../models/BillModel'
import BillDbModel from '../models/BillDbModel'
import { get } from '../providers/settingsProvider'
import { initDb } from '../providers/dbProvider'

let db

export async function init(): Promise<any> {
  db = await initDb()
}

export function createBill(bill: Bill): Promise<number> {
  return db('bills')
    .insert(bill)
    .then(rows => rows[0])
}

export function getBill(id: number): Promise<BillDbModel> {
  return db('bills')
    .where('id', '=', `'id'`)
    .then((rows) => {
      debugger
    })
}

export function listBills(): Promise<BillDbModel[]> {
  return db.raw(`
    select
      b.id,
      b.date_created,
      b.date_paid,
      b.amount,
      b.comment,
      b.file_path,
      c.id as customer_id,
      c.name as customer_name,
      c.telephone as customer_telephone

      from bills b, customers c

      where b.customer_id = c.id
      order by b.date_created
  `).then((rows) => {
      return rows.map(row => {
        return {
          id: row.id,
          amount: row.amount,
          date_created: row.date_created,
          date_paid: row.date_paid,
          comment: row.comment,
          file_path: row.file_path,
          customer_name: row.customer_name,
          customer: {
            id: row.customer_id,
            name: row.customer_name,
            telephone: row.customer_telephone
          }
        }
      })
    })
}

export async function importBills(bills): Promise<any> {
  let failed: any = []
  let successful: any = []

  for (let bill of bills) {
    try {
      await createBill(bill)
    } catch (err) {
      failed.push(bill)
      continue
    }
    successful.push(bill)
  }

  return {
    failed,
    successful
  }
}

export function updateBill(bill: Bill): Promise<any> {
  return db('bills')
    .update({
      amount: bill.amount,
      customer_id: bill.customer_id,
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

export function deleteAll(): Promise<any> {
  return db('bills')
    .delete()
}
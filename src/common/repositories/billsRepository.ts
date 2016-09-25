import Customer from '../models/CustomerModel'
import Bill from '../models/BillModel'
import BillDbModel from '../models/BillDbModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function billExists(invoiceId: string): Promise<boolean> {
  return db('bills')
    .select('invoice_id')
    .where('invoice_id', invoiceId)
    .then(rows => rows.length === 0 ? false : true)
}

export function createBill(bill: Bill): Promise<BillDbModel> {
  return db('bills')
    .insert(bill)
    .then((rows) => {
      return getBillById(rows[0])
    })
}

export function updateBill(bill: Bill): Promise<BillDbModel> {
  return db('bills')
    .update({
      amount: bill.amount,
      customer_id: bill.customer_id,
      date_created: bill.date_created,
      date_paid: bill.date_paid,
      comment: bill.comment,
      file_path: bill.file_path
    })
    .where('invoice_id', bill.invoice_id)
    .then(() => {
      return getBillByInvoiceId(bill.invoice_id)
    })
}

function getBillById(id: number): Promise<BillDbModel> {
  return db.raw(`
    select
      b.invoice_id,
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
      and   b.id = ?
  `, [id])
    .then((rows) => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return Object.assign(rows[0], {
        customer: {
          id: rows[0].customer_id,
          name: rows[0].customer_name,
          telephone: rows[0].customer_telephone
        }
      })
    })
}

export function getBillByInvoiceId(invoiceId: string): Promise<BillDbModel> {
  return db.raw(`
    select
      b.invoice_id,
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
      and   b.invoice_id = ?
  `, [invoiceId])
    .then((rows) => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return Object.assign(rows[0], {
        customer: {
          id: rows[0].customer_id,
          name: rows[0].customer_name,
          telephone: rows[0].customer_telephone
        }
      })
    })
}

export function listBills(): Promise<BillDbModel[]> {
  return db.raw(`
    select
      b.invoice_id,
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
        return Object.assign(row, {
          customer: {
            id: row.customer_id,
            name: row.customer_name,
            telephone: row.customer_telephone
          }
        })
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

export function deleteBillByInvoiceId(invoiceId: string): Promise<any> {
  return db('bills')
    .delete()
    .where('invoice_id', invoiceId)
}

export function deleteBillsByInvoiceIdPattern(idPattern: string): Promise<any> {
  return db('bills')
    .delete()
    .where('invoice_id', 'like', idPattern)
}

export function deleteAll(): Promise<any> {
  return db('bills')
    .delete()
}
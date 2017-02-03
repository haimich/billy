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
    .insert({
      invoice_id: bill.invoice_id,
      customer_id: bill.customer_id,
      date_created: bill.date_created,
      date_paid: bill.date_paid,
      type_id: bill.type_id,
      comment: bill.comment
    })
    .then((rows) => {
      return getBillById(rows[0])
    })
}

export function updateBill(bill: Bill): Promise<BillDbModel> {
  return db('bills')
    .update({
      customer_id: bill.customer_id,
      date_created: bill.date_created,
      date_paid: bill.date_paid,
      type_id: bill.type_id,
      comment: bill.comment
    })
    .where('invoice_id', bill.invoice_id)
    .then(() => {
      return getBillByInvoiceId(bill.invoice_id)
    })
}

function getBillById(id: number): Promise<BillDbModel> {
  return db.raw(`
    select
      b.id,
      b.invoice_id,
      b.date_created,
      b.date_paid,
      b.comment,
      c.id as customer_id,
      c.name as customer_name,
      c.telephone as customer_telephone,
      bt.id as type_id,
      bt.type as type_name

      from bills b

      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN bill_types bt ON b.type_id = bt.id

      where b.id = ?
  `, [id])
    .then(rows => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return createBillDbModel(rows[0])
    })
}

export function getBillByInvoiceId(invoiceId: string): Promise<BillDbModel> {
  return db.raw(`
    select
      b.id,
      b.invoice_id,
      b.date_created,
      b.date_paid,
      b.comment,
      c.id as customer_id,
      c.name as customer_name,
      c.telephone as customer_telephone,
      bt.id as type_id,
      bt.type as type_name

      from bills b

      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN bill_types bt ON b.type_id = bt.id

      where b.invoice_id = ?
  `, [invoiceId])
    .then(rows => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return createBillDbModel(rows[0])
    })
}

export function listBills(): Promise<BillDbModel[]> {
  return db.raw(`
    select
      b.id,
      b.invoice_id,
      b.date_created,
      b.date_paid,
      b.comment,
      c.id as customer_id,
      c.name as customer_name,
      c.telephone as customer_telephone,
      bt.id as type_id,
      bt.type as type_name
      
      from bills b

      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN bill_types bt ON b.type_id = bt.id

      order by b.date_created
  `).then(rows => rows.map(createBillDbModel))
}

export async function importBills(bills): Promise<any> {
  let failed: any = []
  let successful: any = []

  for (let bill of bills) {
    try {
      await createBill(bill)
    } catch (err) {
      failed.push(err)
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

function createBillDbModel(row: any): BillDbModel {
  let bill: any = {
    id: row.id,
    invoice_id: row.invoice_id,
    date_created: row.date_created,
    date_paid: row.date_paid,
    comment: row.comment,
    customer_name: row.customer_name,
    customer: {
      id: row.customer_id,
      name: row.customer_name,
      telephone: row.customer_telephone
    }
  }

  if (row.type_id != null) {
    bill.type_name = row.type_name
    bill.type = {
      id: row.type_id,
      type: row.type_name
    }
  }
  
  return bill
}
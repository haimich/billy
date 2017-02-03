import BillItem from '../models/BillItem'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createBillItem(billItem: BillItem): Promise<BillItem> {
  return db('bill_items')
    .insert(billItem)
    .then((rows) => {
      return getBillItemById(rows[0])
    })
}

export function updateBillItem(billType: any): Promise<BillItem> {
  return db('bill_items')
    .update({
      position: billType.position,
      preTaxAmount: billType.preTaxAmount,
      taxrate: billType.taxrate,
      description: billType.description
    })
    .where('id', billType.id)
}

export function getBillItemById(id: number): Promise<BillItem> {
  return db('bill_items')
    .where('id', id)
    .first()
}

export function getBillItemsByBillId(billId: number): Promise<BillItem[]> {
  return db('bill_items')
    .select('*')
    .where('bill_id', billId)
    .orderBy('position', 'asc')
}

export function deleteBillItemById(id: number): Promise<void> {
  return db('bill_items')
    .delete()
    .where('id', id)
}

export function deleteBillItemByDescriptionPattern(descriptionPattern: string): Promise<void> {
  return db('bill_items')
    .delete()
    .where('description', 'like', descriptionPattern)
}

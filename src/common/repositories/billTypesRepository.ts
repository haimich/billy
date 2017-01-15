import BillType from '../models/BillTypeModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createBillType(billType: BillType): Promise<BillType> {
  return db('bill_types')
    .insert(billType)
    .then((rows) => {
      return getBillTypeById(rows[0])
    })
}

export function updateBillType(billType: BillType): Promise<BillType> {
  return db('bill_types')
    .update({
      type: billType.type
    })
    .where('id', billType.id)
}

export function getBillTypeById(id: number): Promise<BillType> {
  return db('bill_types')
    .where('id', id)
    .first()
}

export function listBillTypes(): Promise<BillType[]> {
  return db('bill_types')
    .select('*')
    .orderBy('type')
}

export function deleteBillTypeById(id: number): Promise<void> {
  return db('bill_types')
    .delete()
    .where('id', id)
}

export function deleteBillTypeByNamePattern(namePattern: string): Promise<void> {
  return db('bill_types')
    .delete()
    .where('type', 'like', namePattern)
}

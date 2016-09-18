import Bill from '../models/BillModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}


export function listCustomers(): Promise<string[]> {
  return db('customers')
    .select('*')
    .orderBy('name')
}
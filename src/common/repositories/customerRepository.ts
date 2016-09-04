import Bill from '../models/BillModel'
import { get } from '../providers/settingsProvider'
import { initDb } from '../providers/dbProvider'

let db

export async function init(): Promise<any> {
  db = await initDb()
}

export function listCustomers(): Promise<string[]> {
  return db('bills')
    .distinct('customer')
    .select()
    .then(rows => rows.map(row => row.customer).filter(el => el != null))
}
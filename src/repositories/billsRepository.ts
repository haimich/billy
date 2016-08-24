import * as knex from 'knex';
import Bill from '../models/BillModel'

const knexConfig = require('../../conf/development.js').knex
const db = knex(knexConfig)

export function listBills() {
	return db('bills').select('*').orderBy('date_created')
}

export function createBill(bill: Bill) {
	return db('bills').insert(bill)
}

import * as knex from 'knex';
import Bill from '../models/BillModel'

const knexConfig = require('../../conf/development.js').knex
const db = knex(knexConfig)

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
			comment: bill.comment
		})
		.where('id', bill.id)
}

export function deleteBillsByIds(billIds): Promise<any> {
	return db('bills')
		.delete()
		.whereIn('id', billIds)
}
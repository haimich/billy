import * as knex from 'knex';
const knexConfig = require('../../conf/development.js').knex;
const db = knex(knexConfig)

export function listBills() {
	return db('bills').select('*').orderBy('date_created');
}

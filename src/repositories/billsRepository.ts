import * as knex from 'knex';
const knexConfig = require('../../conf/development.js').knex;
console.log(knexConfig);
const db = knex(knexConfig)

export function listBills() {
	return db('bills').select('*').orderBy('created_at');
}

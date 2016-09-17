const customers = require('./customers.json')
const bills = require('./bills.json')

// Deletes ALL existing entries
exports.seed = (knex, Promise) => {
  return knex('bills').del()
    .then(() => knex('customers').del())
    .then(() => {
      return Promise.all(customers.map(customer => knex('customers').insert(customer)))
    })
    .then(() => {
      return Promise.all(bills.map(bill => knex('bills').insert(bill)))
    })
}

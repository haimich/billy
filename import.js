/**
 * This script can be used to import bills from a csv file into the database.
 *
 * Example: node import.js Rechnungen.csv
 */

const basicCSV = require('basic-csv')
const argv = require('minimist')(process.argv.slice(2))
const FILENAME = argv._[0]

const knex = require('knex')
const knexConfig = require('./conf/development.js').knex

const db = knex(knexConfig)

function createBill(record) {
  let bill = {
    id: '' + record[6],
    customer: record[5],
    amount: record[3],
    date_created: record[0],
    date_paid: record[1],
    comment: record[2]
  }

  bill.id = bill.id.replace(/\./g, '')
  bill.amount = bill.amount.replace('€', '')
  bill.amount = bill.amount.replace(/\./g, '')
  bill.amount = bill.amount.replace(',', '.')

  return bill;
}

function saveToDb(bill) {
  return db('bills').insert(bill)
}

basicCSV.readCSV(FILENAME, (error, rows) => {
  if (error != null) {
    console.log(err);
    process.exit(1);
  }

  Promise.all(
    rows
      .map(createBill)
      .map(saveToDb)
  ).then(() => {
      console.log('All done!')
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
});
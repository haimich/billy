const moment = require('moment')
const Chance = require('chance')
const chance = new Chance()

const NUMBER_OF_CUSTOMERS = 25
const NUMBER_OF_BILLS = 100
let counter = 1
let billTypes = ['Other', 'Translating', 'Interpreting']

let allBills

// Deletes ALL existing entries!
exports.seed = (knex, Promise) => {
  return knex('bills').del()
    .then(() => knex('bill_types').del())
    .then(() => knex('customers').del())
    .then(() => knex('bill_files').del())
    .then(() => {
      console.log('Creating customers')

      let promises = []
      for (let i = 0; i < NUMBER_OF_CUSTOMERS; i++) {
        promises.push(generateCustomer(knex))
      }
      return Promise.all(promises)
    })
    .then(() => {
      console.log('Creating bill types')

      let promises = []
      for (let type of billTypes) {
        promises.push(knex('bill_types').insert({ type }))
      }
      return Promise.all(promises)
    })
    .then(() => {
      console.log('Creating bills')

      let promises = []
      for (let i = 0; i < NUMBER_OF_BILLS; i++) {
        promises.push(generateBill(knex))
      }

      return Promise.all(promises)
    })
    .then(() => {
      return knex('bills').select('*')
    })
    .then((bills) => {
      allBills = bills

      console.log('Creating files')

      let promises = []

      for (let bill of allBills) {
        const filesToAdd = chance.natural({ min: 0, max: 3 })

        for (let i = 0; i < filesToAdd; i++) {
          promises.push(generateFile(bill.id, knex))
        }
      }

      return Promise.all(promises)
    })
    .then(() => {
      console.log('Creating bill articles')

      let promises = []

      for (let bill of allBills) {
        const articlesToAdd = chance.natural({ min: 0, max: 3 })

        for (let i = 0; i < articlesToAdd; i++) {
          promises.push(generateBillArticle(bill.id, i, knex))
        }
      }

      return Promise.all(promises)      
    })
}

function generateCustomer(knex) {
  const customer = {
    name: chance.name()
  }

  if (chance.bool()) {
    customer.telephone = chance.phone()
  }

  return knex('customers').insert(customer)
}

function generateBill(knex) {
  const createdDay = addZeroIfNecessary(chance.natural({ min: 1, max: 28 }))
  const createdMonth = addZeroIfNecessary(chance.natural({ min: 1, max: 12 }))
  const createdYear = addZeroIfNecessary(chance.natural({ min: 2013, max: 2017 }))
  const dateCreated = moment(`${createdYear}-${createdMonth}-${createdDay}`)

  const bill = {
    invoice_id: `${createdYear}/${counter++}`,
    date_created: dateCreated.format('YYYY-MM-DD'),
    customer_id: chance.natural({ min: 1, max: NUMBER_OF_CUSTOMERS }),
    comment: chance.paragraph(),
  }

  if (chance.bool()) {
    const daysToAdd = chance.natural({ min: 0, max: 90 })
    bill.date_paid = dateCreated.add(daysToAdd, 'days').format('YYYY-MM-DD')
  }

  if (chance.bool()) {
    bill.type_id = chance.natural({ min: 1, max: billTypes.length})
  }

  return knex('bills').insert(bill)
}

function generateFile(billId, knex) {
  return knex('bill_files').insert({
    bill_id: billId,
    path: '/foo/bla/' + chance.file()
  })
}

function generateBillArticle(billId, position, knex) {
  return knex('bill_articles')
    .insert({
      bill_id: billId,
      position: 0,
      preTaxAamount: Math.round(chance.floating({min: 0, max: 1500}) * 100) / 100,
      taxrate: chance.natural({ min: 1, max: 20 }),
      description: chance.word({length: 14})
    })
}

function addZeroIfNecessary(number) {
  let output = '' + number
  if (output.length === 1) {
    return '0' + output
  } else {
    return output
  }
}

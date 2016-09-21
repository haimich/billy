const moment = require('moment')
const Chance = require('chance')
const chance = new Chance()

const NUMBER_OF_CUSTOMERS = 25
const NUMBER_OF_BILLS = 100
let counter = 1

// Deletes ALL existing entries!
exports.seed = (knex, Promise) => {
  return knex('bills').del()
    .then(() => knex('customers').del())
    .then(() => {
      let promises = []
      for (let i = 0; i < NUMBER_OF_CUSTOMERS; i++) {
        promises.push(knex('customers').insert(generateCustomer()))
      }
      return Promise.all(promises)
    })
    .then(() => {
      let promises = []
      for (let i = 0; i < NUMBER_OF_BILLS; i++) {
        promises.push(knex('bills').insert(generateBill()))
      }
      return Promise.all(promises)
    })
}

function generateCustomer() {
  const customer = {
    name: chance.name()
  }

  if (chance.bool()) {
    customer.telephone = chance.phone()
  }

  return customer
}

function generateBill() {
  const createdDay = chance.natural({ min: 1, max: 28 })
  const createdMonth = chance.natural({ min: 1, max: 12 })
  const createdYear = chance.natural({ min: 2013, max: 2016 })

  const bill = {
    invoice_id: `${createdYear}/${counter++}`,
    date_created: moment(`${createdDay}-${createdMonth}-${createdYear}`, 'DD.MM.YYYY').format('DD.MM.YYYY'),
    customer_id: chance.natural({ min: 1, max: NUMBER_OF_CUSTOMERS }),
    amount: chance.floating({min: 0, max: 1500}),
    comment: chance.paragraph(),
  }

  if (chance.bool()) {
    bill.date_paid = moment(`${createdDay}-${createdMonth}-${createdYear - 1}`, 'DD.MM.YYYY').format('DD.MM.YYYY')
  }
  
  return bill
}
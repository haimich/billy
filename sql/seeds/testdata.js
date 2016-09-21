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
  const createdDay = addZeroIfNecessary(chance.natural({ min: 1, max: 28 }))
  const createdMonth = addZeroIfNecessary(chance.natural({ min: 1, max: 12 }))
  const createdYear = addZeroIfNecessary(chance.natural({ min: 2013, max: 2016 }))

  console.log(`${createdYear}-${createdMonth}-${createdDay}`)

  const bill = {
    invoice_id: `${createdYear}/${counter++}`,
    date_created: moment(`${createdYear}-${createdMonth}-${createdDay}`).format('YYYY-MM-DD'),
    customer_id: chance.natural({ min: 1, max: NUMBER_OF_CUSTOMERS }),
    amount: chance.floating({min: 0, max: 1500}),
    comment: chance.paragraph(),
  }

  if (chance.bool()) {
    console.log(`${createdYear - 1}-${createdMonth}-${createdDay}`)
    bill.date_paid = moment(`${createdYear - 1}-${createdMonth}-${createdDay}`).format('YYYY-MM-DD')
  }
  
  return bill
}

function addZeroIfNecessary(number) {
  let output = '' + number
  if (output.length === 1) {
    return '0' + output
  } else {
    return output
  }
}
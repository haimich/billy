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
    .then(() => {
      return knex('bills').select('*')
    })
    .then((bills) => {
      let promises = []

      for (let bill of bills) {
        const filesToAdd = chance.natural({ min: 0, max: 3 })

        for (let i = 0; i < filesToAdd; i++) {
          promises.push(knex('files').insert(generateFile(bill.id)))
        }
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
  const dateCreated = moment(`${createdYear}-${createdMonth}-${createdDay}`)

  const bill = {
    invoice_id: `${createdYear}/${counter++}`,
    date_created: dateCreated.format('YYYY-MM-DD'),
    customer_id: chance.natural({ min: 1, max: NUMBER_OF_CUSTOMERS }),
    amount: Math.round(chance.floating({min: 0, max: 1500}) * 100) / 100,
    comment: chance.paragraph(),
  }

  if (chance.bool()) {
    const daysToAdd = chance.natural({ min: 0, max: 90 })
    bill.date_paid = dateCreated.add(daysToAdd, 'days').format('YYYY-MM-DD')
  }

  return bill
}

function generateFile(billId) {
  return {
    bill_id: billId,
    path: '/foo/bla/' + chance.file()
  }    
}

function addZeroIfNecessary(number) {
  let output = '' + number
  if (output.length === 1) {
    return '0' + output
  } else {
    return output
  }
}

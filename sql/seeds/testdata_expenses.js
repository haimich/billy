const moment = require('moment')
const Chance = require('chance')
const chance = new Chance()

const NUMBER_OF_EXPENSES = 100
let counter = 1
let expenseTypes = ['Travelling Car', 'Travelling Train', 'Stamps', 'Accomodations', 'Others']

// Deletes ALL existing entries!
exports.seed = (knex, Promise) => {
  console.log('Creating expense types')

  let promises = []
  for (let type of expenseTypes) {
    promises.push(knex('expense_types').insert({ type }))
  }
  return Promise.all(promises)
    .then(() => {
      return knex('expenses').del()
        .then(() => {
          console.log('Creating expenses')

          let promises = []
          for (let i = 0; i < NUMBER_OF_EXPENSES; i++) {
            promises.push(knex('expenses').insert(generateExpense()))
          }
          return Promise.all(promises)
        })
    })
}

function generateExpense() {
  const createdDay = addZeroIfNecessary(chance.natural({ min: 1, max: 28 }))
  const createdMonth = addZeroIfNecessary(chance.natural({ min: 1, max: 12 }))
  const createdYear = addZeroIfNecessary(chance.natural({ min: 2013, max: 2017 }))
  const dateCreated = moment(`${createdYear}-${createdMonth}-${createdDay}`)

  const expense = {
    type_id: chance.natural({ min: 1, max: expenseTypes.length}),
    preTaxAmount: Math.round(chance.floating({min: 0, max: 1500}) * 100) / 100,
    taxrate: chance.natural({min: 1, max: 20}),
    date: dateCreated.format('YYYY-MM-DD'),
  }

  if (chance.bool()) {
    expense.comment = chance.paragraph()
  }

  return expense
}

function addZeroIfNecessary(number) {
  let output = '' + number
  if (output.length === 1) {
    return '0' + output
  } else {
    return output
  }
}

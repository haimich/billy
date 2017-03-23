const moment = require('moment')
const Chance = require('chance')
const chance = new Chance()

const NUMBER_OF_EXPENSES = 100
let counter = 1
let expenseTypes = ['Travelling Car', 'Travelling Train', 'Stamps', 'Accomodations', 'Others']

// Deletes ALL existing entries!
exports.seed = (knex, Promise) => {
  console.log('Creating expense types')

  let expenseTypesPromises = []
  for (let type of expenseTypes) {
    expenseTypesPromises.push(knex('expense_types').insert({ type }))
  }

  return knex('expenses').del()
    .then(() => knex('expense_types').del())
    .then(() => knex('expense_files').del())
    .then(() => Promise.all(expenseTypesPromises))
    .then(() => {
      console.log('Creating expenses')

      let promises = []
      for (let i = 0; i < NUMBER_OF_EXPENSES; i++) {
        promises.push(knex('expenses').insert(generateExpense()))
      }
      return Promise.all(promises)
    })
    .then(() => {
      return knex('expenses').select('*')
    })
    .then((allExpenses) => {
      console.log('Creating expense items')

      let promises = []
      for (let expense of allExpenses) {
        const articlesToAdd = chance.natural({ min: 1, max: 3 })

        for (let i = 0; i < articlesToAdd; i++) {
          promises.push(knex('expense_items').insert(generateExpenseItem(expense.id, i)))
        }
      }

      return Promise.all(promises)      
    })
}

function generateExpense() {
  const createdDay = addZeroIfNecessary(chance.natural({ min: 1, max: 28 }))
  const createdMonth = addZeroIfNecessary(chance.natural({ min: 1, max: 12 }))
  const createdYear = addZeroIfNecessary(chance.natural({ min: 2013, max: 2017 }))
  const dateCreated = moment(`${createdYear}-${createdMonth}-${createdDay}`)

  const expense = {
    type_id: chance.natural({ min: 1, max: expenseTypes.length}),
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

function generateExpenseItem(expenseId, i) {
  return {
    expense_id: expenseId,
    position: i,
    preTaxAmount: Math.round(chance.floating({min: 0, max: 1500}) * 100) / 100,
    taxrate: chance.natural({ min: 1, max: 20 }),
    description: chance.word({length: 14})
  }
}

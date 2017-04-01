let allExpenses

exports.up = (knex, Promise) => {
  return knex('expenses').select('*')
    .then(expenses => {
      allExpenses = expenses

      return knex.schema.createTable('expense_items', (table) => {
        table.increments('id').primary().notNullable()
        table.integer('expense_id').notNullable().references('id').inTable('expenses')
        table.integer('position').notNullable()
        table.decimal('preTaxAmount').notNullable()
        table.decimal('taxrate').notNullable()
        table.text('description')

        table.index('expense_id')
      })
    })
    .then(() => {
      // this is necessary BEFORE creating the expense items because knex
      // drops the expenses table and then recreates it (foreign key problem).
      console.log('Dropping "preTaxAmount" and "taxrate" columns in expenses')

      return knex.schema.table('expenses', table => {
        table.dropColumn('preTaxAmount')
        table.dropColumn('taxrate')
      })
    })
    .then(() => {
      console.log('Migrating ' + allExpenses.length + ' expenses to items')

      return Promise.all(
        allExpenses.map(expense => createExpenseItem(knex, expense))
      )
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('expense_items')
}

function createExpenseItem(knex, expense) {
  return knex('expense_items')
    .insert({
      expense_id: expense.id,
      position: 0,
      preTaxAmount: expense.preTaxAmount,
      taxrate: expense.taxrate,
      description: ''
    })
}
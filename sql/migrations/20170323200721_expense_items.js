exports.up = (knex, Promise) => {
  return knex.schema.createTable('expense_items', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('expense_id').notNullable().references('id').inTable('expenses')
    table.integer('position').notNullable()
    table.decimal('preTaxAmount').notNullable()
    table.decimal('taxrate').notNullable()
    table.text('description')

    table.index('expense_id')
  })
    .then(() => {
      return knex('expenses').select('*')
    })
    .then(expenses => {
      return Promise.all(
        expenses.map(createExpenseItem)
      )
    })
    .then(() => {
      return knex.schema.table('expenses', table => {
        table.dropColumn('preTaxAmount')
        table.dropColumn('taxrate')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('expense_items')
}

function createExpenseItem(expense) {
  return knex('expense_items')
    .insert({
      expense_id: expense.id,
      position: expense.position,
      preTaxAmount: expense.preTaxAmount,
      taxrate: expense.taxrate,
      description: ''
    })
}
exports.up = (knex, Promise) => {
  return knex.schema.createTable('expense_types', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('type').notNullable().unique()

    table.index('type')
  })
    .then(() => {
      return knex.schema.createTable('expenses', (table) => {
        table.increments('id').primary().notNullable()
        table.integer('type_id').references('id').inTable('expense_types').notNullable()
        table.decimal('preTaxAmount').notNullable()
        table.decimal('taxrate').notNullable()
        table.date('date').notNullable()
        table.text('comment')

        table.index('type')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('expenses')
    .then(() => {
      return knex.schema.dropTableIfExists('expense_types')
    })
}

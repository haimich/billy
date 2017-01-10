exports.up = (knex, Promise) => {
  return knex.schema.createTable('expenses', (table) => {
    table.increments('id').primary().notNullable()
    table.text('type').notNullable()
    table.decimal('preTaxAmount').notNullable()
    table.decimal('taxrate').notNullable()
    table.date('date').notNullable()

    table.index('type')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('expenses')
}

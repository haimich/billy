exports.up = (knex, Promise) => {
  return knex.schema.createTable('customers', (table) => {
    table.increments('id').primary().notNullable()
    table.text('name').notNullable()
    table.text('telephone')

    table.index(('name'))
  })
    .then(() => {
      return knex.schema.createTable('bills', (table) => {
        table.increments('id').primary().notNullable()
        table.text('invoice_id').unique().notNullable()
        table.integer('customer_id').references('id').inTable('customer').notNullable()
        table.decimal('amount').notNullable()
        table.date('date_created').notNullable()
        table.date('date_paid')
        table.text('comment')
        table.text('file_path')

        table.index('invoice_id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('customers')
    .then(() => knex.schema.dropTableIfExists('bills'))
}

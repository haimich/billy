exports.up = (knex, Promise) => {
  return knex.schema.createTable('customers', (table) => {
    table.increments('id').primary()
    table.text('name')
    table.text('telephone')

    table.index(('name'))
  })
    .then(() => {
      return knex.schema.createTable('bills', (table) => {
        table.text('id').primary()
        table.dateTime('date_created').defaultTo(knex.fn.now())
        table.dateTime('date_paid')
        table.integer('customer_id').references('id').inTable('customer')
        table.decimal('amount')
        table.text('comment')
        table.text('file_path')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('customers')
    .then(() => knex.schema.dropTableIfExists('bills'))
}

exports.up = (knex, Promise) => {
  return knex.schema.createTable('bill_types', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('type').notNullable().unique()

    table.index('type')
  })
    .then(() => {
      return knex.schema.table('bills', table => {
        table.integer('type_id').references('id').inTable('customers')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('bill_types')
    .then(() => {
      knex.schema.table('bills', table => {
        table.dropColumn('type')
      })
    })
}

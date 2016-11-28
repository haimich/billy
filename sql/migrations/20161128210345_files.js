exports.up = (knex, Promise) => {
  return knex.schema.createTable('files', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('bill_id').notNullable()
    table.text('path').notNullable()

    table.index(('bill_id'))
    table.unique(['bill_id', 'path'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('files')
}

exports.up = (knex, Promise) => {
  return knex.schema.renameTable('files', 'bill_files')
    .then(() => {
      return knex.schema.createTable('expense_files', (table) => {
        table.increments('id').primary().notNullable()
        table.integer('exepense_id').notNullable()
        table.text('path').notNullable()

        table.unique(['expense_id', 'path'])
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.renameTable('bill_files', 'files')
    .then(() => knex.schema.dropTableIfExists('expense_files'))
}

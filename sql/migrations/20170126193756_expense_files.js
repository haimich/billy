exports.up = (knex, Promise) => {
  return knex.schema.renameTable('files', 'bill_files')
    .then(() => {
      return knex.schema.createTable('expense_files', (table) => {
        table.increments('id').primary().notNullable()
        table.integer('expense_id').notNullable()
        table.text('path').notNullable()

        table.unique(['expense_id', 'path'])
      })
    })
    .then(() => {
      console.log('Move bill file paths to new location')

      return knex('bill_files').select('*')
    })
    .then((billFiles) => {
      return Promise.all(
        billFiles.map(billFile => fixPath(billFile, knex))
      )
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.renameTable('bill_files', 'files')
    .then(() => knex.schema.dropTableIfExists('expense_files'))
}

function fixPath(file, knex) {
  let newPath = file.path.replace('/billy/files/', '/billy/files/bills/')

  return knex('bill_files')
    .update('path', newPath)
    .where('id', file.id)
}
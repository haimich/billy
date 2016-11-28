exports.up = (knex, Promise) => {
  return knex.schema.createTable('files', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('bill_id').notNullable()
    table.text('path').notNullable()

    table.index(('bill_id'))
    table.unique(['bill_id', 'path'])
  })
    .then(() => {
      return knex('bills')
        .select('*')
    })
    .then((bills) => {
      let promises = []

      console.log(bills)

      for (let bill of bills) {
        if (bill.file_path == null || bill.file_path === '') {
          continue
        }

        console.log('Creating file for bill ' + bill.id + ' with path ' + bill.file_path)
        promises.push(knex('files').insert({
          bill_id: bill.id,
          path: bill.file_path
        }))
      }

      return Promise.all(promises)
    })
    .then(() => {
      console.log('Dropping column "file_path" in bills')

      return knex.schema.table('bills', (table) => {
        table.dropColumn('file_path')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('files')
}

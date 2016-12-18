exports.up = (knex, Promise) => {
  return knex.schema.createTable('files', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('bill_id').notNullable()
    table.text('path').notNullable()

    table.unique(['bill_id', 'path'])
  })
    .then(() => {
      return knex('bills')
        .select('*')
    })
    .then(bills => {
      let promises = []

      console.log(bills)

      for (let bill of bills) {
        if (bill.file_path == null || bill.file_path === '') {
          continue
        }

        // fix for https://github.com/haimich/billy/issues/46
        let correctedPath = bill.file_path.replace('.//', './')

        console.log('Creating file for bill ' + bill.id + ' with path ' + correctedPath)
        promises.push(knex('files').insert({
          bill_id: bill.id,
          path: correctedPath
        }))
      }

      return Promise.all(promises)
    })
    .then(() => {
      console.log('Dropping column "file_path" in bills')

      return knex.schema.table('bills', table => {
        table.dropColumn('file_path')

        // Due to a bug in knex.js we need to recreate the indexes (https://github.com/tgriesser/knex/issues/631)
        table.unique('invoice_id')
        table.index('invoice_id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('files')
}

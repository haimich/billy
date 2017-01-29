exports.up = (knex, Promise) => {
  return knex.schema.table('bills', table => {
    table.renameColumn('amount', 'preTaxAmount')
    table.decimal('taxrate').notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('bills', table => {
    table.renameColumn('preTaxAmount', 'amount')
  }).then(() => {
    return knex.schema.table('bills', table => {
      table.dropColumn('taxrate')
    })
  })
}

exports.up = function(knex, Promise) {
  return knex.schema.createTable('bills', function (table) {
    table.text('id').primary()
    table.dateTime('date_created').defaultTo(knex.fn.now())
    table.dateTime('date_paid')
    table.text('customer')
    table.decimal('amount')
    table.text('comment')
    table.text('file_path')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bills')
}

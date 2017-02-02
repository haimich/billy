exports.up = (knex, Promise) => {
  return knex.schema.createTable('bill_articles', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('bill_id').notNullable().references('id').inTable('bills')
    table.integer('position').notNullable()
    table.decimal('preTaxAamount').notNullable()
    table.decimal('taxrate').notNullable()
    table.text('description')

    table.index('bill_id')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('bill_articles')
}

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
    .then(() => {
      return knex('bills').select('*')
    })
    .then(bills => {
      return Promise.all(
        bills.map(createBillArticle)
      )
    })
    .then(() => {
      return knex.schema.table('bills', table => {
        table.dropColumn('amount')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('bill_articles')
}

function createBillArticle(bill) {
  return knex('bill_articles')
    .insert({
      bill_id: bill.id,
      position: 0,
      preTaxAmount: bill.amount,
      taxrate: 19,
      description: ''
    })
}
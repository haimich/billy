let allBills

exports.up = (knex, Promise) => {
  return knex('bills').select('*')
    .then(bills => {
      allBills = bills

      return knex.schema.createTable('bill_items', (table) => {
        table.increments('id').primary().notNullable()
        table.integer('bill_id').notNullable().references('id').inTable('bills')
        table.integer('position').notNullable()
        table.decimal('preTaxAmount').notNullable()
        table.decimal('taxrate').notNullable()
        table.text('description')

        table.index('bill_id')
      })
    })
    .then(() => {
      // this is necessary BEFORE creating the bill items because knex
      // drops the bills table and then recreates it (foreign key problem).
      console.log('Dropping "amount" column in bills')

      return knex.schema.table('bills', table => {
        table.dropColumn('amount')
      })
    })
    .then(() => {
      console.log('Migrating ' + allBills.length + ' bills to items')

      return Promise.all(
        allBills.map(bill => createBillArticle(knex, bill))
      )
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('bill_items')
}

function createBillArticle(knex, bill) {
  return knex('bill_items')
    .insert({
      bill_id: bill.id,
      position: 0,
      preTaxAmount: bill.amount,
      taxrate: 19,
      description: ''
    })
}
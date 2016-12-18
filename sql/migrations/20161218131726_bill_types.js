const TRANSLATE_REGEX = /übersetz/i
const TRANSLATE_CERTIFY_REGEX = /beglaubig.*übersetz/i
const INTERPRET_REGEX = /dolmetsch/i

exports.up = (knex, Promise) => {
  let billTypes = new Set()
  let bills

  console.log('Creating table bill_types')
  return knex.schema.createTable('bill_types', (table) => {
    table.increments('id').primary().notNullable()
    table.integer('type').notNullable().unique()

    table.index('type')
  })
    .then(() => {
      console.log('Adding column "type_id" and foreign key constraint to bills')

      return knex.schema.table('bills', table => {
        table.integer('type_id').references('id').inTable('bill_types')
      })
    })
    .then(() => {
      return knex('bills').select('*')
    })
    .then(result => {
      bills = result

      console.log('Getting available bill types from comment field')
      return getAvailableTypes(bills)
    })
    .then(types => {
      billTypes = types
      let promises = []

      for (let type of billTypes) {
        console.log('Creating type', type)
        promises.push(knex('bill_types').insert({type}))
      }

      return Promise.all(promises)
    })
    .then(typeIds => {
      let types = {}
      let billTypesIterator = billTypes.values();

      for (let i = 0; i < typeIds.length; i++) {
        let id = typeIds[i][0]
        types[billTypesIterator.next().value] = id
      }

      console.log('Adding types to existing bills')
      let promises = []
      for (let bill of bills) {
        promises.push(
          knex('bills')
            .update({
              type_id: types[getBillType(bill.comment)]
            })
            .where('id', bill.id)
        )
      }

      return Promise.all(promises)
    })
    .then(() => console.log('All done!'))
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('bill_types')
    .then(() => {
      return knex.schema.table('bills', table => {
        table.dropColumn('type')
      })
    })
}

function getAvailableTypes(bills) {
  let types = new Set()

  for (let bill of bills) {
    if (bill.comment == null || bill.comment === '') {
      continue
    }

    types.add(getBillType(bill.comment))
  }

  return types
}

function getBillType(text) {
  if (INTERPRET_REGEX.test(text)) {
    return 'Dolmetschen'
  } else if (TRANSLATE_CERTIFY_REGEX.test(text)) {
    return 'Beglaubigte Übersetzung'
  } else if (TRANSLATE_REGEX.test(text)) {
    return 'Übersetzung'
  } else {
    return 'Andere'
  }
}
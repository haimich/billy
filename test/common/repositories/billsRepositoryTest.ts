import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init, createBill, deleteBillsByIds, deleteBillsByIdPattern, getBill, listBills } from '../../../src/common/repositories/billsRepository'
const knexConfig = require('../../../../knexfile')
import * as chai from 'chai'

let expect = chai.expect
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await init(knexInstance)
})

after(async () => {
  await deleteBillsByIdPattern(PREFIX + '%')
})

describe('createBill', () => {
  it('should return the id of the created bill', async () => {
    const id = await createBill({
      id: PREFIX + '123',
      amount: 123.45,
      comment: 'bla',
      customer_id: 1,
      date_created: new Date()
    })

    expect(id).to.be.at.least(0)
  })
})
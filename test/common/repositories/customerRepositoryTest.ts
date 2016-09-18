import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init, createCustomer, listCustomers, deleteCustomerByNamePattern } from '../../../src/common/repositories/customerRepository'
import * as chai from 'chai'

const knexConfig = require('../../../../knexfile')

let expect = chai.expect
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await init(knexInstance)
})

afterEach(async () => {
  await deleteCustomerByNamePattern(PREFIX + '%')
})

describe('customersRepository', () => {

  describe('createCustomer', () => {
    it('should return the created customer', async () => {
      const customer = createCustomer({
        name: 'Hans Grohe',
        'telephone': '123/456 789'
      })
    })
  })

})
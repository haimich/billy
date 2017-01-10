import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init, getCustomerById, createCustomer, updateCustomer,
  listCustomers, deleteCustomerByNamePattern
} from '../../../src/common/repositories/customersRepository'
import { expect } from 'chai'

const knexConfig = require('../../../../knexfile')

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
      const customer = await createCustomer({
        name: PREFIX + 'Hans Grohe',
        telephone: '123/456 789'
      })

      expect(customer.name).to.equal(PREFIX + 'Hans Grohe')
      expect(customer.telephone).to.equal('123/456 789')
    })
  })

  describe('updateCustomer', () => {
    it('should update the customer', async () => {
      const customer = await createCustomer({
        name: PREFIX + 'the-name'
      })

      await updateCustomer({
        id: customer.id,
        name: PREFIX + 'the-updated-name',
        telephone: '12345'
      })

      const updatedCustomer = await getCustomerById(customer.id!)

      expect(updatedCustomer.name).to.equal(PREFIX + 'the-updated-name')
      expect(updatedCustomer.telephone).to.equal('12345')
    })
  })

  describe('listCustomers', () => {
    it('should return all customers sorted by name', async () => {
      const customers = await listCustomers()

      expect(customers.length).to.be.above(1)
      expect(customers[0].name <= customers[1].name).to.be.true
    })
  })

})
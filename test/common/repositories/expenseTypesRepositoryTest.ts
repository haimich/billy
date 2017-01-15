import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init, getExpenseTypeById, createExpenseType, updateExpenseType,
  listExpenseTypes, deleteExpenseTypeByNamePattern
} from '../../../src/common/repositories/expenseTypesRepository'
import { expect } from 'chai'

const knexConfig = require('../../../../knexfile')

const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await init(knexInstance)
})

afterEach(async () => {
  await deleteExpenseTypeByNamePattern(PREFIX + '%')
})

describe('expenseTypesRepository', () => {

  describe('createExpenseType', () => {
    it('should return the created expenseType', async () => {
      const expenseType = await createExpenseType({
        type: PREFIX + 'Briefmarken'
      })

      expect(expenseType.type).to.equal(PREFIX + 'Briefmarken')
    })
  })

  describe('updateExpenseType', () => {
    it('should update the expenseType', async () => {
      const expenseType = await createExpenseType({
        type: PREFIX + 'the-type'
      })

      await updateExpenseType({
        id: expenseType.id,
        type: PREFIX + 'the-updated-type'
      })

      const updatedExpenseType = await getExpenseTypeById(expenseType.id!)

      expect(updatedExpenseType.type).to.equal(PREFIX + 'the-updated-type')
    })
  })

  describe('listExpenseTypes', () => {
    it('should return all expense types sorted by name', async () => {
      const expenseTypes = await listExpenseTypes()

      expect(expenseTypes.length).to.be.above(1)
      expect(expenseTypes[0].type <= expenseTypes[1].type).to.be.true
    })
  })

})
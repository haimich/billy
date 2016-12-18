import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init, getBillTypeById, createBillType, updateBillType } from '../../../src/common/repositories/billTypesRepository'
import { listBillTypes, deleteBillTypeByNamePattern } from '../../../src/common/repositories/billTypesRepository'
import { expect } from 'chai'

const knexConfig = require('../../../../knexfile')

const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await init(knexInstance)
})

afterEach(async () => {
  await deleteBillTypeByNamePattern(PREFIX + '%')
})

describe('billTypesRepository', () => {

  describe('createBillType', () => {
    it('should return the created billType', async () => {
      const billType = await createBillType({
        type: PREFIX + 'Tanzschule'
      })

      expect(billType.type).to.equal(PREFIX + 'Tanzschule')
    })
  })

  describe('updateBillType', () => {
    it('should update the billType', async () => {
      const billType = await createBillType({
        type: PREFIX + 'the-type'
      })

      await updateBillType({
        id: billType.id,
        type: PREFIX + 'the-updated-type'
      })

      const updatedBillType = await getBillTypeById(billType.id!)

      expect(updatedBillType.type).to.equal(PREFIX + 'the-updated-type')
    })
  })

  describe('listBillTypes', () => {
    it('should return all bill types sorted by name', async () => {
      const billTypes = await listBillTypes()

      expect(billTypes.length).to.be.above(1)
      expect(billTypes[0].type <= billTypes[1].type).to.be.true
    })
  })

})
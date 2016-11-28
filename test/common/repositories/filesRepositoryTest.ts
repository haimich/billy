import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initFiles, createFile, deleteFileById, deleteFilesByPathPattern } from '../../../src/common/repositories/filesRepository'
import { init as initBills, createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/repositories/billsRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initBills(knexInstance)
  await initFiles(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteBillsByInvoiceIdPattern(PREFIX + '%')
})

describe('filesRepository', () => {
  let bill

  beforeEach(async () => {
    bill = await createBill({
      invoice_id: PREFIX + '/123',
      amount: 123,
      customer_id: 1,
      date_created: '2016-05-27'
    })
  })

  describe('createFile', () => {
    it('should return the created file', async () => {
      const file = await createFile({
        bill_id: bill.id,
        path: PREFIX + '/foo/bla.doc'
      })

      expect(file.path).to.equal(PREFIX + '/foo/bla.doc')
      expect(file.bill_id).to.equal(bill.id)
    })
  })

  describe('deleteFile', () => {
    it('should delete the file', async () => {
      const file = await createFile({
        bill_id: bill.id,
        path: PREFIX + '/foo/bla.doc'
      })

      await deleteFileById(file.id)

      expect(file.path).to.equal(PREFIX + '/foo/bla.doc')
      expect(file.bill_id).to.equal(bill.id)
    })
  })

})
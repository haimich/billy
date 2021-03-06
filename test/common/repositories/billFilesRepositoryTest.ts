import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initFiles, createFile, deleteFileById, deleteFilesByPathPattern, getFilesForBillId } from '../../../src/common/repositories/billFilesRepository'
import { init as initBills, createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/repositories/billsRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-billFilesRepositoryTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initBills(knexInstance)
  await initFiles(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern('%' + PREFIX + '%')
  await deleteBillsByInvoiceIdPattern(PREFIX + '%')
})

describe('billFilesRepository', () => {
  let bill

  beforeEach(async () => {
    bill = await createBill({
      invoice_id: PREFIX + '/123',
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

  describe('getFilesForBillId', () => {
    it('should return the files associated with the given bill ID', async () => {
      await createFile({
        bill_id: bill.id,
        path: PREFIX + '/foo/bar.doc'
      })
      await createFile({
        bill_id: bill.id,
        path: PREFIX + '/foo/baz.doc'
      })

      const files = await getFilesForBillId(bill.id)

      expect(files.length).to.equal(2)
      expect(files[0].path).to.equal(PREFIX + '/foo/bar.doc')
      expect(files[1].path).to.equal(PREFIX + '/foo/baz.doc')
    })
  })

})
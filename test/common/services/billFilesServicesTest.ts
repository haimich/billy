import { initDb } from '../../../src/common/providers/dbProvider'
import { rmrf, exists } from '../../../src/common/providers/fileProvider'
import { init as initFiles } from '../../../src/common/repositories/billFilesRepository'
import { init as initBills } from '../../../src/common/repositories/billsRepository'
import { createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/services/billsService'
import { createFile, deleteAllFilesForBill, deleteFilesByPathPattern, getFilesForBillId, performFileActions } from '../../../src/common/services/billFilesService'
import { expect } from 'chai'

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
  await rmrf(`./files/${PREFIX}*`)
})

const baseDir = '.'

describe('filesService', () => {

  let bill

  beforeEach(async () => {
    bill = await createBill({
      invoice_id: PREFIX + '-123',
      amount: 123,
      customer_id: 1,
      date_created: '2016-05-27'
    })
  })

  describe('saveFiles', () => {

    it('should add new files', async () => {
      expect(await getFilesForBillId(bill.id)).to.be.empty

      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` },
          { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
          { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(3)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/a.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[2].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

    it('should allow to add same file after it was previously removed', async () => {
      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      await performFileActions(bill, {
        delete: [
          (await getFilesForBillId(bill.id))[0]
        ]
      })

      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(1)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/a.txt`)
    })

    it('should allow to overwrite a file with a newer version of itself', async () => {
      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      await performFileActions(bill, {
        delete: [
          (await getFilesForBillId(bill.id))[0]
        ],
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(1)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/a.txt`)
    })

    it('should only change new files', async () => {
      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      let existingFiles = await getFilesForBillId(bill.id)
      expect(existingFiles.length).to.equal(1)

      await performFileActions(bill, {
        keep: [
          { bill_id: bill.id, path: `${baseDir}/files/${bill.invoice_id}/a.txt` }
        ],
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
          { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(3)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/a.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[2].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

    it('should delete obsolete files', async () => {
      await performFileActions(bill, {
        add: [
        { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
      ]})

      let existingFiles = await getFilesForBillId(bill.id)

      await performFileActions(bill, {
        delete: existingFiles,
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
          { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(2)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

  })

  describe('deleteAllFilesForBillId', () => {

    it('should delete all files for a bill', async () => {
      await performFileActions(bill, {
        add: [
          { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` },
          { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` }
        ]
      })

      await deleteAllFilesForBill(bill.id, bill.invoice_id)

      let existingFiles = await getFilesForBillId(bill.id)
      expect(existingFiles.length).to.equal(0)

      let folderExists = await exists(`${baseDir}/files/${bill.invoice_id}`)
      expect(folderExists).to.be.false
    })

  })

})
import { initDb } from '../../../src/common/providers/dbProvider'
import { rmrf } from '../../../src/common/providers/fileProvider'
import { init as initFiles, createFile, deleteFilesByPathPattern, getFilesForBillId } from '../../../src/common/repositories/filesRepository'
import { init as initBills, createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/repositories/billsRepository'
import { saveFiles } from '../../../src/common/services/filesService'
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

  describe.only('saveFiles', () => {

    const baseDir = './'

    it('should save files', async () => {
      expect(await getFilesForBillId(bill.id)).to.be.empty

      await saveFiles(bill, [
        { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` },
        { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
        { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
      ])

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(3)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/a.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[2].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

    it('should save only new files', async () => {
      await saveFiles(bill, [
        { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt`, id: 42 },
        { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
        { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
      ])

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(2)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

    it('should delete obsolete files', async () => {
      await saveFiles(bill, [
        { bill_id: bill.id, path: `${baseDir}/test/resources/a.txt` }
      ])

      await saveFiles(bill, [
        { bill_id: bill.id, path: `${baseDir}/test/resources/b.txt` },
        { bill_id: bill.id, path: `${baseDir}/test/resources/c.txt` }
      ])

      const existingFiles = await getFilesForBillId(bill.id)

      expect(existingFiles.length).to.equal(2)
      expect(existingFiles[0].path).to.equal(`${baseDir}/files/${bill.invoice_id}/b.txt`)
      expect(existingFiles[1].path).to.equal(`${baseDir}/files/${bill.invoice_id}/c.txt`)
    })

  })

})
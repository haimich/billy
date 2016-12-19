import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initBills } from '../../../src/common/repositories/billsRepository'
import { init as initFiles } from '../../../src/common/repositories/filesRepository'
import { createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/services/billsService'
import { createFile, deleteFilesByPathPattern } from '../../../src/common/services/filesService'
import { listBills, getBillByInvoiceId } from '../../../src/common/services/billsService'
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

describe('billsService', () => {

  describe('listBills', () => {
    it('should return all bills sorted by date_created with customer data', async () => {
      const bills = await listBills()

      expect(bills.length).to.be.above(1)
      expect(moment(bills[0].date_created).isBefore(moment(bills[1].date_created))).to.be.true
      expect(bills[0].customer).to.be.ok
      expect(bills[0].customer.id).to.be.ok
      expect(bills[0].customer_name).to.equal(bills[0].customer.name)
      expect(bills[0].files).to.be.ok
    })
  })

  describe('getBillByInvoiceId', () => {
    it('should return the bill that matches the invoice id', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '456',
        amount: 123.45,
        customer_id: 1,
        type_id: 1,
        date_created: moment().toISOString()
      })
      const result = await getBillByInvoiceId(PREFIX + '456')

      expect(result.invoice_id).to.equal(PREFIX + '456')
      expect(result.amount).to.equal(123.45)
      expect(result.files).to.be.ok
      expect(result.type).to.be.ok
      expect(result.type.id).to.be.ok
    })

    it('should return the bill that matches the invoice id including its files', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '456',
        amount: 123.45,
        customer_id: 1,
        type_id: 1,
        date_created: moment().toISOString()
      })
      await createFile({
        bill_id: bill.id,
        path: PREFIX + '/foo/bla.doc'
      })
      const result = await getBillByInvoiceId(PREFIX + '456')

      expect(result.invoice_id).to.equal(PREFIX + '456')
      expect(result.files.length).to.equal(1)
      expect(result.files[0].path).to.equal(PREFIX + '/foo/bla.doc')
      expect(result.type).to.be.ok
      expect(result.type.id).to.be.ok
    })
  })
})
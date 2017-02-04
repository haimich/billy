import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initBills } from '../../../src/common/repositories/billsRepository'
import { init as initFiles } from '../../../src/common/repositories/billFilesRepository'
import { init as initBillItems } from '../../../src/common/repositories/billItemsRepository'
import { createBill, deleteBillsByInvoiceIdPattern, listBills, getBillByInvoiceId } from '../../../src/common/services/billsService'
import { createFile, deleteFilesByPathPattern } from '../../../src/common/services/billFilesService'
import { createBillItem, deleteBillItemByDescriptionPattern } from '../../../src/common/services/billItemsService'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-billsServiceTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initBills(knexInstance)
  await initFiles(knexInstance)
  await initBillItems(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteBillItemByDescriptionPattern(PREFIX + '%')
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
        customer_id: 1,
        type_id: 1,
        date_created: moment().toISOString()
      })
      const result = await getBillByInvoiceId(PREFIX + '456')

      expect(result.invoice_id).to.equal(PREFIX + '456')
      expect(result.files).to.be.ok
      expect(result.type).to.be.ok
      expect(result.type.id).to.equal(1)
    })

    it('should return the bill that matches the invoice id including its files', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '456',
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

    it('should return the bill that matches the invoice id including its bill items', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '456',
        customer_id: 1,
        type_id: 1,
        date_created: moment().toISOString()
      })
      await createBillItem({
        bill_id: bill.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'desc'
      })
      await createBillItem({
        bill_id: bill.id,
        position: 1,
        preTaxAmount: 456,
        taxrate: 10,
        description: PREFIX + 'desc2'
      })
      const result = await getBillByInvoiceId(PREFIX + '456')

      expect(result.invoice_id).to.equal(PREFIX + '456')
      expect(result.items.length).to.equal(2)
      expect(result.items[0].position).to.equal(0)
      expect(result.items[0].preTaxAmount).to.equal(123.45)
      expect(result.items[0].taxrate).to.equal(19)
      expect(result.items[0].description).to.equal(PREFIX + 'desc')
      expect(result.items[1].position).to.equal(1)
      expect(result.items[1].preTaxAmount).to.equal(456)
      expect(result.items[1].taxrate).to.equal(10)
      expect(result.items[1].description).to.equal(PREFIX + 'desc2')
      expect(result.type).to.be.ok
      expect(result.type.id).to.be.ok
    })
  })
})
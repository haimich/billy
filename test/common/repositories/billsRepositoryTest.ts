import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initBills, billExists, listBills, getBillByInvoiceId } from '../../../src/common/repositories/billsRepository'
import { createBill, deleteBillByInvoiceId, deleteBillsByInvoiceIdPattern, updateBill } from '../../../src/common/repositories/billsRepository'
import { init as initFiles, createFile, deleteFilesByPathPattern } from '../../../src/common/repositories/filesRepository'
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

describe('billsRepository', () => {

  describe('billExists', () => {
    it('should return true if the bill exists', async () => {
      const invoiceId = PREFIX + '123'

      expect(await billExists(invoiceId)).to.be.false

      const testDate = moment().toISOString()

      const bill = await createBill({
        invoice_id: invoiceId,
        amount: 123.45,
        customer_id: 1,
        date_created: testDate
      })

      expect(await billExists(bill.invoice_id)).to.be.true
    })
  })

  describe('createBill', () => {
    it('should return the created bill', async () => {
      const testDate = moment().toISOString()

      const bill = await createBill({
        invoice_id: PREFIX + '123',
        amount: 123.45,
        comment: 'bla',
        customer_id: 1,
        date_created: testDate,
        date_paid: testDate
      })

      expect(bill.invoice_id).to.equal(PREFIX + '123')
      expect(bill.amount).to.equal(123.45)
      expect(bill.amount).to.equal(123.45)
      expect(bill.customer.id).to.equal(1)
      expect(bill.date_created).to.equal(testDate)
      expect(bill.date_paid).to.equal(testDate)
    })
  })

  describe('updateBill', () => {
    it('should update the bill', async () => {
      const testDate = moment().toISOString()

      await createBill({
        invoice_id: PREFIX + '123',
        amount: 123.45,
        comment: 'bla',
        customer_id: 1,
        date_created: testDate
      })

      const updatedBill = await updateBill({
        invoice_id: PREFIX + '123',
        amount: 11,
        comment: 'bla foo',
        customer_id: 1,
        date_created: testDate,
        date_paid: testDate
      })

      expect(updatedBill.amount).to.equal(11)
      expect(updatedBill.comment).to.equal('bla foo')
      expect(updatedBill.date_paid).to.equal(testDate)
    })
  })

  describe('listBills', () => {
    it('should return all bills sorted by date_created with customer data', async () => {
      const bills = await listBills()

      expect(bills.length).to.be.above(1)
      expect(moment(bills[0].date_created).isBefore(moment(bills[1].date_created))).to.be.true
      expect(bills[0].customer).to.be.ok
      expect(bills[0].customer_name).to.equal(bills[0].customer.name)
    })
  })

  describe('getBillByInvoiceId', () => {
    it('should return the bill that matches the invoice id', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '456',
        amount: 123.45,
        customer_id: 1,
        date_created: moment().toISOString()
      })
      const result = await getBillByInvoiceId(PREFIX + '456')

      expect(result.invoice_id).to.equal(PREFIX + '456')
      expect(result.amount).to.equal(123.45)
    })
  })

  describe('deleteBillByInvoiceId', () => {
    it('should delete the bills that match the invoice ids', async () => {
      const bill = await createBill({
        invoice_id: PREFIX + '123',
        amount: 123.45,
        customer_id: 1,
        date_created: moment().toISOString()
      })

      expect(await billExists(PREFIX + '123')).to.be.true
      
      const result = await deleteBillByInvoiceId(PREFIX + '123')

      expect(await billExists(PREFIX + '123')).to.be.false
    })
  })

})
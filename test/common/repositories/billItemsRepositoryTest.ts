import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init as initBillItems, getBillItemById, createBillItem, updateBillItem,
  getBillItemsByBillId, deleteBillItemByDescriptionPattern
} from '../../../src/common/repositories/billItemsRepository'
import { init as initBills, createBill, deleteBillsByInvoiceIdPattern } from '../../../src/common/repositories/billsRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')

const PREFIX = 'INTEGRATIONTEST-billItemsRepositoryTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initBillItems(knexInstance)
  await initBills(knexInstance)
})

afterEach(async () => {
  await deleteBillItemByDescriptionPattern(PREFIX + '%')
  await deleteBillsByInvoiceIdPattern(PREFIX + '%')
})

describe('billItemsRepository', () => {
  let bill

  beforeEach(async () => {
    bill = await createBill({
      invoice_id: PREFIX + '/123',
      customer_id: 1,
      date_created: '2016-05-27'
    })
  })

  describe('createBillItem', () => {
    it('should return the created billItem', async () => {
      const billItem = await createBillItem({
        bill_id: 1,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Tanzschule'
      })

      expect(billItem.position).to.equal(0)
      expect(billItem.preTaxAmount).to.equal(123.45)
      expect(billItem.taxrate).to.equal(19)
      expect(billItem.description).to.equal(PREFIX + 'Tanzschule')
    })
  })

  describe('updateBillItem', () => {
    it('should update the billItem', async () => {
      const billItem = await createBillItem({
        bill_id: bill.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Tanzschule'
      })

      await updateBillItem({
        id: billItem.id,
        description: PREFIX + 'the-updated-type'
      })

      const updatedBillItem = await getBillItemById(billItem.id!)

      expect(updatedBillItem.description).to.equal(PREFIX + 'the-updated-type')
    })
  })

  describe('getBillItemsByBillId', () => {
    it('should return all bill items for a bill sorted by position', async () => {
      const b = await createBill({
        invoice_id: PREFIX + '123',
        customer_id: 1,
        date_created: moment().toISOString()
      })
      
      const billItem1 = await createBillItem({
        bill_id: b.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Hinfahrt'
      })
      const billItem2 = await createBillItem({
        bill_id: b.id,
        position: 1,
        preTaxAmount: 456,
        taxrate: 10,
        description: PREFIX + 'Heimfahrt'
      })

      const billTypes = await getBillItemsByBillId(b.id)

      expect(billTypes).to.have.length(2)
      expect(billTypes[0].description).to.equal(PREFIX + 'Hinfahrt')
      expect(billTypes[1].description).to.equal(PREFIX + 'Heimfahrt')
    })
  })

})
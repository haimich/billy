import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init, createBill, listBills, deleteBillsByInvoiceIds, deleteBillsByInvoiceIdPattern, getBillByInvoiceId } from '../../../src/common/repositories/billsRepository'
import * as chai from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')

let expect = chai.expect
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await init(knexInstance)
})

after(async () => {
  await deleteBillsByInvoiceIdPattern(PREFIX + '%')
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
      date_paid: testDate,
      file_path: '/tmp/test.md'
    })

    expect(bill.invoice_id).to.equal(PREFIX + '123')
    expect(bill.amount).to.equal(123.45)
    expect(bill.amount).to.equal(123.45)
    expect(bill.customer_id).to.equal(1)
    expect(bill.date_created).to.equal(testDate)
    expect(bill.date_paid).to.equal(testDate)
    expect(bill.file_path).to.equal('/tmp/test.md')
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
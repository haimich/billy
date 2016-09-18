import { init, createBill, deleteAll, deleteBillsByIds, getBill, listBills } from '../../../src/common/repositories/billsRepository'
import * as chai from 'chai'

let expect = chai.expect

describe('createBill', () => {
  it('should return the id of the created bill', async () => {
    await init()
    const id = await createBill({
      amount: 123.45,
      comment: 'bla',
      customer_id: 1,
      date_created: new Date()
    })

    expect(id).to.be.at.least(0)
  })
})
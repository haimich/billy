import BillsStatsComponent from '../../src/stats/BillsStatsComponent'
import { expect } from 'chai'

describe('stats.BillsStatsComponent', () => {
  let component = null

  // beforeEach(() => {
  //   component = new BillsStatsComponent({
  //     customers: [{
  //       id: 123,
  //       name: 'Your momma'
  //     }],
  //     bills: [{
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2014-09-05',
  //       date_paid: '2015-11-05',
  //       comment: 'no comment'
  //     }],
  //     billTypes: [{
  //       id: 0,
  //       type: 'foo'
  //     }, {
  //       id: 1,
  //       type: 'bla'
  //     }]
  //   })
  // })
  
  // describe('getDaysToPay', () => {
  //   it('should return the days between date_created and date_paid', () => {
  //     const result = component.getDaysToPay({
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2014-09-05',
  //       date_paid: '2014-09-07'
  //     })
  //     expect(result).to.equal(2)
  //   })

  //   it('should work between months', () => {
  //     const result = component.getDaysToPay({
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2014-01-01',
  //       date_paid: '2014-02-15'
  //     })
  //     expect(result).to.equal(45)
  //   })

  //   it('should work between years', () => {
  //     const result = component.getDaysToPay({
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2014-01-01',
  //       date_paid: '2015-01-01'
  //     })
  //     expect(result).to.equal(365)
  //   })

  //   it('should return null if date_paid is an empty string', () => {
  //     const result = component.getDaysToPay({
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2016-12-01',
  //       date_paid: ''
  //     })
  //     expect(result).to.equal(null)
  //   })

  //   it('should return null if date_paid is undefined', () => {
  //     const result = component.getDaysToPay({
  //       invoice_id: 'foo/123',
  //       customer: {
  //         id: 123,
  //         name: 'Deine Mudda'
  //       },
  //       amount: 123.45,
  //       date_created: '2016-12-01'
  //     })
  //     expect(result).to.equal(null)
  //   })
  // })

  // describe('getTotalUnpaid', () => {
  //   const customer = {
  //     id: 123,
  //     name: 'Your momma'
  //   }
  //   const type = {
  //     id: 1,
  //     type: 'foo'
  //   }

  //   it('should return the sum of the unpaid bill amount', () => {
  //     component = new BillsStatsComponent({
  //       customers: [customer],
  //       bills: [{
  //         invoice_id: 'foo/123',
  //         type,
  //         customer,
  //         amount: 123.45,
  //         date_created: '2014-09-05'
  //       }, {
  //         invoice_id: 'foo/123',
  //         type,
  //         customer,
  //         amount: 50,
  //         date_created: '2014-09-05',
  //         date_paid: '2014-09-15'
  //       }]
  //     })
  //     component.state.selectedYear = '2014'
  //     component.state.selectedBillType = 'foo'
  //     component.state.billDateToUse = 'date_created'

  //     const result = component.getTotalUnpaid()
  //     expect(result).to.equal(123.45)
  //   })

  //   it('should return the rounded sum of all bill amounts', () => {
  //     component = new BillsStatsComponent({
  //       customers: [customer],
  //       bills: [{
  //         invoice_id: 'foo/123',
  //         type,
  //         customer,
  //         amount: 123.45,
  //         date_created: '2014-09-05'
  //       }, {
  //         invoice_id: 'foo/123',
  //         type,
  //         customer: {
  //           id: 123,
  //           name: 'Deine Mudda'
  //         },
  //         amount: 20.551,
  //         date_created: '2014-09-05'
  //       }]
  //     })

  //     component.state.selectedYear = '2014'
  //     component.state.selectedBillType = 'foo'
  //     component.state.billDateToUse = 'date_created'

  //     const result = component.getTotalUnpaid()
  //     expect(result).to.equal(144.00)
  //   })
  // })

  // describe('getTableData', () => {
  //   const customer = {
  //     id: 123,
  //     name: 'Your momma'
  //   }
  //   const type = {
  //     id: 1,
  //     type: 'foo'
  //   }

  //   it('should return a table row with the bill', () => {
  //     component.matchesFilters = () => true

  //     const result = component.getTableData()
  //     expect(result.length).to.equal(1)
  //     expect(result[0].total).to.equal(123.45)
  //     expect(result[0].billCount).to.equal(1)
  //     expect(result[0].averageTimeToPay).to.equal(426)
  //     expect(result[0].name).to.equal('Deine Mudda')
  //   })

  //   it('should return a table row for each customer', () => {
  //     component = new BillsStatsComponent({
  //       customers: [customer],
  //       bills: [{
  //         invoice_id: 'foo/123',
  //         type,
  //         customer,
  //         amount: 123.45,
  //         date_created: '2014-09-05',
  //         date_paid: '2014-09-09'
  //       }, {
  //         invoice_id: 'foo/123',
  //         type,
  //         customer,
  //         amount: 20.23,
  //         date_created: '2014-09-05',
  //         date_paid: '2014-09-13'
  //       }]
  //     })
  //     component.matchesFilters = () => true

  //     const result = component.getTableData()
  //     expect(result.length).to.equal(1)
  //     expect(result[0].total).to.equal(143.68)
  //     expect(result[0].billCount).to.equal(2)
  //     expect(result[0].averageTimeToPay).to.equal(6)
  //     expect(result[0].name).to.equal('Your momma')
  //   })

  //   it('should return a table row with the mean time to pay', () => {
  //     const theCustomer = { id: 123, name: 'Deine Mudda' }
  //     const theInvoiceId = 'foo/123'
  //     const theAmount = 123.45

  //     component = new BillsStatsComponent({
  //       customers: [theCustomer],
  //       bills: [{
  //         invoice_id: theInvoiceId,
  //         customer: theCustomer,
  //         amount: theAmount,
  //         date_created: '2016-02-26',
  //         date_paid: '2016-03-25'
  //       }, {
  //         invoice_id: theInvoiceId,
  //         customer: theCustomer,
  //         amount: theAmount,
  //         date_created: '2016-10-09',
  //         date_paid: '2016-10-13'
  //       }, {
  //         invoice_id: theInvoiceId,
  //         customer: theCustomer,
  //         amount: theAmount,
  //         date_created: '2016-12-01'
  //       }, {
  //         invoice_id: theInvoiceId,
  //         customer: theCustomer,
  //         amount: theAmount,
  //         date_created: '2016-02-13'
  //       }, {
  //         invoice_id: theInvoiceId,
  //         customer: theCustomer,
  //         amount: theAmount,
  //         date_created: '2016-09-17'
  //       }]
  //     })
  //     component.matchesFilters = () => true

  //     const result = component.getTableData()
  //     expect(result.length).to.equal(1)
  //     expect(result[0].total).to.equal(theAmount * 5)
  //     expect(result[0].billCount).to.equal(5)
  //     expect(result[0].averageTimeToPay).to.equal(16)
  //   })

  //   it('should return a table row with the mean time to pay for single customer', () => {
  //     const theCustomer = { id: 456, name: 'Dolmetscherbüro Deine Mudda' }

  //     component = new BillsStatsComponent({
  //       customers: [theCustomer],
  //       bills: [{
  //         invoice_id: '20112',
  //         customer: theCustomer,
  //         amount: 3495.00,
  //         date_created: '2011-04-16'
  //       }]
  //     })
  //     component.matchesFilters = () => true

  //     const result = component.getTableData()

  //     expect(result[0].averageTimeToPay).to.equal(0)
  //   })

  //   it('should return print out "0 days" if date_created = date_paid', () => {
  //     const theCustomer = { id: 456, name: 'Dolmetscherbüro Deine Mudda' }

  //     component = new BillsStatsComponent({
  //       customers: [theCustomer],
  //       bills: [{
  //         invoice_id: '20112',
  //         customer: theCustomer,
  //         amount: 3495.00,
  //         date_created: '2011-04-16',
  //         date_paid: '2011-04-16',
  //       }]
  //     })
  //     component.matchesFilters = () => true

  //     const result = component.getTableData()

  //     expect(result[0].averageTimeToPay).to.equal(0)
  //   })
  // })

})
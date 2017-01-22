import {
  getAmountsPerMonth, getAvailableYears, getLineChartData,
  getMonthNumbers, matchesType, matchesYear, getTotal } from '../../../src/common/ui/stats'
import BillDbModel from '../../../src/common/models/BillDbModel'
import ExpenseDbModel from '../../../src/common/models/ExpenseDbModel'
import { expect } from 'chai'

const CUSTOMER = {
  id: 123,
  name: 'Deine Mudda'
}

describe('stats', () => {
  let bills: BillDbModel[]
  let expenses: ExpenseDbModel[]

  beforeEach(() => {
    bills = [{
      id: 1,
      invoice_id: 'foo/123',
      customer: CUSTOMER,
      customer_name: CUSTOMER.name,
      amount: 123.45,
      date_created: '2014-09-05',
      date_paid: '2014-09-10',
      files: []
    }, {
      id: 2,
      invoice_id: 'foo/124',
      customer: CUSTOMER,
      amount: 123.45,
      customer_name: CUSTOMER.name,
      date_created: '2014-09-05',
      date_paid: '2015-01-15',
      files: []
    }]

    expenses = [{
      id: 1,
      preTaxAmount: 123,
      taxrate: 15,
      date: '2014-09-05'
    }, {
      id: 2,
      preTaxAmount: 123,
      taxrate: 15,
      date: '2014-09-05'
    }]
  })

  describe('getAvailableYears', () => {
    it('should return all date_paid years', () => {
      const result = getAvailableYears<BillDbModel>(bills, 'date_paid')
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal('2015')
      expect(result[1]).to.equal('2014')
    })

    it('should return all date_created years', () => {
      const result = getAvailableYears<BillDbModel>(bills, 'date_created')
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal('2014')
    })

    it('should return all date years', () => {
      const result = getAvailableYears<ExpenseDbModel>(expenses, 'date')
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal('2014')
    })
  })

  describe('getMonthNumbers', () => {
    it('should return the numbers from 1 to 12', () => {
      expect(getMonthNumbers()).to.deep.equal(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    })
  })

  describe('getAmountsPerMonth', () => {
    it('should return a list with the sum of all bill.date_paid amounts per month', () => {
      const bills = [{
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-09-05',
        date_paid: '2014-11-05',
        comment: 'no comment'
      }]

      const result = getAmountsPerMonth(bills, 'date_paid', 'amount', () => true)
      expect(result.length).to.equal(12) // the months

      expect(result[10]).to.equal('123.45')
    })

    it('should return a list with the sum of all bill.date_created amounts', () => {
      let bills = [{
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-09-05',
        date_paid: '2014-11-05',
        comment: 'no comment'
      }]

      const result = getAmountsPerMonth(bills, 'date_created', 'amount', () => true)
      expect(result.length).to.equal(12) // the months

      expect(result[8]).to.equal('123.45')
    })

    it('should return a list with the sum of all expense.date amounts', () => {
      let expenses = [{
        id: 1,
        preTaxAmount: 123,
        taxrate: 15,
        date: '2014-09-05'
      }, {
        id: 2,
        preTaxAmount: 123,
        taxrate: 15,
        date: '2014-09-21'
      }]

      const result = getAmountsPerMonth(expenses, 'date', 'preTaxAmount', () => true)
      expect(result.length).to.equal(12) // the months

      expect(result[8]).to.equal('246.00')
    })

    it('should return a list with the sum of all bill amounts', () => {
      let bills = [{
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2013-09-05',
        date_paid: '2014-01-01',
        comment: 'no comment'
      }, {
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 100.5,
        date_created: '2014-09-05',
        date_paid: '2014-11-05',
        comment: 'no comment'
      }, {
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 99.5,
        date_created: '2014-09-05',
        date_paid: '2014-11-05',
        comment: 'no comment'
      }]

      const result = getAmountsPerMonth(bills, 'date_paid', 'amount', () => true)
      expect(result.length).to.equal(12) // the months

      expect(result[0]).to.equal('123.45')
      expect(result[10]).to.equal('200.00')
    })
  })

  describe('matchesYear', () => {
    it('should return true if the date is in the same year', () => {
      const result = matchesYear('2016-02-28', '2016')
      expect(result).to.be.true
    })

    it('should return false if the date is not in the same year', () => {
      const result = matchesYear('2016-02-28', '2017')
      expect(result).to.be.false
    })  
  })

  describe('matchesType', () => {
    const customer = {
      id: 123,
      name: 'Deine Mudda'
    }

    it('should return true if the type matches the bill type', () => {
      const bill = {
        id: 1,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 123.45,
        type: {
          id: 0,
          type: 'foo'
        },
        date_created: '2014-01-01',
        files: []
      }

      expect(matchesType<BillDbModel>(bill, 'foo')).to.be.true
    })

    it('should return false if the type does not match the bill type', () => {
      const bill = {
        id: 1,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 123.45,
        type: {
          id: 1,
          type: 'bla'
        },
        date_created: '2014-01-01',
        files: []
      }

      expect(matchesType<BillDbModel>(bill, 'foo')).to.be.false
    })

    it('should return false if there is no bill type present', () => {
      const bill = {
        id: 1,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 123.45,
        date_created: '2014-01-01',
        files: []
      }

      expect(matchesType<BillDbModel>(bill, 'foo')).to.be.false
    })
  })


  describe('getTotal', () => {
    const customer = {
      id: 123,
      name: 'Your momma'
    }

    it('should return the sum of the bill amounts', () => {
      let bills = [{
        id: 1,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 123.45,
        date_created: '2014-09-05',
        files: []
      }]

      const result = getTotal<BillDbModel>(bills, 'amount', () => true)
      expect(result).to.equal(123.45)
    })

    it('should return the rounded sum of all bill amounts', () => {
      let bills = [{
        id: 1,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 123.45,
        date_created: '2014-09-05',
        files: []
      }, {
        id: 2,
        invoice_id: 'foo/123',
        customer,
        customer_name: customer.name,
        amount: 20.551,
        date_created: '2014-09-05',
        files: []
      }]

      const result = getTotal<BillDbModel>(bills, 'amount', () => true)
      expect(result).to.equal(144.00)
    })

    it('should return the rounded sum of all expense amounts', () => {
      let expenses = [{
        id: 1,
        preTaxAmount: 123.456,
        taxrate: 15,
        date: '2014-09-05'
      }, {
        id: 2,
        preTaxAmount: 123,
        taxrate: 15,
        date: '2014-09-21'
      }]

      const result = getTotal<ExpenseDbModel>(expenses, 'preTaxAmount', () => true)
      expect(result).to.equal(246.46)
    })
  })

})
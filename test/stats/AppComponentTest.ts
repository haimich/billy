import AppComponent from '../../src/stats/AppComponent'
import { expect } from 'chai'

describe('AppComponent', () => {
  let component = null

  beforeEach(() => {
    component = new AppComponent({
      customers: [{
        id: 123,
        name: 'Your momma'
      }],
      bills: [{
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-09-05',
        date_paid: '2015-11-05',
        comment: 'no comment'
      }],
      billTypes: [{
        id: 0,
        type: 'foo'
      }, {
        id: 1,
        type: 'bla'
      }]
    })
  })

  describe('getAvailableYears', () => {
    it('should return all date_paid years', () => {
      component.state.billDateToUse = 'date_paid'
      const result = component.getAvailableYears()
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal('2015')
    })

    it('should return all date_created years', () => {
      component.state.billDateToUse = 'date_created'
      const result = component.getAvailableYears()
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal('2014')
    })
  })

  describe('getDaysToPay', () => {
    it('should return the days between date_created and date_paid', () => {
      const result = component.getDaysToPay({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-09-05',
        date_paid: '2014-09-07'
      })
      expect(result).to.equal(2)
    })

    it('should work between months', () => {
      const result = component.getDaysToPay({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-01-01',
        date_paid: '2014-02-15'
      })
      expect(result).to.equal(45)
    })

    it('should work between years', () => {
      const result = component.getDaysToPay({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-01-01',
        date_paid: '2015-01-01'
      })
      expect(result).to.equal(365)
    })

    it('should return null if date_paid is an empty string', () => {
      const result = component.getDaysToPay({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2016-12-01',
        date_paid: ''
      })
      expect(result).to.equal(null)
    })

    it('should return null if date_paid is undefined', () => {
      const result = component.getDaysToPay({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2016-12-01'
      })
      expect(result).to.equal(null)
    })
  })

  describe('matchesYear', () => {
    it('should return true if the date is in the same year', () => {
      const result = component.matchesYear('2016-02-28', '2016')
      expect(result).to.be.true
    })

    it('should return false if the date is not in the same year', () => {
      const result = component.matchesYear('2016-02-28', '2017')
      expect(result).to.be.false
    })
  })

  describe('matchesBillType', () => {
    it('should return true if the type matches the bill type', () => {
      component.state.selectedBillType = 'foo'

      expect(component.matchesBillType({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        type: {
          id: 0,
          type: 'foo'
        },
        date_created: '2014-01-01'
      })).to.be.true
    })

    it('should return false if the type does not match the bill type', () => {
      component.state.selectedBillType = 'foo'

      expect(component.matchesBillType({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        type: {
          id: 1,
          type: 'bla'
        },
        date_created: '2014-01-01'
      })).to.be.false
    })

    it('should return true if there is no bill type selected', () => {
      component.state.selectedBillType = 'foo'

      expect(component.matchesBillType({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-01-01'
      })).to.be.false
    })

    it('should return false if the bill type is null', () => {
      component.state.selectedBillType = ''

      expect(component.matchesBillType({
        invoice_id: 'foo/123',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-01-01'
      })).to.be.true
    })
  })

  describe('getTotal', () => {
    const customer = {
      id: 123,
      name: 'Your momma'
    }

    it('should return the sum of the bill amount', () => {
      component = new AppComponent({
        customers: [customer],
        bills: [{
          invoice_id: 'foo/123',
          customer,
          amount: 123.45,
          date_created: '2014-09-05'
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTotal()
      expect(result).to.equal(123.45)
    })

    it('should return the rounded sum of all bill amounts', () => {
      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [{
          invoice_id: 'foo/123',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 123.45,
          date_created: '2014-09-05'
        }, {
          invoice_id: 'foo/123',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 20.551,
          date_created: '2014-09-05'
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTotal()
      expect(result).to.equal(144.00)
    })
  })

  describe('getTotalUnpaid', () => {
    const customer = {
      id: 123,
      name: 'Your momma'
    }

    it('should return the sum of the unpaid bill amount', () => {
      component = new AppComponent({
        customers: [customer],
        bills: [{
          invoice_id: 'foo/123',
          customer,
          amount: 123.45,
          date_created: '2014-09-05'
        }, {
          invoice_id: 'foo/123',
          customer,
          amount: 50,
          date_created: '2014-09-05',
          date_paid: '2014-09-15'
        }]
      })
      component.matchesYear = () => true
      component.matchesBillType = () => true

      const result = component.getTotalUnpaid()
      expect(result).to.equal(123.45)
    })

    it('should return the rounded sum of all bill amounts', () => {
      component = new AppComponent({
        customers: [customer],
        bills: [{
          invoice_id: 'foo/123',
          customer,
          amount: 123.45,
          date_created: '2014-09-05'
        }, {
          invoice_id: 'foo/123',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 20.551,
          date_created: '2014-09-05'
        }]
      })
      component.matchesYear = () => true
      component.matchesBillType = () => true

      const result = component.getTotalUnpaid()
      expect(result).to.equal(144.00)
    })
  })

  describe('getTableData', () => {
    it('should return a table row with the bill', () => {
      component.matchesFilters = () => true

      const result = component.getTableData()
      expect(result.length).to.equal(1)
      expect(result[0].total).to.equal(123.45)
      expect(result[0].billCount).to.equal(1)
      expect(result[0].averageTimeToPay).to.equal(426)
      expect(result[0].name).to.equal('Deine Mudda')
    })

    it('should return a table row for each customer', () => {
      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [{
          invoice_id: 'foo/123',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 123.45,
          date_created: '2014-09-05',
          date_paid: '2014-09-10'
        }, {
          invoice_id: 'foo/124',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 123.45,
          date_created: '2014-09-05',
          date_paid: '2014-09-15'
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTableData()
      expect(result.length).to.equal(1)
      expect(result[0].total).to.equal(246.90)
      expect(result[0].billCount).to.equal(2)
      expect(result[0].averageTimeToPay).to.equal(8)
      expect(result[0].name).to.equal('Deine Mudda')
    })

    it('should return a table row with the mean time to pay', () => {
      const theCustomer = { id: 123, name: 'Deine Mudda' }
      const theInvoiceId = 'foo/123'
      const theAmount = 123.45

      component = new AppComponent({
        customers: [theCustomer],
        bills: [{
          invoice_id: theInvoiceId,
          customer: theCustomer,
          amount: theAmount,
          date_created: '2016-02-26',
          date_paid: '2016-03-25'
        }, {
          invoice_id: theInvoiceId,
          customer: theCustomer,
          amount: theAmount,
          date_created: '2016-10-09',
          date_paid: '2016-10-13'
        }, {
          invoice_id: theInvoiceId,
          customer: theCustomer,
          amount: theAmount,
          date_created: '2016-12-01'
        }, {
          invoice_id: theInvoiceId,
          customer: theCustomer,
          amount: theAmount,
          date_created: '2016-02-13'
        }, {
          invoice_id: theInvoiceId,
          customer: theCustomer,
          amount: theAmount,
          date_created: '2016-09-17'
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTableData()
      expect(result.length).to.equal(1)
      expect(result[0].total).to.equal(theAmount * 5)
      expect(result[0].billCount).to.equal(5)
      expect(result[0].averageTimeToPay).to.equal(16)
    })

    it('should return a table row with the mean time to pay for single customer', () => {
      const theCustomer = { id: 456, name: 'Dolmetscherbüro Deine Mudda' }

      component = new AppComponent({
        customers: [theCustomer],
        bills: [{
          invoice_id: '20112',
          customer: theCustomer,
          amount: 3495.00,
          date_created: '2011-04-16'
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTableData()

      expect(result[0].averageTimeToPay).to.equal(0)
    })
  })

  describe('getLineChartData', () => {
    it('should return a list with the sum of all date_paid amounts', () => {
      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [{
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
      })
      component.matchesFilters = () => true

      component.state.billDateToUse = 'date_paid'
      const result = component.getLineChartData()
      expect(result.length).to.equal(12) // the months

      expect(result[10]).to.equal('123.45')
    })

    it('should return a list with the sum of all date_created amounts', () => {
      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [{
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
      })
      component.matchesFilters = () => true

      component.state.billDateToUse = 'date_created'
      const result = component.getLineChartData()
      expect(result.length).to.equal(12) // the months

      expect(result[8]).to.equal('123.45')
    })

    it('should return a list with the sum of all amounts', () => {
      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [{
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
      })
      component.matchesFilters = () => true

      component.state.billDateToUse = 'date_paid'
      const result = component.getLineChartData()
      expect(result.length).to.equal(12) // the months

      expect(result[0]).to.equal('123.45')
      expect(result[10]).to.equal('200.00')
    })
  })

  describe('getTypesPieChartData', () => {
    it('should return the number of bills for all types', () => {
      const typeA = {
        id: 0,
        type: 'foo'
      }
      const typeB = {
        id: 1,
        type: 'bla'
      }

      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [
          {
            invoice_id: 'foo/123',
            customer: {
              id: 123,
              name: 'Deine Mudda'
            },
            amount: 100,
            type: typeA,
            date_created: '2014-09-05',
            date_paid: '2014-09-05',
            comment: 'This was a foo auftrag'
          },
          {
            invoice_id: 'foo/124',
            customer: {
              id: 123,
              name: 'Deine Mudda'
            },
            type: typeB,
            amount: 100,
            date_created: '2014-09-05',
            date_paid: '2014-09-05',
            comment: 'This was a bla dolmetschen'
          }
        ],
        billTypes: [typeA, typeB]
      })
      component.state.selectedYear = '2014'
      component.matchesFilters = () => true
      component.matchesYear = () => true

      component.state.billDateToUse = 'date_paid'
      const result = component.getTypesPieChartData()
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(1)
      expect(result[1]).to.equal(1)
    })
  })

  describe('getTypesIncomePieChartData', () => {
    it('should return the amount of income for all types', () => {
      const typeA = {
        id: 0,
        type: 'foo'
      }
      const typeB = {
        id: 1,
        type: 'bla'
      }

      component = new AppComponent({
        customers: [{
          id: 123,
          name: 'Your momma'
        }],
        bills: [
          {
            invoice_id: 'foo/123',
            customer: {
              id: 123,
              name: 'Deine Mudda'
            },
            amount: 150,
            type: typeA,
            date_created: '2014-09-05',
            date_paid: '2014-09-05',
            comment: 'This was a foo auftrag'
          },
          {
            invoice_id: 'foo/124',
            customer: {
              id: 123,
              name: 'Deine Mudda'
            },
            type: typeB,
            amount: 200,
            date_created: '2014-09-05',
            date_paid: '2014-09-05',
            comment: 'This was a bla dolmetschen'
          }
        ],
        billTypes: [typeA, typeB]
      })
      component.state.selectedYear = '2014'
      component.matchesFilters = () => true

      component.state.billDateToUse = 'date_paid'
      const result = component.getTypesIncomePieChartData()
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(150)
      expect(result[1]).to.equal(200)
    })
  })
})
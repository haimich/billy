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
      }]
    })
  })

  describe('getAvailableYears', () => {
    it('should return all date_paid years', () => {
      const result = component.getAvailableYears('date_paid')
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal('2015')
    })

    it('should return all date_created years', () => {
      const result = component.getAvailableYears('date_created')
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

  describe('matchesType', () => {
    it('should return true if the text matches übersetzen', () => {
      expect(component.matchesType('Übersetzen und Lektorat Brazda 2016/2', 'Übersetzen')).to.be.true
      expect(component.matchesType('Übersetzung RO-DE Geburtsurkunde', 'Übersetzen')).to.be.true
      expect(component.matchesType('Beglaubigte Übersetzung RO-DE einer Geburtsurkunde', 'Übersetzen')).to.be.true
      expect(component.matchesType('Übersetzungen Deine Mudda FR-DE', 'Übersetzen')).to.be.true
    })

    it('should return true if the text matches dolmetschen', () => {
      expect(component.matchesType('bla foo Dolmetschen deine mudda', 'Dolmetschen')).to.be.true
    })
  })

  describe('getTotal', () => {
    it('should return the formatted sum of the bill amount', () => {
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
        }]
      })
      component.matchesFilters = () => true

      const result = component.getTotal()
      expect(result).to.equal('123,45')
    })

    it('should return the formatted and rounded sum of all bill amounts', () => {
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
      expect(result).to.equal('144,00')
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

      const result = component.getLineChartData('date_paid')
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

      const result = component.getLineChartData('date_created')
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

      const result = component.getLineChartData('date_paid')
      expect(result.length).to.equal(12) // the months

      expect(result[0]).to.equal('123.45')
      expect(result[10]).to.equal('200.00')
    })
  })

  describe('getTypesPieChartData', () => {
    it('should return the number of bills matching translating or interpreting', () => {
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
          date_created: '2014-09-05',
          date_paid: '2014-09-05',
          comment: 'This was a übersetzen auftrag'
        },
         {
          invoice_id: 'foo/124',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 100,
          date_created: '2014-09-05',
          date_paid: '2014-09-05',
          comment: 'This was a Dolmetsch-Auftrag dolmetschen'
        }
        ]
      })
      component.state.selectedYear = '2014'
      component.matchesFilters = () => true
      component.matchesYear = () => true

      const result = component.getTypesPieChartData('date_paid')
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(1)
      expect(result[1]).to.equal(1)
    })
  })

  describe('getTypesIncomePieChartData', () => {
    it('should return the amount of income for translating and interpreting', () => {
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
          amount: 100,
          date_created: '2014-09-05',
          date_paid: '2014-09-05',
          comment: 'This was a übersetzen auftrag'
        }, {
          invoice_id: 'foo/123',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 150,
          date_created: '2014-09-05',
          date_paid: '2014-09-05',
          comment: 'This was a Dolmetsch-Auftrag'
        }]
      })
      component.state.selectedYear = '2014'
      component.matchesFilters = () => true

      const result = component.getTypesIncomePieChartData('date_paid')
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(150)
      expect(result[1]).to.equal(100)
    })
  })

})
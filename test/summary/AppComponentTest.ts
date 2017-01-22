import AppComponent from '../../src/summary/AppComponent'
import { expect } from 'chai'
import t from '../../src/common/helpers/i18n'

describe('income.AppComponent', () => {
  let component = null

  beforeEach(() => {
    component = new AppComponent({
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
      }, {
        invoice_id: 'foo/124',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 123.45,
        date_created: '2014-09-05',
        date_paid: '2016-01-05',
        comment: 'no comment'
      }, {
        invoice_id: 'foo/126',
        customer: {
          id: 123,
          name: 'Deine Mudda'
        },
        amount: 100,
        date_created: '2014-09-05',
        date_paid: '2016-11-07',
        comment: 'no comment'
      }]
    })
  })

  describe('getAvailableYears', () => {
    it('should return all years that show up in bill.date_paid', () => {
      const result = component.getAvailableYears()
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal('2016')
      expect(result[1]).to.equal('2015')
    })
  })

  describe('getAvailableMonths', () => {
    it('should return all months for the given year that show up in bill.date_paid', () => {
      component.state = {
        selectedYear: '2016'
      }
      const result = component.getAvailableMonths()
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(t('Januar'))
      expect(result[1]).to.equal(t('November'))
    })
  })

  describe('matchesYear', () => {
    it('should return true if the date is in the selected year', () => {
      component.state = {
        selectedYear: '2016'
      }
      const result = component.matchesYear('2016-02-28')
      expect(result).to.be.true
    })

    it('should return false if the date is not in the selected year', () => {
      component.state = {
        selectedYear: '2016'
      }
      const result = component.matchesYear('2017-02-28')
      expect(result).to.be.false
    })
  })

  describe('matchesMonth', () => {
    it('should return true if the date is in the same month', () => {
      const result = component.matchesMonth('2016-02-28', t('Februar'))
      expect(result).to.be.true
    })

    it('should return false if the date is not in the same month', () => {
      const result = component.matchesMonth('2017-02-28', t('Januar'))
      expect(result).to.be.false
    })
  })

  describe('getTotalAmount', () => {
    const customer = {
      id: 123,
      name: 'Your momma'
    }

    it('should return the sum of the bill amount', () => {
      const result = component.getTotalAmount([{
        invoice_id: 'foo/123',
        customer,
        amount: 123.45,
        date_created: '2014-09-05'
      }])
      expect(result).to.equal('123,45 €')
    })

    it('should return the rounded sum of all bill amounts', () => {
      const result = component.getTotalAmount([{
        invoice_id: 'foo/123',
        customer,
        amount: 123.45,
        date_created: '2014-09-05'
      }, {
        invoice_id: 'foo/123',
        customer,
        amount: 20.551,
        date_created: '2014-09-05'
      }])
      expect(result).to.equal('144,00 €')
    })

  })

})
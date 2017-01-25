import AppComponent from '../../src/summary/AppComponent'
import { expect } from 'chai'
import t from '../../src/common/helpers/i18n'

describe('summary.AppComponent', () => {
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
        date_paid: '2014-11-07',
        comment: 'no comment'
      }],
      expenses: [{
        id: 1,
        preTaxAmount: 123,
        taxrate: 15,
        date: '2013-09-05'
      }, {
        id: 2,
        preTaxAmount: 123,
        taxrate: 15,
        date: '2014-10-05'
      }]
    })
  })

  describe('getTotalAvailableYears', () => {
    it('should return the merged list of available years of expenses and bills', () => {
      expect(component.getTotalAvailableYears()).to.deep.equal(['2016', '2015', '2014', '2013'])
    })

    it('should return the list of available years of bills if no expenses are available', () => {
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
        }],
        expenses: []
      })
      expect(component.getTotalAvailableYears()).to.deep.equal(['2016', '2015'])
    })

    it('should return the list of available years of expenses if no bills are available', () => {
      component = new AppComponent({
        bills: [],
        expenses: [{
          id: 1,
          preTaxAmount: 123,
          taxrate: 15,
          date: '2013-09-05'
        }, {
          id: 2,
          preTaxAmount: 123,
          taxrate: 15,
          date: '2014-09-05'
        }]
      })
      expect(component.getTotalAvailableYears()).to.deep.equal(['2014', '2013'])
    })
  })

  describe('getTotalAvailableMonths', () => {
    it('should return the merged list of available months of expenses and bills', () => {
      component = new AppComponent({
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
        }, {
          invoice_id: 'foo/124',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 123.45,
          date_created: '2014-09-05',
          date_paid: '2014-01-05',
          comment: 'no comment'
        }, {
          invoice_id: 'foo/126',
          customer: {
            id: 123,
            name: 'Deine Mudda'
          },
          amount: 100,
          date_created: '2014-09-05',
          date_paid: '2014-11-07',
          comment: 'no comment'
        }],
        expenses: [{
          id: 1,
          preTaxAmount: 123,
          taxrate: 15,
          date: '2014-09-05'
        }, {
          id: 2,
          preTaxAmount: 123,
          taxrate: 15,
          date: '2014-10-05'
        }]
      })
      component.state.selectedYear = '2014'
      expect(component.getTotalAvailableMonths()).to.deep.equal([t('Januar'), t('September'), t('Oktober'), t('November')])
    })
  })

})
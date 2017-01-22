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
        date_paid: '2016-11-07',
        comment: 'no comment'
      }]
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
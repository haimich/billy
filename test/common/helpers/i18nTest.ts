import t from '../../../src/common/helpers/i18n'
import * as chai from 'chai'

let expect = chai.expect

describe('i18n', () => {
  it('should return the given string', () => {
    const result = t('Rechnung')
    expect(result).to.equal('Rechnung')
  })

  it('should return the given string in singular form', () => {
    const result = t('Rechnung', { count: 1 })
    expect(result).to.equal('Rechnung')
  })

  it('should return the given string in plural form', () => {
    const result = t('Rechnung', { count: 2 })
    expect(result).to.equal('Rechnungen')
  })
})
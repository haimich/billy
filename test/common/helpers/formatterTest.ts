import { numberFormatterDb, numberFormatterView, dateFormatterView, dateFormatterDb, currencyFormatter } from '../../../src/common/helpers/formatters'
import { expect } from 'chai'

describe('formatters', () => {

  describe('convertToNumberDb', () => {
    it('should convert a string with digits to a number', () => {
      const result = numberFormatterDb('12345')
      expect(result).to.equal(12345)
    })

    it('should convert a string with a comma to a float', () => {
      const result = numberFormatterDb('123,45')
      expect(result).to.equal(123.45)
    })

    it('should convert a string with a dot to a float', () => {
      const result = numberFormatterDb('123.45')
      expect(result).to.equal(123.45)
    })
  })

  describe('convertToNumberView', () => {
    it('should convert a number to a string with digits', () => {
      const result = numberFormatterView(12345)
      expect(result).to.equal('12345,00')
    })

    it('should convert a float to a string with a comma', () => {
      const result = numberFormatterView(123.45)
      expect(result).to.equal('123,45')
    })

    it('should convert a float to a string with a comma', () => {
      const result = numberFormatterView(123.45)
      expect(result).to.equal('123,45')
    })
  })

  describe('dateFormatterView', () => {
    it('should convert a string to a formatted date', () => {
      const result = dateFormatterView('2008-02-01')
      expect(result).to.equal('01.02.2008')
    })
  })

  describe('dateFormatterDb', () => {
    it('should convert a string to a formatted date', () => {
      const result = dateFormatterDb('01.02.2008')
      expect(result).to.equal('2008-02-01')
    })
  })

  describe('currencyFormatter', () => {
    it('should convert a number to a string with currency', () => {
      const result = currencyFormatter(123.45)
      expect(result).to.equal('123,45 €')
    })
    it('should convert a number to a string with two fraction digits', () => { 
      expect(currencyFormatter(123)).to.equal('123,00 €')
      expect(currencyFormatter(123.4)).to.equal('123,40 €')
    })
  })

})
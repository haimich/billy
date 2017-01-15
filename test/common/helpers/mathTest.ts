import { round, getAverage, getNetAmount, getVatAmount, getTaxrate, getPreTaxAmount } from '../../../src/common/helpers/math'
import { expect } from 'chai'

describe.only('math', () => {

  describe('round', () => {
    it('should round a value to 2 decimals', () => {
      expect(round(123.4567)).to.equal(123.46)
    })

    it('should return a value without decimals', () => {
      expect(round(123)).to.equal(123)
    })

    it('should round a value to the given number of decimals', () => {
      expect(round(123.4567, 4)).to.equal(123.4567)
    })
  })

  describe('getAverage', () => {
    it('should round the average of a list of numbers', () => {
      expect(getAverage([5, 5])).to.equal(5)
    })

    it('should work with 1 number', () => {
      expect(getAverage([1])).to.equal(1)
    })
  })

  describe('getNetAmount', () => {
    it('should return the net amount of the given preTaxAmount', () => {
      let preTaxAmount = 123.45
      let taxrate = 10

      expect(getNetAmount(taxrate, preTaxAmount)).to.equal(112.23)
    })

    it('should return the net amount of the given preTaxAmount for large numbers', () => {
      let preTaxAmount = 123213412.99
      let taxrate = 19

      expect(getNetAmount(taxrate, preTaxAmount)).to.equal(103540683.18)
    })

    it('should return return the input value when the taxrate is 0', () => {
      let preTaxAmount = 123.45
      let taxrate = 0

      expect(getNetAmount(taxrate, preTaxAmount)).to.equal(123.45)
    })
  })

  describe('getPreTaxAmount', () => {
    it('should return the pre tax amount of the given taxrate and net amount', () => {
      let net = 100
      let taxrate = 10

      expect(getPreTaxAmount(taxrate, net)).to.equal(110)
    })

    it('should return the net amount when the taxrate is 0', () => {
      let net = 123.45
      let taxrate = 0

      expect(getPreTaxAmount(taxrate, net)).to.equal(123.45)
    })
  })

  describe('getVatAmount', () => {
    it('should return the vat amount of the given taxrate', () => {
      let preTaxAmount = 123.45
      let taxrate = 10

      expect(getVatAmount(taxrate, preTaxAmount)).to.equal(11.22)
    })

    it('should return the pre tax amount when the taxrate is 0', () => {
      let preTaxAmount = 123.45
      let taxrate = 0

      expect(getVatAmount(taxrate, preTaxAmount)).to.equal(123.45)
    })
  })

  describe('getTaxrate', () => {
    it('should return the taxrate of the given amounts', () => {
      let preTaxAmount = 123.45
      let vatAmount = 11.22

      expect(getTaxrate(preTaxAmount, vatAmount)).to.equal(10)
    })

    it('should return 0 when the amounts are the same', () => {
      let preTaxAmount = 123.45
      let vatAmount = preTaxAmount

      expect(getTaxrate(preTaxAmount, vatAmount)).to.equal(0)
    })
  })

})
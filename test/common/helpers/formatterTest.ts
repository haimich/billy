import { convertToNumber, dateFormatter } from '../../../src/common/helpers/formatters'
import * as chai from 'chai'

let expect = chai.expect

describe('convertToNumber', () => {
  it('should convert a string with digits to a number', () => {
    const result = convertToNumber('12345')
    expect(result).to.equal(12345)
  })

  it('should convert a string with a comma to a float', () => {
    const result = convertToNumber('123,45')
    expect(result).to.equal(123.45)
  })

  it('should convert a string with a dot to a float', () => {
    const result = convertToNumber('123.45')
    expect(result).to.equal(123.45)
  })
})

describe('dateFormatter', () => {
  it('should convert a string to a formatted date', () => {
    // const result = dateFormatter()
  })
})
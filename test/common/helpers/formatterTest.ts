import { convertToNumber } from '../../../src/common/helpers/formatters'
import * as chai from 'chai'

let expect = chai.expect

describe('convertToNumber', () => {
  it('convert a string with digits to a number', () => {
    const result = convertToNumber('12345')
    expect(result).to.equal(12345)
  })
})
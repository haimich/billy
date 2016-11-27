import { encode } from '../../../src/common/providers/fileProvider'
import { expect } from 'chai'

describe('encode', () => {
  it('should replace windows special characters with a - and _', () => {
    expect(encode('A nöt so!><?valid:; file-na/m\e\\')).to.equal('A_nöt_so----valid--_file-na-me-')

    expect(encode('\n\t\r')).to.equal('---')
  })
})
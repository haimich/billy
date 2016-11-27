import { shortenFilename } from '../../../src/common/helpers/text'
import { expect } from 'chai'

describe('text', () => {

  describe('shortenFilename', () => {
    it('should shorten a filename to 10 characters without loosing the extension', () => {
      const result = shortenFilename('bookmarks-2016-04-01bookmarks-2016-04-01bookmarks-2016-04-01bookmarks-2016-04-01bookmafoo.json', 10)
      expect(result).to.equal('bookmar...foo.json')
    })

    it('should not use "Mac shortening" when text is too small', () => {
      const result = shortenFilename('bookmarks.doc', 5)
      expect(result).to.equal('bookm....doc')
    })

    it('should not shorten a filename that is less than the given length', () => {
      const result = shortenFilename('bookmarks-2016.json', 100)
      expect(result).to.equal('bookmarks-2016.json')
    })
  })

})
import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Nodejs', function() {

  forSuite(this)

  const resultFileURL = 'http://foo.com/path/to/file.txt'

  const targetDirPath = 'test/path'
  const sourceFilePath = __filename
  const currentFileName = path.basename(__filename)

  describe('Upload', () => {

    it('uploads a file', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const fileStream = fs.createReadStream(sourceFilePath)

      await Backendless.Files.upload(fileStream, targetDirPath)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/${currentFileName}`,
        headers: {},
      })

      // getBoundary is a method of FormData (nodejs) instance
      expect(req1.body.getBoundary()).to.be.a('string')
    })

  })

})

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

    it('uploads a file instance of ReadStream with name', async () => {
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

    it('uploads a file instance of ReadStream with name in path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const fileStream = fs.createReadStream(sourceFilePath)

      await Backendless.Files.upload(fileStream, `${targetDirPath}/foo.png`)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/foo.png`,
        headers: {},
      })

      // getBoundary is a method of FormData (nodejs) instance
      expect(req1.body.getBoundary()).to.be.a('string')
    })

    it('uploads a file from URL', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })
      const req2 = prepareMockRequest({ fileURL: 'target-file-url-2' })

      const result1 = await Backendless.Files.upload('source-file-url-1', '/folder1/file1.jpg')
      const result2 = await Backendless.Files.upload('source-file-url-2', '/folder2/sub/file2.txt', true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/folder1/file1.jpg`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-1',
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/folder2/sub/file2.txt?overwrite=true`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-2',
        }
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
      expect(result2).to.be.eql({ fileURL: 'target-file-url-2' })
    })
  })

})

import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Browser', function() {

  forSuite(this)

  const resultFileURL = 'http://foo.com/path/to/file.txt'

  const filePath = 'test/path'
  const filePathWithSlash = '/test/path'
  const fileName = 'test-name.txt'
  const fileContent = 'test-content'

  let brokenFileContent

  let cleanupDom

  beforeEach(() => {
    cleanupDom = require('jsdom-global')()

    FormData.toString = () => 'function FormData'

    global.FileReader = class FileReader {
      readAsDataURL(content) {
        setTimeout(() => {
          if (content === brokenFileContent) {
            this.onerror(new Error('file is broken'))
          } else {
            const base64String = Buffer.from(fileContent).toString('base64')

            this.onload({ target: { result: `;base64,${base64String}` } })
          }
        }, 100)
      }
    }
  })

  afterEach(() => {
    cleanupDom()

    delete global.FileReader
  })

  describe('Save', () => {

    it('saves a file from File', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), fileName)

      const result1 = await Backendless.Files.saveFile(filePath, fileName, file)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })
    })

    it('saves a file from text', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.saveFile(filePath, fileName, 'test-content')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })
    })

    it('fails when file is broken', async () => {
      brokenFileContent = new Blob([])

      let error
      try {
        await Backendless.Files.saveFile(filePath, fileName, brokenFileContent)
      } catch (e) {
        error = e
      }

      expect(error.message).to.be.equal('file is broken')
    })

  })

  describe('Upload', () => {

    it('uploads a file instance of File with name', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), fileName)

      await Backendless.Files.upload(file, filePath)
      await Backendless.Files.upload(file, filePathWithSlash)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file')).to.be.equal(file)
    })

    it('uploads a file instance of File without name', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), null)

      await Backendless.Files.upload(file, `${filePath}/test-name.txt`)
      await Backendless.Files.upload(file, `${filePathWithSlash}/test-name.txt`)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file')).to.be.equal(file)
    })

    it('uploads a file instance of File and name in path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), 'file.jpg')

      await Backendless.Files.upload(file, `${filePath}/test-name.txt`)
      await Backendless.Files.upload(file, `${filePathWithSlash}/test-name.txt`)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file')).to.be.equal(file)
    })

    it('uploads a file instance of Blob without name', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const file = new Blob(Buffer.from('test-content'), { type: 'test-type' })

      await Backendless.Files.upload(file, `${filePath}/test-name.txt`)
      await Backendless.Files.upload(file, `${filePathWithSlash}/test-name.txt`)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file').type).to.be.equal('test-type')

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')
    })

    it('uploads a file with path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), '')
      file.path = `${filePath}/${fileName}`

      await Backendless.Files.upload(file, filePath)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)
    })

    it('uploads a file with overwrite', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const file = new File(Buffer.from('test-content'), fileName)

      await Backendless.Files.upload(file, filePath, true)
      await Backendless.Files.upload(file, filePath, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt?overwrite=true`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path/test-name.txt?overwrite=false`,
        headers: {},
      })
    })

    it('overwrites only when overwrite is boolean', async () => {
      const check = async overwrite => {
        const req1 = prepareMockRequest({ resultFileURL })

        const file = new File(Buffer.from('test-content'), fileName)

        await Backendless.Files.upload(file, filePath, overwrite)

        expect(req1.path).to.deep.include(`${APP_PATH}/files/test/path/test-name.txt`)
      }

      await check(0)
      await check(123)
      await check('')
      await check('str')
      await check(null)
      await check(undefined)
      await check({})
      await check([])
      await check(() => ({}))
    })

    it('fails when fileName is invalid', async () => {
      const errorMsg = 'Wrong type of the file source object. Can not get file name'

      const file1 = new File(Buffer.from('test-content'), '')

      await expect(Backendless.Files.upload(file1)).to.eventually.be.rejectedWith(errorMsg)
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

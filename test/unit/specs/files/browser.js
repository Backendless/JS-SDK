import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Browser', function() {

  forSuite(this)

  const resultFileURL = 'http://foo.com/path/to/file.txt'

  const directoryPath = 'test/path'
  const directoryPathWithSlash = '/test/path'
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

      const result1 = await Backendless.Files.saveFile(directoryPath, fileName, file)

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

      const result1 = await Backendless.Files.saveFile(directoryPath, fileName, 'test-content')

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
        await Backendless.Files.saveFile(directoryPath, fileName, brokenFileContent)
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

      await Backendless.Files.upload(file, directoryPath)
      await Backendless.Files.upload(file, directoryPathWithSlash)

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

      await Backendless.Files.upload(file, `${directoryPath}/test-name.txt`)
      await Backendless.Files.upload(file, `${directoryPathWithSlash}/test-name.txt`)

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

      await Backendless.Files.upload(file, `${directoryPath}/test-name.txt`)
      await Backendless.Files.upload(file, `${directoryPathWithSlash}/test-name.txt`)

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

      await Backendless.Files.upload(file, `${directoryPath}/test-name.txt`)
      await Backendless.Files.upload(file, `${directoryPathWithSlash}/test-name.txt`)

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
      file.path = `${directoryPath}/${fileName}`

      await Backendless.Files.upload(file, directoryPath)

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

      await Backendless.Files.upload(file, directoryPath, true)
      await Backendless.Files.upload(file, directoryPath, false)

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

        await Backendless.Files.upload(file, directoryPath, overwrite)

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

    it('uploads a file from URL without target fileName', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })
      const req2 = prepareMockRequest({ fileURL: 'target-file-url-2' })
      const req3 = prepareMockRequest({ fileURL: 'target-file-url-3' })

      const result1 = await Backendless.Files.upload('source-file-url-1/img.jpg', '/folder1/dir1')
      const result2 = await Backendless.Files.upload('source-file-url-2/img.jpg', 'folder1/dir2')
      const result3 = await Backendless.Files.upload('source-file-url-3/img.jpg', 'folder2', true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/folder1/dir1/img.jpg`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-1/img.jpg',
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/folder1/dir2/img.jpg`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-2/img.jpg',
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/folder2/img.jpg?overwrite=true`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-3/img.jpg',
        }
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
      expect(result2).to.be.eql({ fileURL: 'target-file-url-2' })
      expect(result3).to.be.eql({ fileURL: 'target-file-url-3' })
    })

  })

  describe('Append', () => {

    it('appends from a File with fileName and dirPath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)
      const req3 = prepareMockRequest(resultFileURL)
      const req4 = prepareMockRequest(resultFileURL)

      const file = new File(Buffer.from('test-content'), fileName)

      await Backendless.Files.append('/test1/path1/', 'test1.txt', file)
      await Backendless.Files.append('test2/path2/', 'test2.txt', file)
      await Backendless.Files.append('/test3/path3', 'test3.txt', file)
      await Backendless.Files.append('test4/path4', 'test4.txt', file)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test1/path1/test1.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test2/path2/test2.txt`,
        headers: {},
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test3/path3/test3.txt`,
        headers: {},
      })

      expect(req4).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test4/path4/test4.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file')).to.be.equal(file)

      expect(req3.body).to.be.instanceof(FormData)
      expect(req3.body.get('file')).to.be.equal(file)

      expect(req4.body).to.be.instanceof(FormData)
      expect(req4.body.get('file')).to.be.equal(file)
    })

    it('appends from a File with filePath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)

      const file = new File(Buffer.from('test-content'), fileName)

      await Backendless.Files.append('/test1/path1/test1.txt', file)
      await Backendless.Files.append('test2/path2/test2.txt', file)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test1/path1/test1.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test2/path2/test2.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req1.body.get('file')).to.be.equal(file)

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file')).to.be.equal(file)
    })

    it('appends from a ArrayBuffer with fileName and dirPath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)
      const req3 = prepareMockRequest(resultFileURL)
      const req4 = prepareMockRequest(resultFileURL)

      const file = new ArrayBuffer(16)

      const result1 = await Backendless.Files.append('/test1/path1/', 'test1.txt', file)
      const result2 = await Backendless.Files.append('test2/path2/', 'test2.txt', file)
      const result3= await Backendless.Files.append('/test3/path3', 'test3.txt', file)
      const result4 = await Backendless.Files.append('test4/path4', 'test4.txt', file)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test1/path1/test1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test2/path2/test2.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(req3).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test3/path3/test3.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(req4).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test4/path4/test4.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(result1).to.be.equal(resultFileURL)
      expect(result2).to.be.equal(resultFileURL)
      expect(result3).to.be.equal(resultFileURL)
      expect(result4).to.be.equal(resultFileURL)
    })

    it('appends from a ArrayBuffer with filePath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)

      const file = new ArrayBuffer(16)

      const result1 = await Backendless.Files.append('/test1/path1/test1.txt', file)
      const result2 = await Backendless.Files.append('test2/path2/test2.txt', file)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test1/path1/test1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/test2/path2/test2.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body:'dGVzdC1jb250ZW50',
      })

      expect(result1).to.be.equal(resultFileURL)
      expect(result2).to.be.equal(resultFileURL)
    })

    it('appends from a Blob with fileName and dirPath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)
      const req3 = prepareMockRequest(resultFileURL)
      const req4 = prepareMockRequest(resultFileURL)

      const file = new Blob(Buffer.from('test-content'), { type: 'test-type' })

      await Backendless.Files.append('/test1/path1/', 'test1.txt', file)
      await Backendless.Files.append('test2/path2/', 'test2.txt', file)
      await Backendless.Files.append('/test3/path3', 'test3.txt', file)
      await Backendless.Files.append('test4/path4', 'test4.txt', file)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test1/path1/test1.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test2/path2/test2.txt`,
        headers: {},
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test3/path3/test3.txt`,
        headers: {},
      })

      expect(req4).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test4/path4/test4.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')

      expect(req3.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')

      expect(req4.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')
    })

    it('appends from a Blob with filePath', async () => {
      const req1 = prepareMockRequest(resultFileURL)
      const req2 = prepareMockRequest(resultFileURL)

      const file = new Blob(Buffer.from('test-content'), { type: 'test-type' })

      await Backendless.Files.append('/test1/path1/test1.txt', file)
      await Backendless.Files.append('test2/path2/test2.txt', file)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test1/path1/test1.txt`,
        headers: {},
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/test2/path2/test2.txt`,
        headers: {},
      })

      expect(req1.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')

      expect(req2.body).to.be.instanceof(FormData)
      expect(req2.body.get('file').type).to.be.equal('test-type')
    })

  })
})

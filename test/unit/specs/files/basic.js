import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Basic', function() {

  forSuite(this)

  const resultFileURL = 'http://foo.com/path/to/file.txt'

  const dirPath = 'test/path'
  const filePathWithSlash = `/${dirPath}`
  const fileName = 'test-name.txt'
  const filePath = `${dirPath}/${fileName}`

  describe('Save', () => {

    it('saves a file from text', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.saveFile(dirPath, fileName, 'test-content')
      const result2 = await Backendless.Files.saveFile(filePathWithSlash, fileName, 'test-content')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

    it('saves a file from base64', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const B = global.Buffer
      delete global.Buffer

      const result1 = await Backendless.Files.saveFile(dirPath, fileName, 'dGVzdC1jb250ZW50')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })

      global.Buffer = B
    })

    it('saves a file from a buffer content', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.saveFile(dirPath, fileName, Buffer.from('test-content'))

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })
    })

    it('saves a file from text with overwrite', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.saveFile(dirPath, fileName, 'test-content', true)
      const result2 = await Backendless.Files.saveFile(dirPath, fileName, 'test-content', false)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt?overwrite=true`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/binary/test/path/test-name.txt?overwrite=false`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'dGVzdC1jb250ZW50' // === base64('test-content')
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

    it('overwrites only when overwrite is boolean', async () => {
      const check = async overwrite => {
        const req1 = prepareMockRequest({ resultFileURL })

        await Backendless.Files.saveFile(dirPath, fileName, 'test-content', overwrite)

        expect(req1.path).to.deep.include(`${APP_PATH}/files/binary/test/path/test-name.txt`)
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

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.saveFile()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when fileName is invalid', async () => {
      const errorMsg = 'File Name must be provided and must be a string.'

      await expect(Backendless.Files.saveFile(dirPath)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.saveFile(dirPath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Listing', () => {

    it('gets files list', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])
      const req2 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath)
      const result2 = await Backendless.Files.listing(filePathWithSlash)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
      expect(result2).to.be.eql([{ resultFileURL }])
    })

    it('gets files list with pattern', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath, '*.html')

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
    })

    it('gets files list with empty pattern', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath, '')

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
    })

    it('gets files list with [pattern, sub]', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])
      const req2 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath, '*.html', true)
      const result2 = await Backendless.Files.listing(dirPath, '*.html', false)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=false`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
      expect(result2).to.be.eql([{ resultFileURL }])
    })

    it('gets files list with [pattern, sub, pagesize]', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])
      const req2 = prepareMockRequest([{ resultFileURL }])
      const req3 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath, '*.html', true, 20)
      const result2 = await Backendless.Files.listing(dirPath, '*.html', true, -20)
      const result3 = await Backendless.Files.listing(dirPath, '*.html', true, 0)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true&pagesize=20`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true&pagesize=0`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
      expect(result2).to.be.eql([{ resultFileURL }])
      expect(result3).to.be.eql([{ resultFileURL }])
    })

    it('gets files list with [pattern, sub, pagesize, offset]', async () => {
      const req1 = prepareMockRequest([{ resultFileURL }])
      const req2 = prepareMockRequest([{ resultFileURL }])
      const req3 = prepareMockRequest([{ resultFileURL }])

      const result1 = await Backendless.Files.listing(dirPath, '*.html', true, 20, 100)
      const result2 = await Backendless.Files.listing(dirPath, '*.html', true, 20, -100)
      const result3 = await Backendless.Files.listing(dirPath, '*.html', true, 20, 0)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true&pagesize=20&offset=100`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true&pagesize=20`,
        headers: {},
        body   : undefined
      })

      expect(req3).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?pattern=*.html&sub=true&pagesize=20&offset=0`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql([{ resultFileURL }])
      expect(result2).to.be.eql([{ resultFileURL }])
      expect(result3).to.be.eql([{ resultFileURL }])
    })

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.listing()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.listing(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Count', () => {

    it('gets files count', async () => {
      const req1 = prepareMockRequest(123)
      const req2 = prepareMockRequest(123)

      const result1 = await Backendless.Files.getFileCount(dirPath)
      const result2 = await Backendless.Files.getFileCount(filePathWithSlash)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*&sub=false&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*&sub=false&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(123)
      expect(result2).to.be.eql(123)
    })

    it('gets files count with [pattern]', async () => {
      const req1 = prepareMockRequest(123)

      const result1 = await Backendless.Files.getFileCount(dirPath, '*.png')

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*.png&sub=false&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(123)
    })

    it('gets files count with [pattern, sub]', async () => {
      const req1 = prepareMockRequest(123)
      const req2 = prepareMockRequest(123)

      const result1 = await Backendless.Files.getFileCount(dirPath, '*.png', true)
      const result2 = await Backendless.Files.getFileCount(dirPath, '*.png', false)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*.png&sub=true&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*.png&sub=false&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(123)
      expect(result2).to.be.eql(123)
    })

    it('gets files count with [pattern, sub, countDirectories]', async () => {
      const req1 = prepareMockRequest(123)
      const req2 = prepareMockRequest(123)

      const result1 = await Backendless.Files.getFileCount(dirPath, '*.png', true, true)
      const result2 = await Backendless.Files.getFileCount(dirPath, '*.png', true, false)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*.png&sub=true&countDirectories=true`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path?action=count&pattern=*.png&sub=true&countDirectories=false`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(123)
      expect(result2).to.be.eql(123)
    })

    it('fails when filesPath is invalid', async () => {
      const errorMsg = '"filesPath" must be provided and must be a string.'

      await expect(Backendless.Files.getFileCount()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when pattern is invalid', async () => {
      const errorMsg = 'Files Pattern must be provided and must be a string.'

      await expect(Backendless.Files.getFileCount(dirPath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(dirPath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(dirPath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(dirPath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.getFileCount(dirPath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Rename', () => {
    it('renames a file', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.renameFile(`${dirPath}/${fileName}`, 'new-file-name.txt')
      const result2 = await Backendless.Files.renameFile(`${filePathWithSlash}/${fileName}`, 'new-file-name.txt')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/rename`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          newName    : 'new-file-name.txt',
          oldPathName: '/test/path/test-name.txt',
        }
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/rename`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          newName    : 'new-file-name.txt',
          oldPathName: '/test/path/test-name.txt',
        }
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

    it('fails when oldPathName is invalid', async () => {
      const errorMsg = '"oldPathName" must be provided and must be a string.'

      await expect(Backendless.Files.renameFile()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when newName is invalid', async () => {
      const errorMsg = 'New File Name must be provided and must be a string.'

      await expect(Backendless.Files.renameFile(dirPath)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.renameFile(dirPath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Move', () => {
    const sourcePath = 'old.txt'
    const targetPath = 'new-dir/new.txt'

    it('moves a file', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.moveFile(sourcePath, targetPath)
      const result2 = await Backendless.Files.moveFile(`/${sourcePath}`, `/${targetPath}`)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/move`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          sourcePath: '/old.txt',
          targetPath: '/new-dir/new.txt',
        }
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/move`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          sourcePath: '/old.txt',
          targetPath: '/new-dir/new.txt',
        }
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

  })

  describe('Copy', () => {
    const sourcePath = 'old.txt'
    const targetPath = 'new-dir/new.txt'

    it('moves a file', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.copyFile(sourcePath, targetPath)
      const result2 = await Backendless.Files.copyFile(`/${sourcePath}`, `/${targetPath}`)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/copy`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          sourcePath: '/old.txt',
          targetPath: '/new-dir/new.txt',
        }
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/copy`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          sourcePath: '/old.txt',
          targetPath: '/new-dir/new.txt',
        }
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

  })

  describe('Remove', () => {
    it('removes a file by a relative path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.remove(`${dirPath}/${fileName}`)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/files/${dirPath}/${fileName}`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ resultFileURL })
    })

    it('removes a file by an absolute path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })

      const absolutePath = `https://foo.com${dirPath}/${fileName}`

      const result1 = await Backendless.Files.remove(absolutePath)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : absolutePath,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ resultFileURL })
    })

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.remove()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.remove(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Exists', () => {
    it('removes a file by a relative path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.exists(`${dirPath}/${fileName}`)
      const result2 = await Backendless.Files.exists(`${filePathWithSlash}/${fileName}`)

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path/test-name.txt?action=exists`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/files/test/path/test-name.txt?action=exists`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.exists()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.exists(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Create Directory', () => {
    it('creates a directory by a relative path', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()

      const result1 = await Backendless.Files.createDirectory(dirPath)
      const result2 = await Backendless.Files.createDirectory(filePathWithSlash)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql(undefined)
      expect(result2).to.be.eql(undefined)
    })

    it('fails when directoryPath is invalid', async () => {
      const errorMsg = 'Directory "path" must be provided and must be a string.'

      await expect(Backendless.Files.createDirectory()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.createDirectory(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Remove Directory', () => {
    it('removes a directory by a relative path', async () => {
      const req1 = prepareMockRequest({ resultFileURL })
      const req2 = prepareMockRequest({ resultFileURL })

      const result1 = await Backendless.Files.removeDirectory(dirPath)
      const result2 = await Backendless.Files.removeDirectory(filePathWithSlash)

      expect(req1).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(req2).to.deep.include({
        method : 'DELETE',
        path   : `${APP_PATH}/files/test/path`,
        headers: {},
        body   : undefined
      })

      expect(result1).to.be.eql({ resultFileURL })
      expect(result2).to.be.eql({ resultFileURL })
    })

    it('fails when directoryPath is invalid', async () => {
      const errorMsg = 'Directory "path" must be provided and must be a string.'

      await expect(Backendless.Files.removeDirectory()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.removeDirectory(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Upload', () => {

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

    it('appends from URL with fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })
      const req2 = prepareMockRequest({ fileURL: 'target-file-url-2' })
      const req3 = prepareMockRequest({ fileURL: 'target-file-url-3' })

      const result1 = await Backendless.Files.append('/folder1/dir1/text1.txt', 'source-file-url-1/foo1.txt')
      const result2 = await Backendless.Files.append('folder1/dir2/text2.txt', 'source-file-url-2/foo2.txt')
      const result3 = await Backendless.Files.append('folder2/text3.txt', 'source-file-url-3/foo3.txt')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-1/foo1.txt',
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder1/dir2/text2.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-2/foo2.txt',
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder2/text3.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-3/foo3.txt',
        }
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
      expect(result2).to.be.eql({ fileURL: 'target-file-url-2' })
      expect(result3).to.be.eql({ fileURL: 'target-file-url-3' })
    })

    it('appends from URL without fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })
      const req2 = prepareMockRequest({ fileURL: 'target-file-url-2' })
      const req3 = prepareMockRequest({ fileURL: 'target-file-url-3' })

      const result1 = await Backendless.Files.append('/folder1/dir1/', 'text1.txt', 'source-file-url-1/foo1.txt')
      const result2 = await Backendless.Files.append('folder1/dir2/', 'text2.txt', 'source-file-url-2/foo2.txt')
      const result3 = await Backendless.Files.append('folder2/dir3', 'text3.txt', 'source-file-url-3/foo3.txt')

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-1/foo1.txt',
        }
      })

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder1/dir2/text2.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-2/foo2.txt',
        }
      })

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/files/append/folder2/dir3/text3.txt`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          url: 'source-file-url-3/foo3.txt',
        }
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
      expect(result2).to.be.eql({ fileURL: 'target-file-url-2' })
      expect(result3).to.be.eql({ fileURL: 'target-file-url-3' })
    })

    it('appends from array with fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })

      const result1 = await Backendless.Files.append('/folder1/dir1/text1.txt', [1, 2, 3, 4, 5])

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'AQIDBAU='
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
    })

    it('appends from array without fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })

      const result1 = await Backendless.Files.append('/folder1/dir1', 'text1.txt', [1, 2, 3, 4, 5])

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/binary/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'AQIDBAU='
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
    })

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.append()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when fileName is invalid', async () => {
      const errorMsg = 'Can not resolve target file name'

      await expect(Backendless.Files.append(dirPath)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, 'source-file-url.txt')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.append(dirPath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Append Text', () => {

    it('appends text with fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })

      const result1 = await Backendless.Files.appendText('/folder1/dir1/text1.txt', 'hello-test')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'hello-test'
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
    })

    it('appends text without fileName in directoryPath', async () => {
      const req1 = prepareMockRequest({ fileURL: 'target-file-url-1' })

      const result1 = await Backendless.Files.appendText('/folder1/dir1', 'text1.txt', 'hello-test')

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/append/folder1/dir1/text1.txt`,
        headers: { 'Content-Type': 'text/plain' },
        body   : 'hello-test'
      })

      expect(result1).to.be.eql({ fileURL: 'target-file-url-1' })
    })

    it('fails when filePath is invalid', async () => {
      const errorMsg = '"filePath" must be provided and must be a string.'

      await expect(Backendless.Files.appendText()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when fileName is invalid', async () => {
      const errorMsg = 'Can not resolve target file name'

      await expect(Backendless.Files.appendText(dirPath)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, 'content.txt')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when textContent is invalid', async () => {
      const errorMsg = '"textContent" must be a string'

      await expect(Backendless.Files.appendText(filePath, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(filePath, () => ({}))).to.eventually.be.rejectedWith(errorMsg)

      await expect(Backendless.Files.appendText(dirPath, fileName, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Files.appendText(dirPath, fileName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

})

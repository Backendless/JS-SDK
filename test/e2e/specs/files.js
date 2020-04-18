import sandbox, { Utils } from '../helpers/sandbox'

const Backendless = sandbox.Backendless

const sortedNames = files => files && files.map(file => file.name).sort() || []

describe('Backendless.Files', function() {

  sandbox.forSuite()

  let Files
  let createDir
  let createFile
  let readFile

  const waiter = () => Utils.wait(2000)

  before(function() {
    Files = Backendless.Files

    createFile = (path, content = '') => this.consoleApi.files.createFile(this.app.id, path, content)
    createDir = (path, name) => this.consoleApi.files.createDir(this.app.id, path, name)
    readFile = path => this.consoleApi.files.getFileContent(this.app.id, this.dev.authKey, path)
  })

  describe('Directory Listing', function() {
    before(function() {
      return Promise.all([
        createFile('/listing-test/index.html'),
        createFile('/listing-test/users.html'),
        createFile('/listing-test/logo.png'),
        createFile('/listing-test/subdir/one-more.html')
      ])
    })

    it('basic', async () => {
      const files = await Files.listing('listing-test')

      expect(sortedNames(files)).to.be.eql(['index.html', 'logo.png', 'subdir', 'users.html'])
    })

    it('pattern based', async () => {
      const files = await Files.listing('listing-test', '*.html')

      expect(sortedNames(files)).to.be.eql(['index.html', 'users.html'])
    })

    it('pattern based recursive', async () => {
      const files = await Files.listing('listing-test', '*.html', true)

      expect(sortedNames(files)).to.be.eql(['index.html', 'one-more.html', 'users.html'])
    })

    it('paged', async () => {
      const files = await Files.listing('listing-test', null, true, 3, 1)

      expect(sortedNames(files)).to.be.eql(['index.html', 'logo.png', 'one-more.html'])
    })
  })

  describe('Count', function() {
    const dirName = 'listing-count-test'

    before(function() {
      return Promise.all([
        createFile(`/${dirName}/index.html`),
        createFile(`/${dirName}/users.html`),
        createFile(`/${dirName}/logo.png`),
        createFile(`/${dirName}/subdir-1/one-more-1.html`),
        createFile(`/${dirName}/subdir-2/one-more-2.html`)
      ])
    })

    it('basic', async () => {
      const filesCount = await Files.getFileCount(dirName)

      expect(filesCount).to.be.eql(3)
    })

    it('pattern based', async () => {
      const filesCount = await Files.getFileCount(dirName, '*.html')

      expect(filesCount).to.be.eql(2)
    })

    it('pattern based recursive', async () => {
      const filesCount = await Files.getFileCount(dirName, '*.html', true)

      expect(filesCount).to.be.eql(4)
    })
  })

  describe('Exists', function() {
    it('File', function() {
      const path = 'exists/file'

      return createFile(path)
        .then(() => expect(Files.exists(path)).to.eventually.be.true)
    })

    it('Empty Dir', function() {
      return createDir('exists/empty', 'dir')
        .then(() => expect(Files.exists('exists/empty/dir')).to.eventually.be.true)
    })

    it('Non empty Dir', function() {
      const path = 'exists/non-empty/dir'

      return createFile(path + '/file')
        .then(() => expect(Files.exists(path)).to.eventually.be.true)
    })

    it('non existing', function() {
      return expect(Files.exists('something/unexisting')).to.eventually.be.false
    })
  })

  describe('Deletion', function() {
    it('existing file', function() {
      const path = '/file/to/delete'

      return createFile(path)
        .then(() => expect(Files.exists(path)).to.eventually.be.true)
        .then(() => Files.remove(path))
        .then(() => waiter())
        .then(() => expect(Files.exists(path)).to.eventually.be.false)
    })

    it('existing empty directory', function() {
      const path = '/emptyDir'

      return createDir('/', 'emptyDir')
        .then(() => expect(Files.exists(path)).to.eventually.be.true)
        .then(() => Files.remove(path))
        .then(() => waiter())
        .then(() => expect(Files.exists(path)).to.eventually.be.false)
    })

    it('existing non-empty directory', async () => {
      await createFile('dir/file')

      expect(await Files.exists('dir')).to.equal(true)

      await Files.remove('dir')

      await waiter()

      expect(await Files.exists('dir')).to.equal(false)
    })

    it('non-existing path', function() {
      return expect(Files.remove('/non/existing/file')).to.eventually
        .be.rejected
        .and.eventually.have.property('code', 6000)
    })
  })

  describe('Renaming', function() {
    it('file', function() {
      const beforeRename = '/rename/file-before'
      const afterRename = '/rename/file-after'

      return createFile(beforeRename)
        .then(() => expect(Files.renameFile(beforeRename, 'file-after')).to.eventually.have.string(afterRename))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeRename)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterRename)).to.eventually.be.true)
    })

    it('empty folder', async () => {
      const beforeRename = '/rename/empty/dir-before'
      const afterRename = '/rename/empty/dir-after'

      await createDir('', beforeRename)

      await Files.renameFile(beforeRename, 'dir-after')

      await waiter()

      expect(await Files.exists(beforeRename)).to.equal(false)
      expect(await Files.exists(afterRename)).to.equal(true)
    })

    it('non empty folder', function() {
      const beforeRename = '/rename/non-empty/dir-before'
      const afterRename = '/rename/non-empty/dir-after'

      return createFile(beforeRename + '/file')
        .then(() => expect(Files.renameFile(beforeRename, 'dir-after')).to.eventually.have.string(afterRename))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeRename)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterRename)).to.eventually.be.true)
    })

    it('non-existing path', function() {
      const path = '/rename/non-existing'

      return expect(Files.renameFile(path, 'whatever')).to
        .eventually.be.rejected
        .and.eventually.have.property('code', 6007)
    })
  })

  describe('Move', function() {
    it('file', function() {
      const beforeMove = '/move/file-before'
      const afterMove = '/move/file-after'

      return createFile(beforeMove)
        .then(() => expect(Files.moveFile(beforeMove, afterMove)).to.eventually.have.string(afterMove))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeMove)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterMove)).to.eventually.be.true)
    })

    it('empty folder', function() {
      const beforeMove = '/move/empty/dir-before'
      const afterMove = '/move/empty/dir-after'

      return createDir('', beforeMove)
        .then(() => expect(Files.moveFile(beforeMove, afterMove)).to.eventually.have.string(afterMove))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeMove)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterMove)).to.eventually.be.true)
    })

    it('non empty folder', function() {
      const beforeMove = '/move/non-empty/dir-before'
      const afterMove = '/move/non-empty/dir-after'

      return createFile(beforeMove + '/file')
        .then(() => expect(Files.moveFile(beforeMove, afterMove)).to.eventually.have.string(afterMove))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeMove)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterMove)).to.eventually.be.true)
    })

    it('non-existing path', function() {
      const path = '/move/non-existing'

      return expect(Files.moveFile(path, 'whatever'))
        .to.eventually.be.rejected
        .and.eventually.have.property('code', 6007)
    })
  })

  describe('Copy', function() {
    it('file', function() {
      const beforeCopy = '/copy/file-before'
      const afterCopy = '/copy/file-after'

      return createFile(beforeCopy)
        .then(() => expect(Files.copyFile(beforeCopy, afterCopy)).to.eventually.have.string(afterCopy))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeCopy)).to.eventually.be.true)
        .then(() => expect(Files.exists(afterCopy)).to.eventually.be.true)
    })

    it('empty folder', function() {
      const beforeCopy = '/copy/empty/dir-before'
      const afterCopy = '/copy/empty/dir-after'

      return createDir('', beforeCopy)
        .then(() => expect(Files.copyFile(beforeCopy, afterCopy)).to.eventually.have.string(afterCopy))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeCopy)).to.eventually.be.true)
        .then(() => expect(Files.exists(afterCopy)).to.eventually.be.true)
    })

    it('non empty folder', function() {
      const beforeCopy = '/rename/non-empty/dir-before'
      const afterCopy = '/rename/non-empty/dir-after'

      return createFile(beforeCopy + '/file')
        .then(() => expect(Files.copyFile(beforeCopy, afterCopy)).to.eventually.have.string(afterCopy))
        .then(() => waiter())
        .then(() => expect(Files.exists(beforeCopy)).to.eventually.be.true)
        .then(() => expect(Files.exists(afterCopy)).to.eventually.be.true)
    })

    it('non-existing path', function() {
      const path = '/copy/non-existing'

      return expect(Files.copyFile(path, 'whatever'))
        .to.eventually.be.rejected
        .and.eventually.have.property('code', 6007)
    })
  })

  describe('Save', function() {
    it('Save file', async () => {
      const fileName = 'testFile'
      const fileDir = 'save-test'
      const filePath = `${fileDir}/${fileName}`

      const fileURL = await Files.saveFile(fileDir, fileName, 'testContent')

      expect(fileURL).to.have.string(filePath)

      const fileContent = await readFile(filePath)

      expect(fileContent).to.eql('testContent')
    })
  })

  describe('Upload', function() {
    it('Upload file', function() {
      if (typeof File !== 'undefined') {
        const fileName = 'testFile'
        const fileDir = 'upload-test'
        const filePath = fileDir + '/' + fileName

        return expect(Files.upload(new File([''], fileName), fileDir, true)).to.eventually.have.string(filePath)
        //TODO: check file existence, try to re-upload
      }
    })
  })

})

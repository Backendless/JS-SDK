import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../src/backendless'

const sortedNames = files => files && files.map(file => file.name).sort() || []

describe('Backendless.Files', function() {

  sandbox.forSuite()

  let Files
  let createDir
  let createFile
  let readFile

  before(function() {
    Files = Backendless.Files

    createFile = (path, content = '') => this.consoleApi.files.createFile(this.app.id, path, content)
    createDir = (path, name) => this.consoleApi.files.createDir(this.app.id, path, name)
    readFile = path => this.consoleApi.files.getFileContent(this.app.id, path)
  })

  describe('Directory Listing', function() {
    before(function() {
        return Promise.all([
          createFile('/listing-test/index.html'),
          createFile('/listing-test/users.html'),
          createFile('/listing-test/logo.png'),
          createFile('/listing-test/subdir/one-more.html')
        ])
      }
    )

    it('basic', function() {
      return Files.listing('listing-test').then(result => {
        return expect(sortedNames(result)).to.be.eql(['index.html', 'logo.png', 'subdir', 'users.html'])
      })
    })

    it('pattern based', function() {
      return Files.listing('listing-test', '*.html')
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'users.html']))
    })

    it('pattern based recursive', function() {
      return Files.listing('listing-test', '*.html', true)
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'one-more.html', 'users.html']))
    })

    it('paged', function() {
      return Files.listing('listing-test', null, true, 3, 1)
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'logo.png', 'one-more.html']))
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
        .then(() => expect(Files.exists(path)).to.eventually.be.false)
    })

    it('existing empty directory', function() {
      const path = '/emptyDir'

      return createDir('/', 'emptyDir')
        .then(() => expect(Files.exists(path)).to.eventually.be.true)
        .then(() => Files.remove(path))
        .then(() => expect(Files.exists(path)).to.eventually.be.false)
    })

    it('existing non-empty directory', function() {
      return this.consoleApi.files.createFile(this.app.id, 'dir/file', '')
        .then(() => expect(Files.exists('dir')).to.eventually.be.true)
        .then(() => Files.remove('dir'))
        .then(() => expect(Files.exists('dir')).to.eventually.be.false)
    })

    it('non-existing path', function() {
      return expect(Files.remove('/non/existing/file')).to.eventually
        .be.rejected
        .and.eventually.have.property("code", 6000)
    })
  })

  describe('Renaming', function() {
    it('file', function() {
      const beforeRename = '/rename/file-before'
      const afterRename = '/rename/file-after'

      return createFile(beforeRename)
        .then(() => expect(Files.renameFile(beforeRename, 'file-after')).to.eventually.have.string(afterRename))
        .then(() => expect(Files.exists(beforeRename)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterRename)).to.eventually.be.true)
    })

    it('empty folder', function() {
      const beforeRename = '/rename/empty/dir-before'
      const afterRename = '/rename/empty/dir-after'

      return createDir('', beforeRename)
        .then(() => expect(Files.renameFile(beforeRename, 'dir-after')).to.eventually.have.string(afterRename))
        .then(() => expect(Files.exists(beforeRename)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterRename)).to.eventually.be.true)
    })

    it('non empty folder', function() {
      const beforeRename = '/rename/non-empty/dir-before'
      const afterRename = '/rename/non-empty/dir-after'

      return createFile(beforeRename + '/file')
        .then(() => expect(Files.renameFile(beforeRename, 'dir-after')).to.eventually.have.string(afterRename))
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
        .then(() => expect(Files.exists(beforeMove)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterMove)).to.eventually.be.true)
    })

    it('empty folder', function() {
      const beforeMove = '/move/empty/dir-before'
      const afterMove = '/move/empty/dir-after'

      return createDir('', beforeMove)
        .then(() => expect(Files.moveFile(beforeMove, afterMove)).to.eventually.have.string(afterMove))
        .then(() => expect(Files.exists(beforeMove)).to.eventually.be.false)
        .then(() => expect(Files.exists(afterMove)).to.eventually.be.true)
    })

    it('non empty folder', function() {
      const beforeMove = '/move/non-empty/dir-before'
      const afterMove = '/move/non-empty/dir-after'

      return createFile(beforeMove + '/file')
        .then(() => expect(Files.moveFile(beforeMove, afterMove)).to.eventually.have.string(afterMove))
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
        .then(() => expect(Files.exists(beforeCopy)).to.eventually.be.true)
        .then(() => expect(Files.exists(afterCopy)).to.eventually.be.true)
    })

    it('empty folder', function() {
      const beforeCopy = '/copy/empty/dir-before'
      const afterCopy = '/copy/empty/dir-after'

      return createDir('', beforeCopy)
        .then(() => expect(Files.copyFile(beforeCopy, afterCopy)).to.eventually.have.string(afterCopy))
        .then(() => expect(Files.exists(beforeCopy)).to.eventually.be.true)
        .then(() => expect(Files.exists(afterCopy)).to.eventually.be.true)
    })

    it('non empty folder', function() {
      const beforeCopy = '/rename/non-empty/dir-before'
      const afterCopy = '/rename/non-empty/dir-after'

      return createFile(beforeCopy + '/file')
        .then(() => expect(Files.copyFile(beforeCopy, afterCopy)).to.eventually.have.string(afterCopy))
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
    it('Save file', function() {
      if (process.env.TEST_ENV !== 'node') {
        const fileName = 'testFile'
        const fileDir = 'save-test'
        const filePath = fileDir + '/' + fileName

        return Promise.resolve()
          .then(() => expect(Files.saveFile(fileDir, fileName, 'testContent')).to.eventually.have.string(filePath))
          .then(() => expect(readFile(filePath)).to.eventually.eql('testContent'))
          .then(() => expect(Files.saveFile(fileDir, fileName, 'testContent 2')).to.eventually.have.string(filePath))
          .then(() => expect(readFile(filePath)).to.eventually.eql('testContent 2'))
      }
    })
  })

  describe('Upload', function() {
    it('Upload file', function() {
      if (process.env.TEST_ENV !== 'node') {
        const fileName = 'testFile'
        const fileDir = 'upload-test'
        const filePath = fileDir + '/' + fileName

        return expect(Files.upload(new File([""], fileName), fileDir, true)).to.eventually.have.string(filePath)
        //TODO: check file existence, try to re-upload
      }
    })
  })

  describe('Permissions', function() {
    const testFile = 'permissions-test'

    before(function() {
      return createFile(testFile)
    })

    const operations = ['grant', 'deny']
    const permissions = ['READ', 'WRITE', 'DELETE']

    operations.forEach(operation =>
      permissions.forEach(permission =>
        it(`${operation} ${permission}`, function() {
          return Files.Permissions[permission][operation](testFile)
        })
      )
    )
  })

})
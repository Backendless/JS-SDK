import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../libs/backendless'

describe('Backendless.Files', function() {
  const sortedNames = files => files && files.map(file => file.name).sort() || []

  sandbox.forSuite({
    app: {
      files: {
        webtest: {
          'index.html': '<html>index.html</html>',
          'users.html': '<html>users.html</html>',
          'logo.png'  : 'logo',
          subdir      : {
            'one-more.html': '<html>subir/one-more.html</html>'
          }
        }
      }
    }
  })

  describe('Directory Listing', function() {
    it('basic', function() {
      return Backendless.Files.listing('webtest/').then(result => {
        return expect(sortedNames(result)).to.be.eql(['index.html', 'logo.png', 'subdir', 'users.html'])
      })
    })

    it('pattern based', function() {
      return Backendless.Files.listing('/webtest', '*.html')
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'users.html']))
    })

    it('pattern based recursive', function() {
      Backendless.Files.listing('/webtest', '*.html', true)
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'one-more.html', 'users.html']))
    })

    it('paged', function() {
      return Backendless.Files.listing('/webtest', null, true, 3, 1)
        .then(result => expect(sortedNames(result)).to.be.eql(['index.html', 'logo.png', 'one-more.html']))
    })
  })

  describe('Exists', function() {
    it('File', function() {
      const path = 'exists/file'

      return Promise.resolve()
        .then(() => this.consoleApi.files.createFile(this.app.id, path, ''))
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.true)
    });

    it('Empty Dir', function() {
      const path = 'exists/empty/dir'

      return Promise.resolve()
        .then(() => this.consoleApi.files.createDir(this.app.id, path))
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.true)
    });

    it('Non empty Dir', function() {
      const path = 'exists/non/empty/dir'

      return Promise.resolve()
        .then(() => this.consoleApi.files.createFile(this.app.id, path + '/file',''))
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.true)
    });

    it('non existing', function() {
      var dirPath = '/test-dir-non-exists-async/',
          success = function(response) {
            equal(response, false, 'We expect response false');
            start();
          },
          fail    = function() {
            ok(false, 'We expect no errors');
            start();
          };
      Backendless.Files.exists(dirPath).then(success).catch(fail);
    });
  })

  describe('Deletion', function() {
    it('existing file', function() {
      const path = '/file/to/delete'

      return this.consoleApi.files.createFile(this.app.id, path, 'delete me')
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.true)
        .then(() => Backendless.Files.remove(path))
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.false)
    });

    it('existing empty directory', function() {
      const path = '/emptyDir'

      return this.consoleApi.files.createDir(this.app.id, path)
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.true)
        .then(() => Backendless.Files.remove(path))
        .then(() => expect(Backendless.Files.exists(path)).to.eventually.be.false)
    });

    it('existing non-empty directory', function() {
      return this.consoleApi.files.createFile(this.app.id, 'dir/file', '')
        .then(() => expect(Backendless.Files.exists('dir')).to.eventually.be.true)
        .then(() => Backendless.Files.remove('dir'))
        .then(() => expect(Backendless.Files.exists('dir')).to.eventually.be.false)
    });

    it('non-existing path', function() {
      return expect(Backendless.Files.remove('/non/existing/file')).to.eventually
        .be.rejected
        .and.eventually.have.property("code", 6000)
    });
  })

  describe('Renaming', function() {
    it('file', function() {
      const beforeRename = '/rename/before'
      const afterRename = '/rename/after'

      return Promise.resolve()
        .then(() => this.consoleApi.files.createFile(this.app.id, beforeRename, ''))
        .then(() => expect(Backendless.Files.renameFile(beforeRename, afterRename)).to.eventually.be.eql(afterRename))
        .then(() => expect(Backendless.Files.exists(beforeRename)).to.eventually.be.false)
        .then(() => expect(Backendless.Files.exists(afterRename)).to.eventually.be.true)
    });

    it('Folder', function() {

    });

    it('non-existing path', function() {
      var time = getTime();
      var success = function() {
        ok(false, 'We expect statusCode 404.');
        start();
      };
      var fail = function(e) {
        equal(e.statusCode, 400, 'We expect statusCode 404.');
        start();
      };
      Backendless.Files.renameFile(time + '/test-404.txt', 'test2-404.txt').then(success).catch(fail);
    });
  })


  it.skip('Async Move file', function() {
    uploadTestFile(START_TIME + '/async-test.txt', 'async-test.txt');
    var time = getTime();
    uploadTestFile(time + '/async-test-dir/test2.txt', 'test2.txt');

    var callback = function(e) {
      var status = !(e && e.statusCode);
      ok(status, 'We expect no errors');
      ok(typeof e === 'string', 'Response is string');
      start();
    };

    Backendless.Files.moveFile(START_TIME + '/async-test.txt', time + '/async-test-dir').then(callback).catch(callback);
  });

  it.skip('Async Move non-existing file', function() {
    var time = getTime();
    uploadTestFile(time + '/async-test-dir/test.txt', 'test.txt');
    var success = function() {
      ok(false, 'We expect statusCode 404.');
      start();
    };
    var fail = function(e) {
      equal(e.statusCode, 400, 'We expect statusCode 404.');
      start();
    };
    Backendless.Files.moveFile(time + '/random-file', time + '/async-test-dir').then(success).catch(fail);
  });

  it.skip('Async Copy file', function() {
    uploadTestFile(START_TIME + '/async-test.txt', 'async-test.txt');
    var time = getTime();
    uploadTestFile(time + '/async-test-dir/test2.txt', 'test2.txt');

    var callback = function(e) {
      var status = !(e && e.statusCode);
      ok(status, 'We expect no errors');
      ok(typeof e === 'string', 'Response is string');
      start();
    };

    Backendless.Files.copyFile(START_TIME + '/async-test.txt', time + '/async-test-dir').then(callback).catch(callback);
  });

  it.skip('Async Copy non-existing file', function() {
    var time = getTime();
    uploadTestFile(time + '/async-test-dir/test.txt', 'test.txt');
    var success = function() {
      ok(false, 'We expect statusCode 404.');
      start();
    };
    var fail = function(e) {
      equal(e.statusCode, 400, 'We expect statusCode 404.');
      start();
    };
    Backendless.Files.copyFile(time + '/random-file', time + '/async-test-dir').then(success).catch(fail);
  });

  it.skip('Save file', function() {
    var dirPath = '/async-test-dir/',
        success = function(response) {
          ok(response, 'We expect path in response');
          start();
        },
        fail    = function() {
          fail(false, 'We expect path in response');
          start();
        };

    Backendless.Files.saveFile(dirPath, 'testFile', 'testContent', true).then(success).catch(fail);
  });

  it.skip('Upload file', function() {
    var dirPath = '/async-test-dir/',
        success = function(response) {
          ok(response, 'We expect path in response');
          start();
        },
        fail    = function() {
          fail(false, 'We expect path in response');
          start();
        };

    var file = new File([""], "filename");

    Backendless.Files.upload(file, dirPath, true).then(success).catch(fail);
  });
  describe('Permissions', function() {
    it.skip('grant read async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.grant(START_TIME, 'READ').then(success).catch(fail);
    });

    it.skip('grant write async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.grant(START_TIME, 'WRITE').then(success).catch(fail);
    });

    it.skip('grant delete async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.grant(START_TIME, 'DELETE').then(success).catch(fail);
    });

    it.skip('deny read async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.deny(START_TIME, 'READ').then(success).catch(fail);
    });

    it.skip('deny write async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.deny(START_TIME, 'WRITE').then(success).catch(fail);
    });

    it.skip('deny delete async', function() {
      var success = function() {
        ok(true, 'We expect no errors');
        start();
      };
      var fail = function() {
        ok(false, 'We expect no errors');
        start();
      };

      Backendless.Files.Permissions.deny(START_TIME, 'DELETE').then(success).catch(fail);
    });
  })

})
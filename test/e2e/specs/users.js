import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

function randUser() {
  const ts = new Date().getTime()
  const user = {
    email   : `test_${ts}@gmail.com`,
    password: 'qwerty'
  }

  return new Backendless.User(user)
}

describe('Backendless.Users', function() {

  sandbox.forSuite()

  let BackendlessCopy
  let loginRandomUser
  let setDynamicSchema

  let app

  before(function() {
    app = this.app

    loginRandomUser = () => {
      const user = randUser()

      return Backendless.UserService.register(user)
        //TODO Backendless does login on register but doesn't return 'user-token'
        .then(() => Backendless.UserService.logout())
        .then(() => Backendless.UserService.login(user.email, user.password, true))
        .then(serverUser => Object.assign(user, serverUser))
    }

    setDynamicSchema = dynamicSchema => {
      return this.consoleApi.tables.setConfigs(this.app.id, { dynamicSchema })
    }

    BackendlessCopy = () => {
      const libFilesPath = require.resolve('../../../lib').replace('/index.js', '')

      Object.keys(require.cache).forEach(modulePath => {
        if (modulePath.indexOf(libFilesPath) === 0) {
          delete require.cache[modulePath]
        }
      })

      const result = require('../../../lib').noConflict()
      result.serverURL = Backendless.serverURL
      result.initApp(Backendless.appId, Backendless.apiKey)

      return result
    }
  })

  it('Initially current user is null', function() {
    return expect(Backendless.UserService.getCurrentUser()).to.eventually.be.eql(null)
  })

  describe('registration', function() {
    it('basic', function() {
      const user = randUser()

      return Backendless.UserService.register(user).then(result => {
        expect(result).to.have.property('objectId')
        expect(result).to.have.property('email', user.email)
        expect(result).to.not.have.property('password')
      })
    })

    it('getCurrentUser should not return registered user', function() {
      const user = randUser()
      let currentUser = null

      return Backendless.UserService.getCurrentUser()
        .then(u => currentUser = u)
        .then(() => Backendless.UserService.register(user))
        .then(u => expect(u).to.be.not.eql(currentUser))
    })

    it('can be passed non User typed object', function() {
      return expect(Backendless.UserService.register({ ...randUser() }))
        .to.eventually.be.fulfilled
        .and.eventually.have.property('objectId')
    })

    it('missing identity property', function() {
      return expect(Backendless.UserService.register(new Backendless.User()))
        .to.eventually.be.rejected
        .and.eventually.have.property('code', 3011)
    })

    it('of identicaly user is forbidden', function() {
      const user = randUser()

      return Backendless.UserService.register(user).then(() =>
        expect(Backendless.UserService.register(user))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 3033)
      )
    })

    describe('when disabled', function() {
      let regSettings

      before(function() {
        return this.consoleApi.users.getUsersRegs(this.app.id)
          .then(result => regSettings = result)
          .then(() =>
            this.consoleApi.users.updateUsersRegs(this.app.id, {
              ...regSettings,
              userRegistrationEnabled: false
            }))
      })

      it('it fails', function() {
        return expect(Backendless.UserService.register(randUser()))
          .to.eventually.be
          .rejectedWith(Error, 'User registration is denied for this version of application')
          .and.eventually.have.property('status', 403)
      })

      after(function() {
        return this.consoleApi.users.updateUsersRegs(this.app.id, regSettings)
      })
    })

    describe('with dynamic user properties', function() {
      it('possible by default', function() {
        const user = Object.assign(randUser(), { foo: 'fooValue', bar: 'barValue' })

        return Backendless.UserService.register(user).then(result => {
          expect(result).to.have.property('objectId')
          expect(result).to.have.property('foo', user.foo)
          expect(result).to.have.property('bar', user.bar)
        })
      })

      it('impossible when disabled', function() {
        const user = Object.assign(randUser(), { foo2: 'fooValue', bar2: 'barValue' })

        return setDynamicSchema(false)
          .then(() => Backendless.UserService.register(user))
          .then(newUser => {
            expect(newUser).to.have.property('objectId')
            expect(newUser).to.have.property('email', user.email)

            expect(newUser).to.not.have.property('foo2')
            expect(newUser).to.not.have.property('bar2')
          })
      })

      after(() => setDynamicSchema(true))
    })
  })

  describe('login', function() {
    const user = randUser()
    let loginSettings

    beforeEach(function() {
      return Backendless.UserService.register(randUser())
        .then(serverUser => Object.assign(user, serverUser))
        //TODO Backendless does login on register but doesn't return 'user-token'
        .then(() => Backendless.UserService.logout())
    })

    before(function() {
      return this.consoleApi.users.getUsersLogin(this.app.id).then(result => loginSettings = result)
    })

    afterEach(function() {
      return this.consoleApi.users.updateUsersLogin(this.app.id, loginSettings)
    })

    it('basic', function() {
      return Backendless.UserService.login(user.email, user.password).then(loggedInUser => {
        expect(loggedInUser).to.include({ objectId: user.objectId, email: user.email })
        expect(loggedInUser).to.not.have.property('password')

        return Backendless.UserService.getCurrentUser().then(currentUser => {
          expect(currentUser).to.equal(loggedInUser)
          expect(currentUser).to.have.property('objectId', user.objectId)
          expect(currentUser).to.have.property('email', user.email)
          expect(currentUser).to.have.property('user-token')
        })
      })
    })

    it('when login is invalid', function() {
      return expect(Backendless.UserService.login('invalid login', user.password))
        .to.eventually.be.rejected
        .and.eventually.have.property('code', 3003)
    })

    it('when password is invalid', function() {
      return expect(Backendless.UserService.login(user.email, 'invalid password'))
        .to.eventually.be.rejected
        .and.eventually.have.property('code', 3003)
    })

    it('when user is disabled', function() {
      const user = randUser()
      const usersTable = { name: 'Users' }

      return Promise.resolve()
        .then(() => Backendless.UserService.register(user).then(serverUser => Object.assign(user, serverUser)))
        .then(() => this.consoleApi.tables.updateRecord(this.app.id, usersTable, {
          objectId  : user.objectId,
          userStatus: 'DISABLED'
        }))
        .then(() => {
          return expect(Backendless.UserService.login(user.email, user.password))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 3090)
        })
    })

    describe('when multiple logins', function() {
      describe('disabled (default rule)', function() {
        it('second login should logout previously logged in user', function() {
          const Backendless1 = BackendlessCopy()
          const Backendless2 = BackendlessCopy()

          return Promise.resolve()
            .then(() => Backendless1.UserService.login(user.email, user.password, true))
            .then(() => Backendless2.UserService.login(user.email, user.password, true))

            .then(() => expect(Backendless1.UserService.isValidLogin()).to.eventually.be.false)
            .then(() => expect(Backendless2.UserService.isValidLogin()).to.eventually.be.true)
        })

        it('second login could be forbidden', function() {
          const Backendless1 = BackendlessCopy()
          const Backendless2 = BackendlessCopy()

          return this.consoleApi.users.updateUsersLogin(this.app.id, { ...loginSettings, logoutLastUser: true })
            .then(() => Backendless1.UserService.login(user.email, user.password, true))
            .then(() => expect(Backendless2.UserService.login(user.email, user.password, true))
              .to.eventually.be.rejected
              .and.eventually.have.property('code', 3002))
            .then(() => expect(Backendless1.UserService.isValidLogin()).to.eventually.be.true)
        })
      })

      describe('enabled', function() {
        it('it is possible to have a configurable amount of simultaneous logins', function() {
          const Backendless1 = BackendlessCopy()
          const Backendless2 = BackendlessCopy()
          const Backendless3 = BackendlessCopy()

          const multipleLogins = {
            ...loginSettings,
            enableMultipleLogins: true,
            maxConcurrentLogins : 2
          }

          return this.consoleApi.users.updateUsersLogin(this.app.id, multipleLogins)
            .then(() => Backendless1.UserService.login(user.email, user.password, true))
            .then(() => Backendless2.UserService.login(user.email, user.password, true))
            .then(() => expect(Backendless3.UserService.login(user.email, user.password, true))
              .to.eventually.be.rejected
              .and.eventually.have.property('code', 3044))
            .then(() => expect(Backendless1.UserService.isValidLogin()).to.eventually.be.true)
            .then(() => expect(Backendless2.UserService.isValidLogin()).to.eventually.be.true)
        })
      })
    })

    it('unlimited unsuccessful logins (by default)', function() {
      const login = Backendless.UserService.login.bind(Backendless.UserService)

      return Promise.resolve()
        .then(() => expect(login(user.email, 'invalid')).to.eventually.be.rejected)
        .then(() => expect(login(user.email, 'invalid')).to.eventually.be.rejected)
        .then(() => expect(login(user.email, 'invalid')).to.eventually.be.rejected)
        .then(() => expect(login(user.email, user.password)).to.eventually.be.fulfilled)
    })

    it('limited unsuccessful logins', function() {
      const validLogin = () => Backendless.UserService.login(user.email, user.password)
      const invalidLogin = () => Backendless.UserService.login(user.email, 'invalid')

      return this.consoleApi.users.updateUsersLogin(this.app.id, { ...loginSettings, failedLoginsLock: 2 })
        .then(() => expect(invalidLogin()).to.eventually.be.rejected)
        .then(() => expect(validLogin()).to.eventually.be.fulfilled)
        .then(() => expect(invalidLogin()).to.eventually.be.rejected)
        .then(() => expect(invalidLogin()).to.eventually.be.rejected)
        .then(() => expect(validLogin())
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 3036)
        )
    })

    it('login as guest user', async function() {
      const user = await Backendless.UserService.loginAsGuest()

      expect(user instanceof Backendless.User).to.equal(true)
      expect(user.___class).to.equal('Users')
      expect(user.userStatus).to.equal('GUEST')
      expect(user.objectId).to.be.a('string')
      expect(user['user-token']).to.be.a('string')

      const testObj = await Backendless.Data.of('TestTable').save({})

      expect(testObj.___class).to.equal('TestTable')
      expect(testObj.objectId).to.be.a('string')
      expect(testObj.ownerId).to.equal(user.objectId)
    })

    it('login by user\'s objectId with CloudCode API_KEY', async function() {
      const blBackendless = Backendless.initApp({
        appId     : app.id,
        apiKey    : app.apiKeysMap.CloudCode,
        standalone: true
      })

      const savedUser = await blBackendless.Data.of(Backendless.User).save(randUser())
      const loggedUser = await blBackendless.UserService.login(savedUser.objectId)

      expect(loggedUser['user-token']).to.be.a('string')
      expect(loggedUser.objectId).to.be.a('string')
      expect(loggedUser.objectId).to.equal(savedUser.objectId)
      expect(loggedUser.email).to.equal(savedUser.email)
    })

    it('login by user\'s objectId with non CloudCode API_KEY', async function() {
      const savedUser = await Backendless.Data.of(Backendless.User).save(randUser())

      expect(savedUser.objectId).to.be.a('string')

      let error

      try {
        await Backendless.UserService.login(savedUser.objectId)
      } catch (e) {
        error = e
      }

      expect(error.code).to.equal(2014)
      expect(error.message).to.equal('Login by object id is allowed only for Code Runner API key')
    })

  })

  it('logout', function() {
    return loginRandomUser()
      .then(() => Backendless.UserService.logout())
      .then(() => expect(Backendless.UserService.getCurrentUser()).to.eventually.be.null)
  })

  describe('update', function() {
    let user

    beforeEach(function() {
      return loginRandomUser().then(result => user = result)
    })

    afterEach(function() {
      return Backendless.UserService.logout()
        .then(() => setDynamicSchema(true))
    })

    it('non dynamic prop', function() {
      return Backendless.UserService.update({ objectId: user.objectId, name: 'New Name' })
        .then(user => expect(user).to.have.property('name', 'New Name'))
    })

    it('dynamic prop', function() {
      return setDynamicSchema(true)
        .then(() => Backendless.UserService.update({ objectId: user.objectId, data: 'custom data' }))
        .then(user => expect(user).to.have.property('data', 'custom data'))
    })

    it('dynamic prop when feature is disabled', function() {
      return setDynamicSchema(false)
        .then(() => Backendless.UserService.update({ objectId: user.objectId, data2: 'custom data' }))
        .then(updatedUser => {

          expect(updatedUser).to.have.property('objectId', user.objectId)
          expect(updatedUser).to.have.property('email', user.email)

          expect(updatedUser).to.not.have.property('data2')
        })
    })

    it('neighbor', async () => {
      const firstUser = {
        email   : 'neighbor-1@email.com',
        password: 'password'
      }

      const secondUser = {
        email   : 'neighbor-2@email.com',
        password: 'password'
      }

      const neighbor = await Backendless.UserService.register(firstUser)

      await Backendless.UserService.register(secondUser)

      await Backendless.UserService.update(neighbor)
    })

    it('updating an another user should not override currentUser', function() {
      return Backendless.UserService.register(randUser())
        .then(anotherUser => {
          return Backendless.UserService.getCurrentUser()
            .then(currentUser => expect(currentUser.objectId).to.equal(user.objectId))
            .then(() => {
              anotherUser.name = 'Bob'

              return Backendless.UserService.update(anotherUser)
                .then(u => {
                  anotherUser = u

                  expect(anotherUser.name).to.equal('Bob')
                })
                .then(() => Backendless.UserService.getCurrentUser())
                .then(currentUser => {
                  expect(currentUser.objectId).to.equal(user.objectId)
                  expect(anotherUser.objectId).to.not.equal(user.objectId)
                })
            })
        })
    })
  })

  it('restore password', function() {
    return Backendless.UserService.register(randUser())
      .then(user => Backendless.UserService.restorePassword(user.email))
      .catch(err => expect(err.code).to.equal(5050))
  })

  it('restore password for a wrong login', function() {
    return Backendless.UserService.restorePassword(randUser().email)
      .catch(err => expect(err.code).to.be.oneOf([5050, 3020]))
  })

  it('describe user', function() {
    const user = randUser()
    user.location = 'New York'

    return Promise.resolve()
      .then(() => Backendless.UserService.register(user))
      .then(() => Backendless.UserService.login(user.email, user.password))
      .then(() => Backendless.UserService.describeUserClass())
      .then(columns => expect(columns.map(column => column.name))
        .to.include.members(['location', 'email', 'created', 'updated', 'objectId']))
  })

  describe('roles', function() {
    let user

    before(function() {
      return loginRandomUser().then(result => user = result)
    })

    after(function() {
      return Backendless.UserService.logout()
    })

    describe('using js sdk api key', function() {
      it('assign/unassign custom role', function() {

        return this.consoleApi.security.createRole(this.app.id, 'CustomRole')
          .then(() => expect(Backendless.UserService.assignRole(user.email, 'CustomRole'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2011)
          )
          .then(() => expect(Backendless.UserService.unassignRole(user.email, 'CustomRole'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2011)
          )
      })
    })

    describe('using servercode api key', function() {
      before(function() {
        Backendless.initApp(this.app.id, this.app.apiKeysMap.CloudCode)
      })

      it('assign/unassign custom role to a user', function() {
        let user

        return Promise.resolve()
          .then(() => this.consoleApi.security.createRole(this.app.id, 'CustomRole2'))
          .then(() => loginRandomUser())
          .then(result => user = result)
          .then(() => expect(Backendless.UserService.assignRole(user.email, 'CustomRole2').catch(e => console.log(e.code, e.message)))
            .to.eventually.be.fulfilled)
          .then(() => expect(Backendless.UserService.unassignRole(user.email, 'CustomRole2').catch(e => console.log(e.code, e.message)))
            .to.eventually.be.fulfilled)
      })

      it('assign/unassign system role to a user', function() {
        let user

        return loginRandomUser()
          .then(u => user = u)
          .then(() => expect(Backendless.UserService.assignRole(user.email, 'AuthenticatedUser'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2007)
          )
          .then(() => expect(Backendless.UserService.unassignRole(user.email, 'AuthenticatedUser'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2008)
          )
      })

      it('assign/unassign nonexistent role to a user', function() {
        let user

        return loginRandomUser()
          .then(u => user = u)
          .then(() => expect(Backendless.UserService.assignRole(user.email, 'NonexistentRole'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2005)
          )
          .then(() => expect(Backendless.UserService.unassignRole(user.email, 'NonexistentRole'))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 2005)
          )
      })

      it('finds users by roleName', async () => {
        const user1 = await Backendless.UserService.register(randUser())
        const user2 = await Backendless.UserService.register(randUser())

        await Backendless.UserService.assignRole(user1.email, 'CustomRole2')
        await Backendless.UserService.assignRole(user2.email, 'CustomRole2')

        const result = await Backendless.UserService.findByRole('CustomRole2', true)

        const resultUser1 = result.find(u => u.email === user1.email)
        const resultUser2 = result.find(u => u.email === user1.email)

        expect(resultUser1).to.have.property('objectId')
        expect(resultUser1.roles).to.include.members(['CustomRole2'])

        expect(resultUser2).to.have.property('objectId')
        expect(resultUser2.roles).to.include.members(['CustomRole2'])
      })
    })
  })

  it('toggle userStatus with CloudCode API_KEY', async function() {
    let user
    const blBackendless = Backendless.initApp({
      appId     : app.id,
      apiKey    : app.apiKeysMap.CloudCode,
      standalone: true
    })

    const savedUser = await blBackendless.Data.of(Backendless.User).save(randUser())
    user = await blBackendless.UserService.login(savedUser.objectId)

    await blBackendless.UserService.disableUser(user.objectId)

    await blBackendless.UserService.logout()
    user = await blBackendless.Data.of(blBackendless.Users).findById(user.objectId)
    expect(user.userStatus).to.equal('DISABLED')

    await blBackendless.UserService.enableUser(user.objectId)

    user = await blBackendless.Data.of(blBackendless.Users).findById(user.objectId)
    expect(user.userStatus).to.equal('ENABLED')
  })

  it('toggle userStatus with non CloudCode API_KEY', async function() {
    const user = await loginRandomUser()

    expect(Backendless.UserService.disableUser(user.objectId))
      .to.eventually.be.rejected
      .and.eventually.have.property('code', 3054)
      .and.eventually.have.property('message', 'Operation allowed only for BL logic.')

    expect(Backendless.UserService.enableUser(user.objectId))
      .to.eventually.be.rejected
      .and.eventually.have.property('code', 3054)
      .and.eventually.have.property('message', 'Operation allowed only for BL logic.')
  })

  it('resend email confirmation', async function() {
    const user = randUser()

    await this.consoleApi.users.updateUsersRegs(this.app.id, {
      userRegistrationEnabled  : true,
      emailConfirmationRequired: true
    })

    await Backendless.UserService.register(user)

    const result = await Backendless.UserService.resendEmailConfirmation(user.email)

    expect(result).to.be.empty
  })

  it('create email confirmation', async function() {
    const user = randUser()

    await Backendless.UserService.register(user)

    const result = await Backendless.UserService.createEmailConfirmationURL(user.email)

    expect(result.confirmationURL).to.be.a('string')
    expect(result.confirmationURL.length).to.not.be.empty
  })

  describe('verify password of the current user', function() {
    let user

    beforeEach(async () => {
      user = randUser()

      await Backendless.UserService.logout()

      Object.assign(user, await Backendless.UserService.register(randUser()))
    })

    it('works with CloudCode API_KEY only', async function() {
      const blBackendless = Backendless.initApp({
        appId     : app.id,
        apiKey    : app.apiKeysMap.CloudCode,
        standalone: true
      })

      await blBackendless.UserService.login(user.email, user.password)

      const result1 = await blBackendless.UserService.verifyPassword(user.password)
      const result2 = await blBackendless.UserService.verifyPassword('invalid password')

      expect(result1).to.equal(true)
      expect(result2).to.equal(false)
    })

    it('fails because is used non CloudCode API_KEY', async function() {
      await Backendless.UserService.login(user.email, user.password)

      let error

      try {
        await Backendless.UserService.verifyPassword(user.password)

      } catch (e) {
        error = e
      }

      expect(error).to.include({
        code   : 3122,
        message: 'Password verification allowed only from CloudCode',
      })
    })

    it('fails when the current user has invalid token', async function() {
      const blBackendless = Backendless.initApp({
        appId     : app.id,
        apiKey    : app.apiKeysMap.CloudCode,
        standalone: true
      })

      await blBackendless.UserService.login(user.email, user.password)

      await blBackendless.UserService.setCurrentUser({ ...user, 'user-token': 'invalid-token' }, true)

      let error

      try {
        await blBackendless.UserService.verifyPassword(user.password)

      } catch (e) {
        error = e
      }

      expect(error).to.include({
        code   : 3064,
        message: 'Not existing user token - invalid-token. Relogin user to update your user token',
      })
    })
  })
})

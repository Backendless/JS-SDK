import '../helpers/global'
import sandbox from '../helpers/sandbox'
import Backendless from '../../../src/backendless'

function randUser() {
  const ts = new Date().getTime()
  const user = new Backendless.User()
  user.email = `test_${ts}@gmail.com`
  user.password = 'qwerty'
  return user
}

describe('Backendless.Users', function() {

  sandbox.forSuite()

  let BackendlessCopy
  let loginRandomUser
  let setDynamicSchema

  before(function() {
    loginRandomUser = () => {
      let user = randUser()

      return Backendless.UserService.register(user)
        .then(() => Backendless.UserService.login(user.email, user.password, true))
        .then(serverUser => Object.assign(user, serverUser))
    }

    setDynamicSchema = dynamicSchema => {
      return this.consoleApi.tables.setConfigs(this.app.id, { dynamicSchema })
    }

    BackendlessCopy = () => {
      delete require.cache[require.resolve('../../../src/backendless')]

      const result = require('../../../src/backendless').noConflict()
      result.serverURL = Backendless.serverURL
      result.initApp(Backendless.applicationId, Backendless.secretKey)

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

    it('non User typed object', function() {
      return expect(Backendless.UserService.register({ ...randUser() }))
        .to.eventually.be.rejectedWith(Error, 'Only Backendless.User accepted')
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
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 3009)
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

        return setDynamicSchema(false).then(() =>
          expect(Backendless.UserService.register(user))
            .to.eventually.be.rejected
            .and.eventually.have.property('code', 1169)
        )
      })

      after(() => setDynamicSchema(true))
    })
  })

  describe('login', function() {
    let user = randUser()
    let loginSettings

    beforeEach(function() {
      return Backendless.UserService.register(randUser())
        .then(serverUser => Object.assign(user, serverUser))
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
          expect(currentUser).to.not.equal(loggedInUser)
          expect(currentUser).to.have.property('objectId', user.objectId)
          expect(currentUser).to.have.property('email', user.email)
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
      let user = randUser()
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
      return setDynamicSchema(true)
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
      return setDynamicSchema(false).then(() =>
        expect(Backendless.UserService.update({ objectId: user.objectId, data2: 'custom data' }))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 1169)
      )
    })

    it('neighbor', function() {
      return Backendless.UserService.register(randUser()).then(neighbor =>
        expect(Backendless.UserService.update(neighbor))
          .to.eventually.be.rejected
          .and.eventually.have.property('code', 3029)
      )
    })
  })

  it('restore password', function() {
    this.timeout(15000)

    return Backendless.UserService.register(randUser())
      .then(user => Backendless.UserService.restorePassword(user.email))
      .catch(err => expect(err.code).to.equal(5050))
  })

  it('restore password for a wrong login', function() {
    this.timeout(15000)

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
        Backendless.initApp(this.app.id, this.app.devices.BL)
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
    })
  })
})
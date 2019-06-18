import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Permissions DEPRECATED', function() {
  sandbox.forSuite()

  const roleName = 'AuthenticatedUser'
  let Permissions
  let user

  before(function() {
    Permissions = Backendless.Data.Permissions

    return Backendless.Data.of(Backendless.User)
      .save({
        email   : 'john@lennon.co',
        name    : 'John Lennon',
        password: 'beatlesforever'
      })
      .then(result => user = result)
  })

  describe('FIND', function() {

    describe('GRANT', function() {

      it('user', function() {
        return Permissions.FIND.grantUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.FIND.grantRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.FIND.grant(user)
      })
    })

    describe('DENY', function() {

      it('user', function() {
        return Permissions.FIND.denyUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.FIND.denyRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.FIND.deny(user)
      })
    })
  })

  describe('REMOVE', function() {

    describe('GRANT', function() {

      it('user', function() {
        return Permissions.REMOVE.grantUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.REMOVE.grantRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.REMOVE.grant(user)
      })
    })

    describe('DENY', function() {

      it('user', function() {
        return Permissions.REMOVE.denyUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.REMOVE.denyRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.REMOVE.deny(user)
      })
    })
  })

  describe('UPDATE', function() {

    describe('GRANT:deprecated', function() {

      it('user', function() {
        return Permissions.UPDATE.grantUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.UPDATE.grantRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.UPDATE.grant(user)
      })
    })

    describe('DENY', function() {

      it('user', function() {
        return Permissions.UPDATE.denyUser(user.objectId, user)
      })

      it('role', function() {
        return Permissions.UPDATE.denyRole(roleName, user)
      })

      it('all users', function() {
        return Permissions.UPDATE.deny(user)
      })
    })
  })
})

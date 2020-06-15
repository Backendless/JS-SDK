import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Permissions', function() {
  sandbox.forSuite()

  const roleName = 'AuthenticatedUser'

  let user
  let incident

  before(async function() {
    user = await Backendless.Data.of('Users').save({
      email   : `john-${Date.now()}-lennon@lennon.co`,
      name    : 'John Lennon',
      password: 'beatlesforever'
    })

    incident = await Backendless.Data.of('Incident').save({})
  })

  describe('Grand', function() {
    describe('FIND', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.FIND.grantForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.FIND.grantForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.FIND.grantForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.FIND.grantForAllRoles(incident)
      })
    })

    describe('UPDATE', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.UPDATE.grantForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.UPDATE.grantForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.UPDATE.grantForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.UPDATE.grantForAllRoles(incident)
      })
    })

    describe('REMOVE', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.REMOVE.grantForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.REMOVE.grantForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.REMOVE.grantForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.REMOVE.grantForAllRoles(incident)
      })
    })
  })

  describe('Deny', function() {
    describe('FIND', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.FIND.denyForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.FIND.denyForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.FIND.denyForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.FIND.denyForAllRoles(incident)
      })
    })

    describe('UPDATE', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.UPDATE.denyForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.UPDATE.denyForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.UPDATE.denyForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.UPDATE.denyForAllRoles(incident)
      })
    })

    describe('REMOVE', function() {

      it('for user', async () => {
        await Backendless.Data.Permissions.REMOVE.denyForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Backendless.Data.Permissions.REMOVE.denyForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Backendless.Data.Permissions.REMOVE.denyForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Backendless.Data.Permissions.REMOVE.denyForAllRoles(incident)
      })
    })
  })
})

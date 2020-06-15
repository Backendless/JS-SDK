import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Files - Permissions', function() {
  sandbox.forSuite()

  const roleName = 'AuthenticatedUser'

  const fileName = 'permissions-test.txt'

  let user

  before(async function() {
    user = await Backendless.Data.of('Users').save({
      email   : `john-${Date.now()}-lennon@lennon.co`,
      name    : 'John Lennon',
      password: 'beatlesforever'
    })

    await this.consoleApi.files.createFile(this.app.id, fileName, '')
  })

  describe('Grand', function() {
    describe('READ', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.READ.grantForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.READ.grantForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.READ.grantForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.READ.grantForAllRoles(fileName)
      })
    })

    describe('WRITE', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.WRITE.grantForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.WRITE.grantForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.WRITE.grantForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.WRITE.grantForAllRoles(fileName)
      })
    })

    describe('DELETE', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.DELETE.grantForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.DELETE.grantForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.DELETE.grantForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.DELETE.grantForAllRoles(fileName)
      })
    })
  })

  describe('Deny', function() {
    describe('READ', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.READ.denyForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.READ.denyForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.READ.denyForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.READ.denyForAllRoles(fileName)
      })
    })

    describe('WRITE', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.WRITE.denyForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.WRITE.denyForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.WRITE.denyForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.WRITE.denyForAllRoles(fileName)
      })
    })

    describe('DELETE', function() {

      it('for user', async () => {
        await Backendless.Files.Permissions.DELETE.denyForUser(user.objectId, fileName)
      })

      it('for role', async () => {
        await Backendless.Files.Permissions.DELETE.denyForRole(roleName, fileName)
      })

      it('for all users', async () => {
        await Backendless.Files.Permissions.DELETE.denyForAllUsers(fileName)
      })

      it('for all roles', async () => {
        await Backendless.Files.Permissions.DELETE.denyForAllRoles(fileName)
      })
    })
  })
})

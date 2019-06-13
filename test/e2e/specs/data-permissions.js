import '../helpers/global'
import sandbox from '../helpers/sandbox'

const Backendless = sandbox.Backendless

describe('Data - Permissions', function() {
  sandbox.forSuite()

  const roleName = 'AuthenticatedUser'
  const operations = ['FIND', 'UPDATE', 'REMOVE']

  let Permissions

  let user
  let incident

  beforeEach(async function() {
    Permissions = Backendless.Data.Permissions

    user = await Backendless.Data.of(Backendless.User).save({
      email   : `john-${Date.now()}-lennon@lennon.co`,
      name    : 'John Lennon',
      password: 'beatlesforever'
    })

    incident = await Backendless.Data.of('Incident').save({})
  })

  operations.forEach(operation => {
    describe(operation, function() {

      it('for user', async () => {
        await Permissions[operation].grantForUser(user.objectId, incident)
        await Permissions[operation].denyForUser(user.objectId, incident)
      })

      it('for role', async () => {
        await Permissions[operation].grantForRole(roleName, incident)
        await Permissions[operation].denyForRole(roleName, incident)
      })

      it('for all users', async () => {
        await Permissions[operation].grantForAllUsers(incident)
        await Permissions[operation].denyForAllUsers(incident)
      })

      it('for all roles', async () => {
        await Permissions[operation].grantForAllRoles(incident)
        await Permissions[operation].denyForAllRoles(incident)
      })
    })
  })

})

import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Permissions', () => {

  forSuite()

  const role = 'test-role'
  const user = 'test-user'
  const object = 'test-object'

  const testResult = 'test-result'

  describe('READ', () => {
    const permission = 'READ'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

  })

  describe('DELETE', () => {
    const permission = 'DELETE'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

  })

  describe('WRITE', () => {
    const permission = 'WRITE'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllUsers(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          user: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('grantForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/GRANT/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    it('denyForAllRoles', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/files/permissions/DENY/${object}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

  })

})

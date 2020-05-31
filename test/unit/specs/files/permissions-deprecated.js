import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Files> Permissions (deprecated)', function() {

  forSuite(this)

  const role = 'test-role'
  const user = 'test-user'
  const object = 'test-object'

  const testResult = 'test-result'

  describe('READ', () => {
    const permission = 'READ'

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantUser(user, object)

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

    it('denyUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyUser(user, object)

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

    it('grantRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantRole(role, object)

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

    it('denyRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyRole(role, object)

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

    it('grant', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grant(object)

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

    it('deny', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].deny(object)

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

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantUser(user, object)

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

    it('denyUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyUser(user, object)

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

    it('grantRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantRole(role, object)

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

    it('denyRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyRole(role, object)

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

    it('grant', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grant(object)

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

    it('deny', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].deny(object)

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

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantUser(user, object)

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

    it('denyUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyUser(user, object)

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

    it('grantRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grantRole(role, object)

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

    it('denyRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].denyRole(role, object)

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

    it('grant', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].grant(object)

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

    it('deny', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Files.Permissions[permission].deny(object)

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

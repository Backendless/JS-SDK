import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Permissions (deprecated)', function() {

  forSuite(this)

  const role = 'test-role'
  const user = 'test-user'
  const object = {
    ___class: 'Persons',
    objectId: 'test-person-id'
  }

  const testResult = 'test-result'

  describe('FIND', () => {
    const permission = 'FIND'

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grant(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].deny(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

  })

  describe('REMOVE', () => {
    const permission = 'REMOVE'

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grant(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].deny(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    xit('fails when object has no ___class property', async () => {
      const errorMsg = '"dataObject.___class" and "dataObject.objectId" need to be specified'

      const perm = Backendless.Data.Permissions[permission]

      expect(() => perm.grantUser(user, {})).to.throw(errorMsg)
      expect(() => perm.denyUser(user, {})).to.throw(errorMsg)
      expect(() => perm.grantRole(role, {})).to.throw(errorMsg)
      expect(() => perm.denyRole(role, {})).to.throw(errorMsg)
      expect(() => perm.grant({})).to.throw(errorMsg)
      expect(() => perm.deny({})).to.throw(errorMsg)
    })

  })

  describe('UPDATE', () => {
    const permission = 'UPDATE'

    it('grantUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyUser(user, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyRole(role, object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grant(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].deny(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].grantForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/GRANT/${object.objectId}`,
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

      const result1 = await Backendless.Data.Permissions[permission].denyForAllRoles(object)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/data/Persons/permissions/DENY/${object.objectId}`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          permission,
          role: '*'
        }
      })

      expect(result1).to.be.eql({ testResult })
    })

    xit('fails when object has no ___class property', async () => {
      const errorMsg = '"dataObject.___class" and "dataObject.objectId" need to be specified'

      const perm = Backendless.Data.Permissions[permission]

      expect(() => perm.grantUser(user, {})).to.throw(errorMsg)
      expect(() => perm.denyUser(user, {})).to.throw(errorMsg)
      expect(() => perm.grantRole(role, {})).to.throw(errorMsg)
      expect(() => perm.denyRole(role, {})).to.throw(errorMsg)
      expect(() => perm.grant({})).to.throw(errorMsg)
      expect(() => perm.deny({})).to.throw(errorMsg)
    })

  })

})

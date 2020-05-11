import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { APP_PATH, forSuite, prepareMockRequest } from '../../helpers/sandbox'

describe('<Data> Permissions', () => {

  forSuite()

  const role = 'test-role'
  const user = 'test-user'
  const object = {
    ___class: 'Persons',
    objectId: 'test-person-id'
  }

  const testResult = 'test-result'

  describe('FIND', () => {
    const permission = 'FIND'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForUser(user, object)

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

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForUser(user, object)

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

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForRole(role, object)

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

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForRole(role, object)

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

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForAllUsers(object)

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

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForAllUsers(object)

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

    it('fails when object has no ___class property', async () => {
      const errorMsg = '"dataObject.___class" and "dataObject.objectId" need to be specified'

      const perm = Backendless.Data.Permissions[permission]

      expect(() => perm.grantForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.denyForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.grantForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.denyForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.grantForAllUsers({})).to.throw(errorMsg)
      expect(() => perm.denyForAllUsers({})).to.throw(errorMsg)
    })

  })

  describe('REMOVE', () => {
    const permission = 'REMOVE'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForUser(user, object)

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

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForUser(user, object)

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

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForRole(role, object)

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

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForRole(role, object)

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

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForAllUsers(object)

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

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForAllUsers(object)

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

    it('fails when object has no ___class property', async () => {
      const errorMsg = '"dataObject.___class" and "dataObject.objectId" need to be specified'

      const perm = Backendless.Data.Permissions[permission]

      expect(() => perm.grantForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.denyForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.grantForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.denyForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.grantForAllUsers({})).to.throw(errorMsg)
      expect(() => perm.denyForAllUsers({})).to.throw(errorMsg)
    })

  })

  describe('UPDATE', () => {
    const permission = 'UPDATE'

    it('grantForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForUser(user, object)

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

    it('denyForUser', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForUser(user, object)

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

    it('grantForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForRole(role, object)

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

    it('denyForRole', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForRole(role, object)

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

    it('grantForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].grantForAllUsers(object)

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

    it('denyForAllUsers', async () => {
      const req1 = prepareMockRequest({ testResult })

      const result1 = await Backendless.Data.Permissions[permission].denyForAllUsers(object)

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

    it('fails when object has no ___class property', async () => {
      const errorMsg = '"dataObject.___class" and "dataObject.objectId" need to be specified'

      const perm = Backendless.Data.Permissions[permission]

      expect(() => perm.grantForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.denyForUser(user, {})).to.throw(errorMsg)
      expect(() => perm.grantForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.denyForRole(role, {})).to.throw(errorMsg)
      expect(() => perm.grantForAllUsers({})).to.throw(errorMsg)
      expect(() => perm.denyForAllUsers({})).to.throw(errorMsg)
    })

  })

})

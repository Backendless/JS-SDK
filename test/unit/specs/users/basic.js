import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { Utils, APP_PATH, forTest, prepareMockRequest } from '../../helpers/sandbox'

function getTestUserObject() {
  return {
    email   : 'foo@bar.com',
    password: '123456',
    name    : 'Bob Miller'
  }
}

function getTestUserInstance(user) {
  return new Backendless.User(user || getTestUserObject())
}

describe('<Users> Basic', function() {

  forTest(this)

  it('updates user', async () => {
    const userObject = getTestUserObject()
    const userInstance = getTestUserInstance()

    userObject.objectId = Utils.objectId()
    userInstance.objectId = Utils.objectId()

    const req1 = prepareMockRequest({ ...userObject })
    const req2 = prepareMockRequest({ ...userInstance })

    const user1 = await Backendless.UserService.update(userObject)
    const user2 = await Backendless.UserService.update(userInstance)

    expect(req1).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/users/${userObject.objectId}`,
      headers: { 'Content-Type': 'application/json' },
      body   : userObject
    })

    expect(req2).to.deep.include({
      method : 'PUT',
      path   : `${APP_PATH}/users/${userInstance.objectId}`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        ___class: 'Users',
        ...userInstance
      }
    })

    expect(user1).to.be.an.instanceof(Backendless.User)
    expect(user1.___class).to.be.equal('Users')
    expect(user1.objectId).to.be.equal(userObject.objectId)

    expect(user2).to.be.an.instanceof(Backendless.User)
    expect(user2.___class).to.be.equal('Users')
    expect(user2.objectId).to.be.equal(userInstance.objectId)
  })

  it('sends correct request to describe User table', async () => {
    const req1 = prepareMockRequest()

    await Backendless.UserService.describeUserClass()

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/users/userclassprops`,
      headers: {},
      body   : undefined
    })
  })

  it('gets local current user', async () => {
    const currentUser = { name: 'bob', age: 45 }

    expect(Backendless.UserService.setCurrentUser(currentUser))
      .to.equal(Backendless.UserService.currentUser)
      .to.eql({ ___class: 'Users', name: 'bob', age: 45 })
  })

  describe('Status', function() {
    const fakeResult = { foo: 123 }
    const testUserId = 'test-user-id'

    it('should disable user', async () => {
      const req1 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.UserService.disableUser(testUserId)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/users/${testUserId}/status`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          userStatus: 'DISABLED'
        }
      })

      expect(result1).to.be.eql(fakeResult)
    })

    it('should enable user', async () => {
      const req1 = prepareMockRequest(fakeResult)
      const req2 = prepareMockRequest(fakeResult)

      const result1 = await Backendless.UserService.enableUser(testUserId)
      const result2 = await Backendless.UserService.enableUser(123)

      expect(req1).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/users/${testUserId}/status`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          userStatus: 'ENABLED'
        }
      })

      expect(req2).to.deep.include({
        method : 'PUT',
        path   : `${APP_PATH}/users/123/status`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          userStatus: 'ENABLED'
        }
      })

      expect(result1).to.be.eql(fakeResult)
      expect(result2).to.be.eql(fakeResult)
    })

    it('should fail if userId is invalid', async () => {
      const errorMsg = 'User objectId must be non empty string/number'

      await expect(Backendless.UserService.disableUser()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.disableUser(() => ({}))).to.eventually.be.rejectedWith(errorMsg)

      await expect(Backendless.UserService.enableUser()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.enableUser(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('should fail if userStatus is invalid', async () => {
      const errorMsg = 'User Status must be a valid string'

      await expect(Backendless.UserService.updateUserStatus('user-id')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.updateUserStatus('user-id', () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })
})

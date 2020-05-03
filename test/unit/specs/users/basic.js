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

describe('<Users> Basic', () => {

  forTest()

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
    const currentUser = {}

    Backendless.UserService.currentUser = currentUser

    expect(Backendless.UserService.getLocalCurrentUser())
      .to.equal(Backendless.UserService.currentUser)
      .to.equal(currentUser)
  })
})

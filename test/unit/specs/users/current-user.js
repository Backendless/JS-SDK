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

describe('<Users> Current User', function() {

  forTest(this)

  let objectId
  let userToken
  let currentUser

  beforeEach(() => {
    objectId = null
    userToken = null
    currentUser = null
  })

  const login = async () => {
    objectId = Utils.objectId()
    userToken = Utils.uid()

    prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

    await Backendless.UserService.login('foo@bar.com', '123456', true)
  }

  it('loggedInUser returns user-id from LocalCache', async () => {
    expect(Backendless.UserService.loggedInUser()).to.be.equal(null)

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    expect(Backendless.UserService.loggedInUser()).to.be.equal('test-id')

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, null)

    expect(Backendless.UserService.loggedInUser()).to.be.equal(null)
  })

  it('getCurrentUserId returns user-id from LocalCache', async () => {
    expect(Backendless.UserService.getCurrentUserId()).to.be.equal(null)

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    expect(Backendless.UserService.getCurrentUserId()).to.be.equal('test-id')

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, null)

    expect(Backendless.UserService.getCurrentUserId()).to.be.equal(null)
  })

  it('has no current user before login', async () => {
    currentUser = await Backendless.UserService.getCurrentUser()

    expect(currentUser).to.be.equal(null)
  })

  it('returns current user after login', async () => {
    await login()

    currentUser = await Backendless.UserService.getCurrentUser()

    expect(currentUser).to.be.an.instanceof(Backendless.User)
    expect(currentUser.___class).to.be.equal('Users')
    expect(currentUser.objectId).to.be.equal(objectId)
    expect(currentUser['user-token']).to.be.equal(userToken)
  })

  it('returns current user after login', async () => {
    await login()

    currentUser = await Backendless.UserService.getCurrentUser()

    expect(currentUser).to.be.an.instanceof(Backendless.User)
    expect(currentUser.___class).to.be.equal('Users')
    expect(currentUser.objectId).to.be.equal(objectId)
    expect(currentUser['user-token']).to.be.equal(userToken)
  })

  it('gets the current user from the server by id', async () => {
    const req1 = prepareMockRequest({ objectId: '111', name: 'foo', age: 123 })

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    const currentUser = await Backendless.UserService.getCurrentUser()

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/data/User/test-id`,
      headers: {},
      body   : undefined
    })

    expect(currentUser).to.be.an.instanceof(Backendless.User)
    expect(currentUser.___class).to.be.equal('Users')
    expect(currentUser.objectId).to.be.equal('111')
    expect(currentUser['user-token']).to.be.equal(undefined)
  })

  it('returns the same promise result for getting the current user from the server by id', async () => {
    prepareMockRequest(() => ({ delay: 200, body: { objectId: '1' } }))
    prepareMockRequest(() => ({ delay: 200, body: { objectId: '2' } })) // won't be requested
    prepareMockRequest(() => ({ delay: 200, body: { objectId: '3' } })) // won't be requested

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    const currentUserPromise1 = Backendless.UserService.getCurrentUser()
    const currentUserPromise2 = Backendless.UserService.getCurrentUser()
    const currentUserPromise3 = Backendless.UserService.getCurrentUser()

    const currentUser1 = await currentUserPromise1
    const currentUser2 = await currentUserPromise2
    const currentUser3 = await currentUserPromise3

    expect(currentUser1.objectId)
      .to.be.equal(currentUser2.objectId)
      .to.be.equal(currentUser3.objectId)
      .to.be.equal('1')
  })

  it('resets currentUserRequest when it is failed', async () => {
    prepareMockRequest(() => ({ status: 400, body: { message: 'test-error' } })) // for first two requests
    prepareMockRequest(() => ({ status: 200, body: { objectId: '3' } }))

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    const currentUserPromise1 = Backendless.UserService.getCurrentUser()
    const currentUserPromise2 = Backendless.UserService.getCurrentUser()

    let error1
    let error2

    try {
      await currentUserPromise1
    } catch (e) {
      error1 = e
    }

    try {
      await currentUserPromise2
    } catch (e) {
      error2 = e
    }

    expect(error1.message).to.be.equal(error2.message).to.be.equal('test-error')

    const currentUser3 = await Backendless.UserService.getCurrentUser()

    expect(currentUser3.objectId).to.be.equal('3')
  })

  it('resets currentUserRequest when it is completed', async () => {
    prepareMockRequest({ objectId: '1' })
    prepareMockRequest({ objectId: '2' })
    prepareMockRequest({ objectId: '3' })

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.CURRENT_USER_ID, 'test-id')

    const currentUser1 = await Backendless.UserService.getCurrentUser()

    delete Backendless.UserService.currentUser

    const currentUser2 = await Backendless.UserService.getCurrentUser()

    delete Backendless.UserService.currentUser

    const currentUser3 = await Backendless.UserService.getCurrentUser()

    expect(currentUser1.objectId).to.be.equal('1')
    expect(currentUser2.objectId).to.be.equal('2')
    expect(currentUser3.objectId).to.be.equal('3')
  })

  it('checks if current user token is valid', async () => {
    const req1 = prepareMockRequest(true)
    const req2 = prepareMockRequest(false)

    Backendless.LocalCache.set(Backendless.LocalCache.Keys.USER_TOKEN, 'test-token')

    const result1 = await Backendless.UserService.isValidLogin()
    const result2 = await Backendless.UserService.isValidLogin()

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/users/isvalidusertoken/test-token`,
      headers: { 'user-token': 'test-token' },
      body   : undefined
    })

    expect(req2).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/users/isvalidusertoken/test-token`,
      headers: { 'user-token': 'test-token' },
      body   : undefined
    })

    expect(result1).to.be.equal(true)
    expect(result2).to.be.equal(false)
  })

  it('returns false if there is no userToken', async () => {
    const result1 = await Backendless.UserService.isValidLogin()

    expect(result1).to.be.equal(false)
  })

})

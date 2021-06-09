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

describe('<Users> Login', function() {

  forTest(this)

  it('login with email and password', async () => {
    const objectId = Utils.objectId()
    const userToken = Utils.uid()

    const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

    const user1 = await Backendless.UserService.login('foo@bar.com', '123456')

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/login`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        login   : 'foo@bar.com',
        password: '123456',
      }
    })

    expect(user1).to.be.an.instanceof(Backendless.User)
    expect(user1.___class).to.be.equal('Users')
    expect(user1.objectId).to.be.equal(objectId)
    expect(user1['user-token']).to.be.equal(userToken)

    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)
  })

  it('fails when login has incorrect type', async () => {
    const errorMsg = 'the first argument must be either a string or a number'

    await expect(Backendless.UserService.login(undefined, '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login(null, '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login(true, '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login(false, '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login({}, '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login([], '123')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login(() => ({}), '123')).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when login is missed', async () => {
    const errorMsg = 'the first argument cannot be an empty value'

    await expect(Backendless.UserService.login(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login('')).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when password is missed', async () => {
    const errorMsg = 'the "password" value cannot be an empty value'

    await expect(Backendless.UserService.login('foo@bar.com', null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login('foo@bar.com', '')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.UserService.login('foo@bar.com', 0)).to.eventually.be.rejectedWith(errorMsg)
  })

  it('login with objectId', async () => {
    const objectId = Utils.objectId()
    const userToken = Utils.uid()

    const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })
    const req2 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

    const user1 = await Backendless.UserService.login(objectId)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/login`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        objectId
      }
    })

    expect(user1).to.be.an.instanceof(Backendless.User)
    expect(user1.___class).to.be.equal('Users')
    expect(user1.objectId).to.be.equal(objectId)
    expect(user1['user-token']).to.be.equal(userToken)

    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)

    const user2 = await Backendless.UserService.login(objectId, false)

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/users/login`,
      headers: { 'Content-Type': 'application/json', 'user-token': userToken },
      body   : {
        objectId
      }
    })

    expect(user2).to.be.an.instanceof(Backendless.User)
    expect(user2.___class).to.be.equal('Users')
    expect(user2.objectId).to.be.equal(objectId)
    expect(user2['user-token']).to.be.equal(userToken)

    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
    expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)
  })

  describe('with stayLoggedIn', () => {
    it('login with email and password', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.login('foo@bar.com', '123456', true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          login   : 'foo@bar.com',
          password: '123456',
        }
      })

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user1.___class).to.be.equal('Users')
      expect(user1.objectId).to.be.equal(objectId)
      expect(user1['user-token']).to.be.equal(userToken)

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)
    })

    it('get current user id', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      await Backendless.UserService.login('foo@bar.com', '123456', true)

      expect(Backendless.UserService.getCurrentUserId()).to.be.equal(objectId)
    })

    it('login with objectId', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.login(objectId, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          objectId
        }
      })

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user1.___class).to.be.equal('Users')
      expect(user1.objectId).to.be.equal(objectId)
      expect(user1['user-token']).to.be.equal(userToken)

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)
    })
  })

  describe('guest', () => {

    it('with stayLoggedIn=true', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginAsGuest(true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/register/guest`,
        headers: {},
        body   : undefined
      })

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user1.___class).to.be.equal('Users')
      expect(user1.objectId).to.be.equal(objectId)
      expect(user1['user-token']).to.be.equal(userToken)

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)
    })

    it('with stayLoggedIn=false', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginAsGuest(false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/register/guest`,
        headers: {},
        body   : undefined
      })

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user1.___class).to.be.equal('Users')
      expect(user1.objectId).to.be.equal(objectId)
      expect(user1['user-token']).to.be.equal(userToken)

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)
    })

    it('with stayLoggedIn=undefined', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginAsGuest(false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/register/guest`,
        headers: {},
        body   : undefined
      })

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user1.___class).to.be.equal('Users')
      expect(user1.objectId).to.be.equal(objectId)
      expect(user1['user-token']).to.be.equal(userToken)

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)
    })

  })

  describe('logout', () => {

    let objectId
    let userToken

    const login = async () => {
      objectId = Utils.objectId()
      userToken = Utils.uid()

      prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      await Backendless.UserService.login('foo@bar.com', '123456', true)
    }

    beforeEach(async () => {
      await login()
    })

    it('sends correct request', async () => {
      const req1 = prepareMockRequest()

      await Backendless.UserService.logout()

      expect(req1).to.deep.include({
        method : 'GET',
        path   : `${APP_PATH}/users/logout`,
        headers: { 'user-token': userToken },
        body   : undefined
      })

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)
    })

    it('clear current user even when exception is caused', async () => {
      const check = async errorCode => {
        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)

        prepareMockRequest(() => ({ status: 400, body: { code: errorCode, message: 'test login error' }, }))

        let error

        try {
          await Backendless.UserService.logout()
        } catch (e) {
          error = e
        }

        expect(error.code).to.be.equal(errorCode)
        expect(error.message).to.be.equal('test login error')

        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(undefined)
        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(undefined)
        expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(undefined)

        await login()
      }

      await check(3023)
      await check(3064)
      await check(3090)
      await check(3091)
    })

    it('do not clear current user even when exception is caused', async () => {
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)

      prepareMockRequest(() => ({ status: 400, body: { code: 12345, message: 'test login error' }, }))

      let error

      try {
        await Backendless.UserService.logout()
      } catch (e) {
        error = e
      }

      expect(error.code).to.be.equal(12345)
      expect(error.message).to.be.equal('test login error')

      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.CURRENT_USER_ID)).to.be.equal(objectId)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.USER_TOKEN)).to.be.equal(userToken)
      expect(Backendless.LocalCache.get(Backendless.LocalCache.Keys.STAY_LOGGED_IN)).to.be.equal(true)
    })

  })

})

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

describe('<Users> Social Login with SDK', function() {

  forTest(this)

  const accessToken = 'test-access-token'

  const fieldsMapping = {
    foo: 'foo',
    bar: 'bar'
  }

  describe('Facebook', () => {
    it('login', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithFacebookSdk(accessToken)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/facebook/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
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

    it('login with fieldsMapping', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithFacebookSdk(accessToken, fieldsMapping)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/facebook/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          fieldsMapping
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

    it('login with fieldsMapping and stayLoggedIn', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithFacebookSdk(accessToken, fieldsMapping, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/facebook/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          fieldsMapping
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

    it('login with stayLoggedIn', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithFacebookSdk(accessToken, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/facebook/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
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

    it('fails when accessToken is invalid', async () => {
      const errorMsg = '"accessToken" must be non empty string.'

      await expect(Backendless.UserService.loginWithFacebookSdk()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithFacebookSdk(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('Google', () => {
    it('login', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithGooglePlusSdk(accessToken)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/googleplus/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
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

    it('login with fieldsMapping', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithGooglePlusSdk(accessToken, fieldsMapping)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/googleplus/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          fieldsMapping
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

    it('login with fieldsMapping and stayLoggedIn', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithGooglePlusSdk(accessToken, fieldsMapping, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/googleplus/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          fieldsMapping
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

    it('login with stayLoggedIn', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithGooglePlusSdk(accessToken, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/googleplus/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
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

    it('fails when accessToken is invalid', async () => {
      const errorMsg = '"accessToken" must be non empty string.'

      await expect(Backendless.UserService.loginWithGooglePlusSdk()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithGooglePlusSdk(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})

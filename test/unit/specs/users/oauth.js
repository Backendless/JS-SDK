import { expect } from 'chai'
import { describe, it } from 'mocha'
import Backendless, { APP_PATH, forTest, prepareMockRequest, Utils } from '../../helpers/sandbox'

function getTestUserObject() {
  return {
    email   : 'foo@bar.com',
    password: '123456',
    name    : 'Bob Miller'
  }
}

describe('<Users> OAuth Login', function() {
  forTest(this)

  const accessToken = 'test-access-token'

  const fieldsMapping = {
    foo: 'foo',
    bar: 'bar'
  }

  describe('OAuth 2.0', () => {
    it('login', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken)

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

      const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, fieldsMapping)

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

      const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, fieldsMapping, true)

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

      const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, true)

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

    describe('with guestUser argument', () => {
      const guestObjectId = Utils.objectId()
      const guestUserToken = Utils.uid()
      const guestUser = new Backendless.User({
        objectId    : guestObjectId,
        'user-token': guestUserToken,
        userStatus  : 'GUEST'
      })

      it('login with guestUser', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, guestUser)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/facebook/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            guestUser
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

      it('login with guestUser and fieldsMapping', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, guestUser, fieldsMapping)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/facebook/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            guestUser,
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

      it('login with guestUser and fieldsMapping and stayLoggedIn', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, guestUser, fieldsMapping, true)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/facebook/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            guestUser,
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

      it('login with guestUser and stayLoggedIn', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth2('facebook', accessToken, guestUser, true)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/facebook/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            guestUser
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

      it('retrieves authorization url', async () => {
        const url = 'https://authorization-url-example.com'
        const provideCode = 'google'
        const scope = 'email;photo'
        const redirect = false
        const redirectAfterLoginUrl = 'https://authorization-redirect-url-example.com'
        const callbackUrlDomain = 'foo.bar'

        const req = prepareMockRequest(url)

        const authorizationURL = await Backendless.UserService.getAuthorizationUrlLink(provideCode, fieldsMapping, scope, redirect, redirectAfterLoginUrl, callbackUrlDomain)

        expect(req).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/oauth/${provideCode}/request_url`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            fieldsMapping,
            permissions: scope,
            redirect,
            redirectAfterLoginUrl,
            callbackUrlDomain,
          }
        })

        expect(authorizationURL).to.be.equal(url)
      })
    })

    it('fails when providerCode is invalid', async () => {
      const errorMsg = '"providerCode" must be non empty string.'

      await expect(Backendless.UserService.loginWithOauth2()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when accessToken is invalid', async () => {
      const errorMsg = '"accessToken" must be non empty string.'

      await expect(Backendless.UserService.loginWithOauth2('facebook')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth2('facebook', () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('OAuth 1.0', () => {
    const accessTokenSecret = 'test-access-token-secret'

    it('login', async () => {
      const objectId = Utils.objectId()
      const userToken = Utils.uid()

      const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

      const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/twitter/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          accessTokenSecret
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

      const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, fieldsMapping)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/twitter/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          accessTokenSecret,
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

      const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, fieldsMapping, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/twitter/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          accessTokenSecret,
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

      const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/twitter/login`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          accessToken,
          accessTokenSecret
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

    describe('with guestUser argument', () => {
      const guestObjectId = Utils.objectId()
      const guestUserToken = Utils.uid()
      const guestUser = new Backendless.User({
        objectId    : guestObjectId,
        'user-token': guestUserToken,
        userStatus  : 'GUEST'
      })

      it('login with guestUser', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, guestUser)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/twitter/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            accessTokenSecret,
            guestUser
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

      it('login with guestUser and fieldsMapping', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, guestUser, fieldsMapping)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/twitter/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            accessTokenSecret,
            guestUser,
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

      it('login with guestUser and fieldsMapping and stayLoggedIn', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, guestUser, fieldsMapping, true)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/twitter/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            accessTokenSecret,
            guestUser,
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

      it('login with guestUser and stayLoggedIn', async () => {
        const objectId = Utils.objectId()
        const userToken = Utils.uid()

        const req1 = prepareMockRequest({ ...getTestUserObject(), objectId, 'user-token': userToken })

        const user1 = await Backendless.UserService.loginWithOauth1('twitter', accessToken, accessTokenSecret, guestUser, true)

        expect(req1).to.deep.include({
          method : 'POST',
          path   : `${APP_PATH}/users/social/twitter/login`,
          headers: { 'Content-Type': 'application/json' },
          body   : {
            accessToken,
            accessTokenSecret,
            guestUser
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

    it('fails when providerCode is invalid', async () => {
      const errorMsg = '"providerCode" must be non empty string.'

      await expect(Backendless.UserService.loginWithOauth1()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when accessToken is invalid', async () => {
      const errorMsg = '"accessToken" must be non empty string.'

      await expect(Backendless.UserService.loginWithOauth1('twitter')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when accessTokenSecret is invalid', async () => {
      const errorMsg = '"accessTokenSecret" must be non empty string.'

      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.UserService.loginWithOauth1('twitter', accessToken, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })
})

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

describe('<Users> Social Login with Container', function() {

  forTest(this)

  this.timeout(10000)

  let cleanupDom
  let container

  let objectId
  let userToken

  let dispatchLoginEvent

  let openNewWindowWithError

  beforeEach(() => {
    objectId = Utils.objectId()
    userToken = Utils.uid()

    cleanupDom = require('global-jsdom')()

    openNewWindowWithError = null

    dispatchLoginEvent = (timeout, fault, origin) => setTimeout(() => {
      const event = new window.Event('message')

      event.origin = origin || Backendless.serverURL
      event.data = JSON.stringify(fault ? { fault } : {
        ...getTestUserObject(),
        objectId,
        'user-token': userToken,
      })
      window.dispatchEvent(event)
    }, timeout || 200)

    window.open = chai.spy(() => {
      const doc = document.createElement('div')
      const html = document.createElement('html')
      const body = document.createElement('body')

      doc.append(html)
      html.append(body)

      const timer = dispatchLoginEvent(0, openNewWindowWithError)

      const close = () => {
        if (timer) {
          clearTimeout(timer)
        }
      }

      return container = {
        onload  : () => null,
        close,
        location: {},
        document: doc,
      }
    })
  })

  afterEach(() => {

    cleanupDom()
  })

  const accessToken = 'test-access-token'

  const fieldsMapping = {
    foo: 'foo',
    bar: 'bar'
  }

  const permissions = [
    'field-1',
    'field-2',
    'field-3',
  ]

  describe('Facebook', () => {
    it('login', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/facebook/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping: {},
          permissions  : [],
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

    it('should use different event listeners ', async () => {
      prepareMockRequest('http://test-social-url')
      prepareMockRequest('http://test-social-url')
      prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook()

      const addEventListener = window.addEventListener
      const removeEventListener = window.removeEventListener

      window.attachEvent = (event, callback) => {
        addEventListener(event.replace('on', ''), callback)
      }
      window.detachEvent = (event, callback) => {
        removeEventListener(event.replace('on', ''), callback)
      }

      window.addEventListener = null
      window.removeEventListener = null

      const user2 = await Backendless.UserService.loginWithFacebook()

      window.attachEvent = null
      window.detachEvent = null

      let lastCallback

      Object.defineProperty(window, 'message', {
        set(callback) {
          if (callback) {
            addEventListener('message', lastCallback = callback)
          } else {
            removeEventListener('message', lastCallback)
          }
        }
      })

      const user3 = await Backendless.UserService.loginWithFacebook()

      expect(user1).to.be.an.instanceof(Backendless.User)
      expect(user2).to.be.an.instanceof(Backendless.User)
      expect(user3).to.be.an.instanceof(Backendless.User)
    })

    it('login with fieldsMapping', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook(fieldsMapping, [], false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/facebook/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions: [],
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

    it('login with fieldsMapping, permissions', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook(fieldsMapping, permissions, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/facebook/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('login with fieldsMapping, permissions and stayLoggedIn', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook(fieldsMapping, permissions, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/facebook/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('should fail when OAuth request is failed', async () => {
      prepareMockRequest(() => {
        throw new Error('test-error')
      })

      const requestPromise1 = Backendless.UserService.loginWithFacebook()

      await expect(requestPromise1).to.eventually.be.rejectedWith('test-error')
    })

    it('should fail on login with container', async () => {
      prepareMockRequest('http://test-social-url')

      openNewWindowWithError = 'my test error'

      const loginPromise1 = Backendless.UserService.loginWithFacebook()

      await expect(loginPromise1).to.eventually.be.rejectedWith('my test error')
    })

  })

  describe('Google', () => {
    it('login', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping: {},
          permissions  : [],
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
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, [], null, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions: [],
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

    it('login with fieldsMapping, permissions', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, null, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('login with fieldsMapping, permissions and stayLoggedIn', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, null, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('login with container', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, container, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('login with containers', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, [container], false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('login with container with stayLoggedIn', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, [container], true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('should ignore event with invalid origin', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500, null, 'http://invalid.com')
      dispatchLoginEvent(1000)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, container, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/googleplus/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions,
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

    it('should fail when OAuth request is failed', async () => {
      prepareMockRequest(() => {
        throw new Error('test-error')
      })

      const requestPromise1 = Backendless.UserService.loginWithGooglePlus()

      await expect(requestPromise1).to.eventually.be.rejectedWith('test-error')
    })

    it('should fail on login with container', async () => {
      prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500, 'my test error')

      const loginPromise1 = Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, container, false)

      await expect(loginPromise1).to.eventually.be.rejectedWith('my test error')
    })

  })

  describe('Twitter', () => {
    it('login', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithTwitter()

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/twitter/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping: {},
          permissions  : [],
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
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithTwitter(fieldsMapping, false)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/twitter/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions: [],
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

    it('login with fieldsMapping, stayLoggedIn', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithTwitter(fieldsMapping, true)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/users/social/oauth/twitter/request_url`,
        headers: { 'Content-Type': 'application/json' },
        body   : {
          fieldsMapping,
          permissions: [],
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

    it('should fail when OAuth request is failed', async () => {
      prepareMockRequest(() => {
        throw new Error('test-error')
      })

      const requestPromise1 = Backendless.UserService.loginWithTwitter()

      await expect(requestPromise1).to.eventually.be.rejectedWith('test-error')
    })

    it('should fail on login with container', async () => {
      prepareMockRequest('http://test-social-url')

      openNewWindowWithError = 'my test error'

      const loginPromise1 = Backendless.UserService.loginWithTwitter(fieldsMapping, true)

      await expect(loginPromise1).to.eventually.be.rejectedWith('my test error')
    })

  })

})

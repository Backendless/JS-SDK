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

  beforeEach(() => {
    objectId = Utils.objectId()
    userToken = Utils.uid()

    cleanupDom = require('jsdom-global')()

    dispatchLoginEvent = timeout => setTimeout(() => {
      const event = new Event('message')

      event.origin = Backendless.serverURL
      event.data = JSON.stringify({
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

      dispatchLoginEvent()

      return container = {
        onload  : () => null,
        close   : () => null,
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
    xit('login', async () => {
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

    xit('login with fieldsMapping', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook(fieldsMapping)

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

    xit('login with fieldsMapping, permissions', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithFacebook(fieldsMapping, permissions)

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
  })

  describe('Google', () => {
    xit('login', async () => {
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

    xit('login with fieldsMapping', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping)

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

    xit('login with fieldsMapping, permissions', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions)

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

    xit('login with container', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, container)

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

    xit('login with container with stayLoggedIn', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const container = document.createElement('div')

      dispatchLoginEvent(500)

      const user1 = await Backendless.UserService.loginWithGooglePlus(fieldsMapping, permissions, container, true)

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

  })

  describe('Twitter', () => {
    xit('login', async () => {
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

    xit('login with fieldsMapping', async () => {
      const req1 = prepareMockRequest('http://test-social-url')

      const user1 = await Backendless.UserService.loginWithTwitter(fieldsMapping)

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
  })

})

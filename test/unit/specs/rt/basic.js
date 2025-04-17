import chai, { expect } from 'chai'
import spies from 'chai-spies'
import { describe, it } from 'mocha'

chai.use(spies)

import Backendless, {
  forTest,
  prepareMockRequest,
  createMockRTServer,
  API_KEY,
  Utils
} from '../../helpers/sandbox'

describe('<RT> Basic', function() {

  forTest(this)

  this.timeout(5000)

  let rtClient

  const channelName = 'TEST_CHANNEL_NAME'
  const host = 'http://localhost:12345'

  describe('with AppID and API Key', function() {
    const backendlessApp = Backendless

    before(async () => {
      rtClient = await createMockRTServer()

      backendlessApp.appInfoPromise = chai.spy(() =>
        Promise.resolve({ rtURL: host })
      )
    })

    after(async () => {
      await Utils.wait(100)

      rtClient.stop()
    })

    it('connect and subscribe', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      backendlessApp.Messaging.subscribe(channelName)

      await Utils.wait(2000)

      const con1 = await rtClient.getNext_CONNECT()

      expect(con1.apiKey).to.be.equal(API_KEY)
      expect(con1.userToken).to.be.equal(null)
      expect(con1.clientId).to.be.a('string')

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('connected with user token', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      prepareMockRequest({ objectId: 'test-id', 'user-token': 'test-token-1' })

      await backendlessApp.UserService.login('login', 'password')

      backendlessApp.Messaging.subscribe(channelName)

      const con1 = await rtClient.getNext_CONNECT()

      expect(con1.apiKey).to.be.equal(API_KEY)
      expect(con1.userToken).to.be.equal('test-token-1')
      expect(con1.clientId).to.be.a('string')
      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('reconnects after changing debug mode', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      backendlessApp.Messaging.subscribe(channelName)

      const con1 = await rtClient.getNext_CONNECT()

      backendlessApp.debugMode = true

      const con2 = await rtClient.getNext_CONNECT()

      backendlessApp.debugMode = false

      const con3 = await rtClient.getNext_CONNECT()

      expect(con1.clientId)
        .to.be.equal(con2.clientId)
        .to.be.equal(con3.clientId)

      expect(con1.connectionId)
        .to.not.equal(con2.connectionId)
        .to.not.equal(con3.connectionId)

      expect(con1.apiKey).to.be.equal(API_KEY)
      expect(con1.userToken).to.be.equal(null)
      expect(con1.clientId).to.be.a('string')

      expect(con2.apiKey).to.be.equal(API_KEY)
      expect(con2.userToken).to.be.equal(null)
      expect(con2.clientId).to.be.a('string')

      expect(con3.apiKey).to.be.equal(API_KEY)
      expect(con3.userToken).to.be.equal(null)
      expect(con3.clientId).to.be.a('string')

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('updates connection user-token after login/logout', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      prepareMockRequest({ objectId: 'test-id-1', 'user-token': 'test-token-1' })
      prepareMockRequest({ objectId: 'test-id-2', 'user-token': 'test-token-2' })
      prepareMockRequest()

      backendlessApp.Messaging.subscribe(channelName)

      await rtClient.getNext_CONNECT()

      const met1Promise = rtClient.getNext_MET_REQ()
      const met2Promise = rtClient.getNext_MET_REQ()
      const met3Promise = rtClient.getNext_MET_REQ()

      backendlessApp.UserService.login('login', 'password')

      const met1 = await met1Promise

      backendlessApp.UserService.login('login', 'password')

      const met2 = await met2Promise

      backendlessApp.UserService.logout()

      const met3 = await met3Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('SET_USER_TOKEN')
      expect(met1.options).to.be.eql({ userToken: 'test-token-1' })

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('SET_USER_TOKEN')
      expect(met2.options).to.be.eql({ userToken: 'test-token-2' })

      expect(met3.id).to.be.a('string')
      expect(met3.name).to.be.equal('SET_USER_TOKEN')
      expect(met3.options).to.be.eql({ userToken: null })

      expect(met1.id).to.be.not.equal(met2.id)
      expect(met1.id).to.be.not.equal(met3.id)
      expect(met2.id).to.be.not.equal(met3.id)

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('should update connection user-token after setCurrentUserToken', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      backendlessApp.Messaging.subscribe(channelName)

      await rtClient.getNext_CONNECT()

      const met1Promise = rtClient.getNext_MET_REQ()
      const met2Promise = rtClient.getNext_MET_REQ()

      backendlessApp.UserService.currentUser = {}
      backendlessApp.UserService.setCurrentUserToken('new-token')

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('SET_USER_TOKEN')
      expect(met1.options).to.be.eql({ userToken: 'new-token' })

      backendlessApp.UserService.setCurrentUserToken()

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('SET_USER_TOKEN')
      expect(met2.options).to.be.eql({ userToken: null })

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('should not set user-token after setCurrentUserToken', async () => {
      backendlessApp.RT.methods.setUserToken = chai.spy()

      backendlessApp.UserService.setCurrentUserToken('new-token')

      expect(backendlessApp.RT.methods.setUserToken).to.not.have.been.called()
    })
  })

  describe('with custom domain', function() {
    const domain = 'https://my-custom-domain.com'
    const rtAppId = 'rt-app-id'
    const rtAPIKey = 'rt-api-key'

    let backendlessApp

    before(async () => {
      rtClient = await createMockRTServer(rtAppId)
    })

    beforeEach(async () => {
      backendlessApp = Backendless.initApp({
        domain,
        standalone: true,
      })

      backendlessApp.appInfoPromise = chai.spy(() =>
        Promise.resolve({ appId: rtAppId, apiKey: rtAPIKey, rtURL: host })
      )
    })

    afterEach(async () => {
      backendlessApp.initApp() //in order to reset rt/userToken/etc
    })

    after(async () => {
      await Utils.wait(100)

      rtClient.stop()
    })

    it('connected', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      backendlessApp.Messaging.subscribe(channelName)

      await Utils.wait(2000)

      const con1 = await rtClient.getNext_CONNECT()

      expect(con1.apiKey).to.be.equal(rtAPIKey)
      expect(con1.userToken).to.be.equal(null)
      expect(con1.clientId).to.be.a('string')

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('connection with user token', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      prepareMockRequest({ objectId: 'test-id', 'user-token': 'test-token-1' })

      await backendlessApp.UserService.login('login', 'password')

      backendlessApp.Messaging.subscribe(channelName)

      const con1 = await rtClient.getNext_CONNECT()

      expect(con1.apiKey).to.be.equal(rtAPIKey)
      expect(con1.userToken).to.be.equal('test-token-1')
      expect(con1.clientId).to.be.a('string')

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('reconnects after changing debug mode', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      backendlessApp.Messaging.subscribe(channelName)

      const con1 = await rtClient.getNext_CONNECT()

      backendlessApp.debugMode = true

      const con2 = await rtClient.getNext_CONNECT()

      backendlessApp.debugMode = false

      const con3 = await rtClient.getNext_CONNECT()

      expect(con1.clientId)
        .to.be.equal(con2.clientId)
        .to.be.equal(con3.clientId)

      expect(con1.connectionId)
        .to.not.equal(con2.connectionId)
        .to.not.equal(con3.connectionId)

      expect(con1.apiKey).to.be.equal(rtAPIKey)
      expect(con1.userToken).to.be.equal(null)
      expect(con1.clientId).to.be.a('string')

      expect(con2.apiKey).to.be.equal(rtAPIKey)
      expect(con2.userToken).to.be.equal(null)
      expect(con2.clientId).to.be.a('string')

      expect(con3.apiKey).to.be.equal(rtAPIKey)
      expect(con3.userToken).to.be.equal(null)
      expect(con3.clientId).to.be.a('string')

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('updates connection user-token after login/logout', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      prepareMockRequest({ objectId: 'test-id-1', 'user-token': 'test-token-1' })
      prepareMockRequest({ objectId: 'test-id-2', 'user-token': 'test-token-2' })
      prepareMockRequest()

      backendlessApp.Messaging.subscribe(channelName)

      await rtClient.getNext_CONNECT()

      const met1Promise = rtClient.getNext_MET_REQ()
      const met2Promise = rtClient.getNext_MET_REQ()
      const met3Promise = rtClient.getNext_MET_REQ()

      backendlessApp.UserService.login('login', 'password')

      const met1 = await met1Promise

      backendlessApp.UserService.login('login', 'password')

      const met2 = await met2Promise

      backendlessApp.UserService.logout()

      const met3 = await met3Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('SET_USER_TOKEN')
      expect(met1.options).to.be.eql({ userToken: 'test-token-1' })

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('SET_USER_TOKEN')
      expect(met2.options).to.be.eql({ userToken: 'test-token-2' })

      expect(met3.id).to.be.a('string')
      expect(met3.name).to.be.equal('SET_USER_TOKEN')
      expect(met3.options).to.be.eql({ userToken: null })

      expect(met1.id).to.be.not.equal(met2.id)
      expect(met1.id).to.be.not.equal(met3.id)
      expect(met2.id).to.be.not.equal(met3.id)

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('should update connection user-token after setCurrentUserToken', async () => {
      expect(backendlessApp.appInfoPromise).to.not.have.been.called

      prepareMockRequest()

      backendlessApp.Messaging.subscribe(channelName)

      await rtClient.getNext_CONNECT()

      const met1Promise = rtClient.getNext_MET_REQ()
      const met2Promise = rtClient.getNext_MET_REQ()

      backendlessApp.UserService.currentUser = {}
      backendlessApp.UserService.setCurrentUserToken('new-token')

      const met1 = await met1Promise

      expect(met1.id).to.be.a('string')
      expect(met1.name).to.be.equal('SET_USER_TOKEN')
      expect(met1.options).to.be.eql({ userToken: 'new-token' })

      backendlessApp.UserService.setCurrentUserToken()

      const met2 = await met2Promise

      expect(met2.id).to.be.a('string')
      expect(met2.name).to.be.equal('SET_USER_TOKEN')
      expect(met2.options).to.be.eql({ userToken: null })

      expect(backendlessApp.appInfoPromise).to.have.been.called
    })

    it('should not set user-token after setCurrentUserToken', async () => {
      backendlessApp.RT.methods.setUserToken = chai.spy()

      backendlessApp.UserService.setCurrentUserToken('new-token')

      expect(backendlessApp.RT.methods.setUserToken).to.not.have.been.called()
    })
  })
})

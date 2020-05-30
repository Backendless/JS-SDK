import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest, createMockRTServer, APP_PATH, API_KEY, Utils } from '../../helpers/sandbox'

describe('<RT> Basic', function() {

  forTest(this)

  this.timeout(5000)

  let rtClient

  before(async () => {
    rtClient = await createMockRTServer()
  })

  after(async () => {
    await Utils.wait(100)

    rtClient.stop()
  })

  const channelName = 'TEST_CHANNEL_NAME'

  it('lookup', async () => {
    const req1 = prepareMockRequest(rtClient.host)

    Backendless.Messaging.subscribe(channelName)

    await Utils.wait(2000)

    const con1 = await rtClient.getNext_CONNECT()

    expect(con1.apiKey).to.be.equal(API_KEY)
    expect(con1.userToken).to.be.equal(null)
    expect(con1.clientId).to.be.a('string')

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/rt/lookup`,
      headers: {},
      body   : undefined
    })
  })

  it('lookup with user token', async () => {
    prepareMockRequest({ objectId: 'test-id', 'user-token': 'test-token-1' })
    prepareMockRequest(rtClient.host)

    await Backendless.UserService.login('login', 'password')

    Backendless.Messaging.subscribe(channelName)

    const con1 = await rtClient.getNext_CONNECT()

    expect(con1.apiKey).to.be.equal(API_KEY)
    expect(con1.userToken).to.be.equal('test-token-1')
    expect(con1.clientId).to.be.a('string')
  })

  it('reconnects after changing debug mode', async () => {
    prepareMockRequest(rtClient.host)
    prepareMockRequest(rtClient.host)
    prepareMockRequest(rtClient.host)

    Backendless.Messaging.subscribe(channelName)

    const con1 = await rtClient.getNext_CONNECT()

    Backendless.debugMode = true

    const con2 = await rtClient.getNext_CONNECT()

    Backendless.debugMode = false

    const con3 = await rtClient.getNext_CONNECT()

    expect(con1.clientId)
      .to.be.equal(con2.clientId)
      .to.be.equal(con3.clientId)

    expect(con1.apiKey).to.be.equal(API_KEY)
    expect(con1.userToken).to.be.equal(null)
    expect(con1.clientId).to.be.a('string')

    expect(con2.apiKey).to.be.equal(API_KEY)
    expect(con2.userToken).to.be.equal(null)
    expect(con2.clientId).to.be.a('string')

    expect(con3.apiKey).to.be.equal(API_KEY)
    expect(con3.userToken).to.be.equal(null)
    expect(con3.clientId).to.be.a('string')
  })

  it('updates connection user-token after login/logout', async () => {
    prepareMockRequest(rtClient.host)
    prepareMockRequest({ objectId: 'test-id-1', 'user-token': 'test-token-1' })
    prepareMockRequest({ objectId: 'test-id-2', 'user-token': 'test-token-2' })
    prepareMockRequest()

    Backendless.Messaging.subscribe(channelName)

    await rtClient.getNext_CONNECT()

    const met1Promise = rtClient.getNext_MET_REQ()
    const met2Promise = rtClient.getNext_MET_REQ()
    const met3Promise = rtClient.getNext_MET_REQ()

    Backendless.UserService.login('login', 'password')

    const met1 = await met1Promise

    Backendless.UserService.login('login', 'password')

    const met2 = await met2Promise

    Backendless.UserService.logout()

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
  })

})

import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forTest, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Device', function() {

  forTest(this)

  const device = {
    uuid    : 'test-uuid',
    platform: 'test-platform',
    version : 'test-version',
  }

  const deviceToken = 'test-token'
  const channels = ['test-channel']

  const fakeResult = { foo: 123 }

  beforeEach(() => {
    Backendless.setupDevice(device)
  })

  it('registers device', async () => {
    const req1 = prepareMockRequest({ fakeResult })
    const req2 = prepareMockRequest({ fakeResult })

    const result1 = await Backendless.Messaging.registerDevice(deviceToken, channels)
    const result2 = await Backendless.Messaging.registerDevice(deviceToken)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/registrations`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        channels,
        deviceId   : 'test-uuid',
        deviceToken: 'test-token',
        os         : 'TEST-PLATFORM',
        osVersion  : 'test-version',
      }
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/registrations`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        deviceId   : 'test-uuid',
        deviceToken: 'test-token',
        os         : 'TEST-PLATFORM',
        osVersion  : 'test-version',
      }
    })

    expect(result1).to.be.eql({ fakeResult })
    expect(result2).to.be.eql({ fakeResult })
  })

  it('registers device with expiration', async () => {
    const req1 = prepareMockRequest({ fakeResult })
    const req2 = prepareMockRequest({ fakeResult })

    const date = new Date()

    const result1 = await Backendless.Messaging.registerDevice(deviceToken, channels, 1234)
    const result2 = await Backendless.Messaging.registerDevice(deviceToken, channels, date)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/registrations`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        channels,
        expiration : 1234,
        deviceId   : 'test-uuid',
        deviceToken: 'test-token',
        os         : 'TEST-PLATFORM',
        osVersion  : 'test-version',
      }
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/registrations`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        channels,
        expiration : date.getTime() / 1000,
        deviceId   : 'test-uuid',
        deviceToken: 'test-token',
        os         : 'TEST-PLATFORM',
        osVersion  : 'test-version',
      }
    })

    expect(result1).to.be.eql({ fakeResult })
    expect(result2).to.be.eql({ fakeResult })
  })

  it('gets registrations', async () => {
    const req1 = prepareMockRequest({ fakeResult })

    const result1 = await Backendless.Messaging.getRegistrations()

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/messaging/registrations/test-uuid`,
      headers: {},
      body   : undefined
    })

    expect(result1).to.be.eql({ fakeResult })
  })

  it('unregisters device', async () => {
    const req1 = prepareMockRequest({ fakeResult })

    const result1 = await Backendless.Messaging.unregisterDevice()

    expect(req1).to.deep.include({
      method : 'DELETE',
      path   : `${APP_PATH}/messaging/registrations/test-uuid`,
      headers: {},
      body   : undefined
    })

    expect(result1).to.be.eql({ fakeResult })
  })

})

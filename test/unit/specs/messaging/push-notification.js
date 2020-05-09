import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<Messaging> Push Notifications', () => {

  forSuite()

  const templateName = 'MY_PUSH_TEMPLATE'

  it('send push with template', async () => {
    const req1 = prepareMockRequest()
    const req2 = prepareMockRequest()

    await Backendless.Messaging.pushWithTemplate(templateName)
    await Backendless.Messaging.pushWithTemplate(templateName, { customValue: 'customValue' })

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/push/${templateName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : {}
    })

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/messaging/push/${templateName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : {
        templateValues: {
          customValue: 'customValue'
        }
      }
    })
  })

  it('gets push templates', async () => {
    const req1 = prepareMockRequest([{ type: 'MY_DEVICE_TYPE' }])

    const result1 = await Backendless.Messaging.getPushTemplates('MY_DEVICE_TYPE')

    expect(req1).to.deep.include({
      method : 'GET',
      path   : `${APP_PATH}/messaging/pushtemplates/MY_DEVICE_TYPE`,
      headers: {},
      body   : undefined
    })

    expect(result1).to.be.eql([{ type: 'MY_DEVICE_TYPE' }])
  })

  it('fails when deviceType is invalid', async () => {
    const errorMsg = 'Device Type must be provided and must be a string.'

    await expect(Backendless.Messaging.getPushTemplates()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.getPushTemplates(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

  it('fails when templateName is invalid', async () => {
    const errorMsg = 'Push Template Name must be provided and must be a string.'

    await expect(Backendless.Messaging.pushWithTemplate()).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(undefined)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(null)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(true)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(false)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(0)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(123)).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate('')).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate({})).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate([])).to.eventually.be.rejectedWith(errorMsg)
    await expect(Backendless.Messaging.pushWithTemplate(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
  })

})

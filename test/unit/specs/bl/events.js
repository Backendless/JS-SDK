import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<BusinessLogic> API Services', function() {

  forSuite(this)

  const eventName = 'MY_EVENT_NAME'
  const args = { foo: 'bar' }

  it('should run with parameter', async () => {
    const req1 = prepareMockRequest()
    const req2 = prepareMockRequest()
    const req3 = prepareMockRequest()

    await Backendless.BL.Events.dispatch(eventName)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/servercode/events/${eventName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : {}
    })

    await Backendless.BL.Events.dispatch(eventName, null)

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/servercode/events/${eventName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : {}
    })

    await Backendless.BL.Events.dispatch(eventName, args)

    expect(req3).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/servercode/events/${eventName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : args
    })
  })

  describe('Fails', function() {

    it('fails when eventName is not a string', async () => {
      const errorMsg = 'Event Name must be provided and must be not an empty STRING!'

      await expect(Backendless.BL.Events.dispatch()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    xit('fails when eventArgs is not an object', async () => {
      const errorMsg = 'Event Arguments must be an object.'

      await expect(Backendless.BL.Events.dispatch(eventName, 'str')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(eventName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(eventName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(eventName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.Events.dispatch(eventName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Execution Types', function() {
    it('should run with parameter', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      const req3 = prepareMockRequest()

      await Backendless.BL.Events.dispatch(eventName, args, Backendless.BL.ExecutionTypes.ASYNC)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : args,
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async'
        },
      })

      await Backendless.BL.Events.dispatch(eventName, args, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY)

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : args,
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async-low-priority'
        },
      })

      await Backendless.BL.Events.dispatch(eventName, args, Backendless.BL.ExecutionTypes.SYNC)

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : args,
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'sync'
        },
      })

    })

    it('should run without parameter', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      const req3 = prepareMockRequest()

      await Backendless.BL.Events.dispatch(eventName, Backendless.BL.ExecutionTypes.ASYNC)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : {},
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async'
        },
      })

      await Backendless.BL.Events.dispatch(eventName, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY)

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : {},
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async-low-priority'
        },
      })

      await Backendless.BL.Events.dispatch(eventName, Backendless.BL.ExecutionTypes.SYNC)

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/servercode/events/${eventName}`,
        body   : {},
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'sync'
        },
      })

    })
  })
})

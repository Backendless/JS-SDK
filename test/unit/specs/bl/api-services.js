import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { forSuite, prepareMockRequest, APP_PATH } from '../../helpers/sandbox'

describe('<BusinessLogic> API Services', function() {

  forSuite(this)

  const serviceName = 'MY_SERVICE_NAME'
  const methodName = 'MY_METHOD_NAME'
  const args = { foo: 'bar' }

  it('should run with parameter', async () => {
    const req1 = prepareMockRequest()
    const req2 = prepareMockRequest()
    const req3 = prepareMockRequest()

    await Backendless.BL.CustomServices.invoke(serviceName, methodName)

    expect(req1).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
      headers: {},
      body   : undefined,
    })

    await Backendless.BL.CustomServices.invoke(serviceName, methodName, args)

    expect(req2).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
      headers: { 'Content-Type': 'application/json' },
      body   : args
    })

    await Backendless.BL.CustomServices.invoke(serviceName, methodName, 'my value')

    expect(req3).to.deep.include({
      method : 'POST',
      path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
      headers: {},
      body   : 'my value'
    })
  })

  describe('Fails', function() {

    xit('fails when serviceName is not a string', async () => {
      const errorMsg = 'Service Name must be provided and must be a string.'

      await expect(Backendless.BL.CustomServices.invoke()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    xit('fails when methodName is not a string', async () => {
      const errorMsg = 'Method Name must be provided and must be a string.'

      await expect(Backendless.BL.CustomServices.invoke(serviceName)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.BL.CustomServices.invoke(serviceName, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

  })

  describe('Execution Types', function() {
    it('should run with parameter', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      const req3 = prepareMockRequest()

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, args, Backendless.BL.ExecutionTypes.ASYNC)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
        body   : args,
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async'
        },
      })

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, args, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY)

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
        body   : args,
        headers: {
          'Content-Type'     : 'application/json',
          'bl-execution-type': 'async-low-priority'
        },
      })

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, args, Backendless.BL.ExecutionTypes.SYNC)

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
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

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, Backendless.BL.ExecutionTypes.ASYNC)

      expect(req1).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
        body   : undefined,
        headers: {
          'bl-execution-type': 'async'
        },
      })

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY)

      expect(req2).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
        body   : undefined,
        headers: {
          'bl-execution-type': 'async-low-priority'
        },
      })

      await Backendless.BL.CustomServices.invoke(serviceName, methodName, Backendless.BL.ExecutionTypes.SYNC)

      expect(req3).to.deep.include({
        method : 'POST',
        path   : `${APP_PATH}/services/${serviceName}/${methodName}`,
        body   : undefined,
        headers: {
          'bl-execution-type': 'sync'
        },
      })

    })
  })
})

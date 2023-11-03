import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { prepareMockRequest, APP_PATH, forTest } from '../../helpers/sandbox'

describe('<Automations> Basic', function() {
  forTest(this)

  const FLOW_NAME = 'FlowName'

  describe('activate flow by name', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlowByName(FLOW_NAME)
      await Backendless.Automations.activateFlowByName(FLOW_NAME, { name: 'Nick' })

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/flow/activate-by-name`,
        body  : {
          name: 'FlowName',
        }
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/flow/activate-by-name`,
        body  : {
          name       : 'FlowName',
          initialData: {
            name: 'Nick',
          },
        }
      })

    })

    it('fails when flow name is invalid', async () => {
      const errorMsg = 'Flow Name must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowByName()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when initial data is invalid', async () => {
      const errorMsg = 'Initial data must be object with arbitrary structure.'

      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowByName(FLOW_NAME, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})

import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { prepareMockRequest, APP_PATH, forTest } from '../../helpers/sandbox'

describe('<Automations> Basic', function() {
  forTest(this)

  const FLOW_NAME = 'FlowName'
  const FLOW_ID = 'FlowID'
  const TRIGGER_ID = 'FlowID'

  describe('activate flow by name', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlowByName(FLOW_NAME)
      await Backendless.Automations.activateFlowByName(FLOW_NAME, { name: 'Nick' })

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/activate-by-name`,
        body  : {
          name: 'FlowName',
        }
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/activate-by-name`,
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

  describe('activate flow trigger', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID)
      await Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, { name: 'Nick' })

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${FLOW_ID}/trigger/${TRIGGER_ID}/activate`,
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${FLOW_ID}/trigger/${TRIGGER_ID}/activate`,
        body  : {
          name: 'Nick',
        }
      })

    })

    it('fails when flow ID is invalid', async () => {
      const errorMsg = 'Flow ID must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowTrigger()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when trigger ID is invalid', async () => {
      const errorMsg = 'Trigger ID must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, )).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID,null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when initial data is invalid', async () => {
      const errorMsg = 'Data must be object with arbitrary structure.'

      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_ID, TRIGGER_ID, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})

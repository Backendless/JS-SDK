import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { prepareMockRequest, APP_PATH, forTest } from '../../helpers/sandbox'

describe('<Automations> Basic', function() {
  forTest(this)

  const FLOW_NAME = 'FlowName'
  const TRIGGER_NAME = 'TriggerName'

  describe('activate flow by name', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlow(FLOW_NAME)
      await Backendless.Automations.activateFlow(FLOW_NAME, { name: 'Nick' })

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
      const errorMsg = 'The "flowName" argument must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlow()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when initial data is invalid', async () => {
      const errorMsg = 'The "initialData" argument must be an object with an arbitrary structure.'

      await expect(Backendless.Automations.activateFlow(FLOW_NAME, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlow(FLOW_NAME, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

  describe('activate flow trigger', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME)
      await Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, { name: 'Nick' })

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/trigger/activate-by-name?flowName=${FLOW_NAME}&triggerName=${TRIGGER_NAME}`,
        body  : {},
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/trigger/activate-by-name?flowName=${FLOW_NAME}&triggerName=${TRIGGER_NAME}`,
        body  : {
          name: 'Nick',
        }
      })

    })

    it('fails when flow name is invalid', async () => {
      const errorMsg = 'The "flowName" argument must be provided and must be a string.'

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

    it('fails when trigger name is invalid', async () => {
      const errorMsg = 'The "triggerName" argument must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, )).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME,null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when data is invalid', async () => {
      const errorMsg = 'The "data" argument must be an object with an arbitrary structure.'

      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, TRIGGER_NAME, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})

import { expect } from 'chai'
import { describe, it } from 'mocha'

import Backendless, { prepareMockRequest, APP_PATH, forTest } from '../../helpers/sandbox'

describe('<Automations> Basic', function() {
  forTest(this)

  const FLOW_NAME = 'FlowName'
  const FLOW_ID = 'FlowID'
  const EXECUTION_ID = 'ExecutionID'
  const EXECUTION_ANY = 'activateAny'
  const EXECUTION_ALL = 'activateAll'
  const TRIGGER_NAME = 'TriggerName'
  const TRIGGER_ID = 'TriggerID'

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
      const errorMsg = 'The "initialData" argument must be an object.'

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

  describe('activate flow by id', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      await Backendless.Automations.activateFlowById(FLOW_ID)
      await Backendless.Automations.activateFlowById(FLOW_ID, { name: 'Nick' })

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${FLOW_ID}/activate`,
        body  : {}
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${FLOW_ID}/activate`,
        body  : {
          name: 'Nick',
        }
      })

    })

    it('fails when flow id is invalid', async () => {
      const errorMsg = 'The "flowId" argument must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowById()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when initial data is invalid', async () => {
      const errorMsg = 'The "initialData" argument must be an object.'

      await expect(Backendless.Automations.activateFlowById(FLOW_ID, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowById(FLOW_ID, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
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

      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME,)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTrigger(FLOW_NAME, null)).to.eventually.be.rejectedWith(errorMsg)
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
      const errorMsg = 'The "data" argument must be an object.'

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

  describe('activate flow trigger by id', function() {
    it('success', async () => {
      const req1 = prepareMockRequest()
      const req2 = prepareMockRequest()
      const req3 = prepareMockRequest()
      const req4 = prepareMockRequest()
      const req5 = prepareMockRequest()

      await Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID)
      await Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, { name: 'Nick' })
      await Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, { name: 'Nick' }, EXECUTION_ID)
      await Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, { name: 'Nick' }, EXECUTION_ANY)
      await Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, { name: 'Nick' }, EXECUTION_ALL)

      expect(req1).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${ FLOW_ID }/trigger/${ TRIGGER_ID }/activate`,
        body  : {},
      })

      expect(req2).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${ FLOW_ID }/trigger/${ TRIGGER_ID }/activate`,
        body  : {
          name: 'Nick',
        }
      })

      expect(req3).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${ FLOW_ID }/trigger/${ TRIGGER_ID }/activate?executionId=ExecutionID`,
        body  : {
          name: 'Nick',
        }
      })

      expect(req4).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${ FLOW_ID }/trigger/${ TRIGGER_ID }/activate?activateAny=true`,
        body  : {
          name: 'Nick',
        }
      })

      expect(req5).to.deep.include({
        method: 'POST',
        path  : `${APP_PATH}/automation/flow/${ FLOW_ID }/trigger/${ TRIGGER_ID }/activate?activateAll=true`,
        body  : {
          name: 'Nick',
        }
      })

    })

    it('fails when flow id is invalid', async () => {
      const errorMsg = 'The "flowId" argument must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowTriggerById()).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById('')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById({})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById([])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(() => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when trigger id is invalid', async () => {
      const errorMsg = 'The "triggerId" argument must be provided and must be a string.'

      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID,)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, undefined)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, {})).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when data is invalid', async () => {
      const errorMsg = 'The "data" argument must be an object.'

      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, 'asd')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, '')).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
    })

    it('fails when execution id is invalid', async () => {
      // eslint-disable-next-line
      const errorMsg = 'The "execution" argument must be a non-empty string and must be one of this values: "activateAny", "activateAll" or executionId.'

      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, null)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, true)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, false)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, 0)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, 123)).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, [])).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, () => ({}))).to.eventually.be.rejectedWith(errorMsg)
      await expect(Backendless.Automations.activateFlowTriggerById(FLOW_ID, TRIGGER_ID, {}, '')).to.eventually.be.rejectedWith(errorMsg)
    })
  })

})

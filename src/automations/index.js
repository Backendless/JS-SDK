import Utils from '../utils'

export default class Automations {
  constructor(app) {
    this.app = app
  }

  async activateFlow(flowName, initialData) {
    if (!flowName || typeof flowName !== 'string') {
      throw new Error('The "flowName" argument must be provided and must be a string.')
    }

    if (initialData !== undefined && !Utils.isObject(initialData)) {
      throw new Error('The "initialData" argument must be an object.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlow()}/activate-by-name`,
      data: {
        name: flowName,
        initialData,
      }
    })
  }

  async loadFlowExecutionContext(executionId) {
    if (!executionId || typeof executionId !== 'string') {
      throw new Error('The "executionId" argument must be provided and must be a string.')
    }

    return this.app.request.get({
      url  : this.app.urls.automationFlowExecutionContext(executionId),
    })
  }

  async activateFlowById(flowId, initialData) {
    if (!flowId || typeof flowId !== 'string') {
      throw new Error('The "flowId" argument must be provided and must be a string.')
    }

    if (initialData !== undefined && !Utils.isObject(initialData)) {
      throw new Error('The "initialData" argument must be an object.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlow()}/${flowId}/activate`,
      data: initialData || {}
    })
  }

  async activateFlowTrigger(flowName, triggerName, data) {
    if (!flowName || typeof flowName !== 'string') {
      throw new Error('The "flowName" argument must be provided and must be a string.')
    }

    if (!triggerName || typeof triggerName !== 'string') {
      throw new Error('The "triggerName" argument must be provided and must be a string.')
    }

    if (data !== undefined && !Utils.isObject(data)) {
      throw new Error('The "data" argument must be an object.')
    }

    return this.app.request.post({
      url  : `${this.app.urls.automationFlowTrigger()}/activate-by-name`,
      query: { flowName, triggerName },
      data : data || {},
    })
  }

  async activateFlowTriggerById(flowId, triggerId, data, execution) {
    if (!flowId || typeof flowId !== 'string') {
      throw new Error('The "flowId" argument must be provided and must be a string.')
    }

    if (!triggerId || typeof triggerId !== 'string') {
      throw new Error('The "triggerId" argument must be provided and must be a string.')
    }

    if (data !== undefined && !Utils.isObject(data)) {
      throw new Error('The "data" argument must be an object.')
    }

    if (execution !== undefined && (typeof execution !== 'string' || !execution)) {
      throw new Error(
        // eslint-disable-next-line
        'The "execution" argument must be a non-empty string and must be one of this values: "any", "all" or Execution ID.'
      )
    }

    return this.app.request.post({
      url  : `${this.app.urls.automationFlow()}/${flowId}/trigger/${triggerId}/activate`,
      data : data || {},
      query: { execution },
    })
  }
}

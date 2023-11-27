import Utils from '../utils'

export default class Automations {
  constructor(app) {
    this.app = app
  }

  async activateFlowByName(flowName, initialData) {
    if (!flowName || typeof flowName !== 'string') {
      throw new Error('Flow Name must be provided and must be a string.')
    }

    if (initialData !== undefined && !Utils.isObject(initialData)) {
      throw new Error('Initial data must be object with arbitrary structure.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlow()}/activate-by-name`,
      data: {
        name: flowName,
        initialData,
      }
    })
  }

  async activateFlowTrigger(flowId, triggerId, data) {
    if (!flowId || typeof flowId !== 'string') {
      throw new Error('Flow ID must be provided and must be a string.')
    }

    if (!triggerId || typeof triggerId !== 'string') {
      throw new Error('Trigger ID must be provided and must be a string.')
    }

    if (data !== undefined && !Utils.isObject(data)) {
      throw new Error('Data must be object with arbitrary structure.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlowTrigger(flowId, triggerId)}/activate`,
      data,
    })
  }
}

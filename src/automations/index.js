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
      throw new Error('The "initialData" argument must be an object with an arbitrary structure.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlow()}/activate-by-name`,
      data: {
        name: flowName,
        initialData,
      }
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
      throw new Error('The "data" argument must be an object with an arbitrary structure.')
    }

    return this.app.request.post({
      url : `${this.app.urls.automationFlowTrigger()}/activate-by-name`,
      query: { flowName, triggerName },
      data,
    })
  }
}
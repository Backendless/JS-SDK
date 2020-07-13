import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export default class CustomServices {
  constructor(app) {
    this.app = app
  }

  async invoke(serviceName, methodName, parameters, executionType) {
    if (!serviceName || typeof serviceName !== 'string') {
      throw new Error('Service Name must be provided and must be a string.')
    }

    if (!methodName || typeof methodName !== 'string') {
      throw new Error('Method Name must be provided and must be a string.')
    }

    if (typeof parameters === 'string' && isExecutionType(parameters)) {
      executionType = parameters
      parameters = undefined
    }

    const headers = {}

    if (executionType) {
      headers[EXECUTION_TYPE_HEADER] = executionType
    }

    return this.app.request.post({
      url    : this.app.urls.blServiceMethod(serviceName, methodName),
      data   : parameters,
      headers: headers
    })
  }
}


import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export default class CustomServices {
  constructor(app) {
    this.app = app
  }

  async invoke(serviceName, methodName, parameters, options) {
    if (!serviceName || typeof serviceName !== 'string') {
      throw new Error('Service Name must be provided and must be a string.')
    }

    if (!methodName || typeof methodName !== 'string') {
      throw new Error('Method Name must be provided and must be a string.')
    }

    if (typeof options === 'string') {
      options = {
        executionType: options
      }
    }

    if (typeof parameters === 'string' && isExecutionType(parameters)) {
      options = {
        executionType: parameters
      }

      parameters = undefined
    }

    options = options || {}

    const headers = { ...options.httpRequestHeaders }

    if (options.executionType) {
      headers[EXECUTION_TYPE_HEADER] = options.executionType
    }

    return this.app.request.post({
      url    : this.app.urls.blServiceMethod(serviceName, methodName),
      data   : parameters,
      headers: headers
    })
  }
}


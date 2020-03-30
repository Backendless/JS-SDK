import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'
import Utils from '../utils'

export default class CustomServices {
  constructor(app) {
    this.app = app

    Utils.enableAsyncHandlers(this, ['invoke'])
  }

  async invoke(serviceName, method, parameters, executionType) {
    if (typeof parameters === 'string' && isExecutionType(parameters)) {
      executionType = parameters
      parameters = undefined
    }

    const headers = {}

    if (executionType) {
      headers[EXECUTION_TYPE_HEADER] = executionType
    }

    return this.app.request.post({
      url    : this.app.urls.blServiceMethod(serviceName, method),
      data   : parameters,
      headers: headers
    })
  }
}


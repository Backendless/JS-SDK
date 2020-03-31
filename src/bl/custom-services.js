import Utils from '../utils'
import { Validators } from "../validators";

import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export default class CustomServices {
  constructor(app) {
    this.app = app

    Utils.enableAsyncHandlers(this, ['invoke'])
  }

  async invoke(serviceName, methodName, parameters, executionType) {
    Validators.requiredString('Service Name', serviceName)
    Validators.requiredString('Method Name', methodName)

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


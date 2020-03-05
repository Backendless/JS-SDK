import Async from '../request/async'

import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export function invokeServiceMethod(serviceName, method, parameters, executionType, asyncHandler) {
  if (typeof parameters === 'string' && isExecutionType(parameters)) {
    asyncHandler = executionType
    executionType = parameters
    parameters = undefined
  }

  if (executionType instanceof Async) {
    asyncHandler = executionType
    executionType = undefined
  }

  if (parameters instanceof Async) {
    asyncHandler = parameters
    parameters = undefined
  }

  const headers = {}

  if (executionType) {
    headers[EXECUTION_TYPE_HEADER] = executionType
  }

  return this.app.request.post({
    url         : this.app.urls.blServiceMethod(serviceName, method),
    data        : parameters,
    isAsync     : !!asyncHandler,
    headers     : headers,
    asyncHandler: asyncHandler
  })
}

import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

export function invokeServiceMethod(serviceName, method, parameters, asyncHandler) {
  if (parameters instanceof Async) {
    asyncHandler = parameters
    parameters = undefined
  }

  return Request.post({
    url         : Urls.blServiceMethod(serviceName, method),
    data        : parameters,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

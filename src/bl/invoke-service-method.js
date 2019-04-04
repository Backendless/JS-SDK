import Async from '../request/async'

export function invokeServiceMethod(serviceName, method, parameters, asyncHandler) {
  if (parameters instanceof Async) {
    asyncHandler = parameters
    parameters = undefined
  }

  return this.backendless.request.post({
    url         : this.backendless.urls.blServiceMethod(serviceName, method),
    data        : parameters,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

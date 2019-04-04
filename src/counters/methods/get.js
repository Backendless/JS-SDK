import Utils from '../../utils'

export function get(counterName, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.backendless.request.get({
    url         : this.backendless.urls.counter(counterName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

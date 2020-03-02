import Utils from '../../utils'

export function get(counterName, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.get({
    url         : this.app.urls.counter(counterName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

import Utils from '../../utils'

export function reset(counterName, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.put({
    url         : this.app.urls.counterReset(counterName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

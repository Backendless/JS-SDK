import Utils from '../../utils'

export function getAndDecrement(counterName, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.put({
    url         : this.app.urls.counterGetAndDecrement(counterName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}



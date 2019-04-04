import Utils from '../../utils'

export function incrementAndGet(counterName, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.backendless.request.put({
    url         : this.backendless.urls.counterIncrementAndGet(counterName),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
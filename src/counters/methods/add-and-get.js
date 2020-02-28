import Utils from '../../utils'

export function addAndGet(counterName, value, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (!Utils.isNumber(value)) {
    throw new Error('Counter Value must number')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.put({
    url         : this.app.urls.counterAddAndGet(counterName),
    query       : { value },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

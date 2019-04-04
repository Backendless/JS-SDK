import Utils from '../../utils'

export function getAndAdd(counterName, value, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (!Utils.isNumber(value)) {
    throw new Error('Counter "value" must be Number')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.backendless.request.put({
    url         : this.backendless.urls.counterGetAndAdd(counterName),
    query       : { value },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

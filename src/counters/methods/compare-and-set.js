import Utils from '../../utils'

export function compareAndSet(counterName, expected, updated, asyncHandler) {
  if (!counterName || !Utils.isString(counterName)) {
    throw new Error('Counter Name must be non empty String')
  }

  if (!Utils.isNumber(expected)) {
    throw new Error('Counter "expected" value must be Number')
  }

  if (!Utils.isNumber(updated)) {
    throw new Error('Counter "updated" value must be Number')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.put({
    url         : this.app.urls.counterCompareAndSet(counterName),
    query       : { expected, updatedvalue: updated },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

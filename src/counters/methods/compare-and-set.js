import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request/index'

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

  return Request.put({
    url         : Urls.counterCompareAndSet(counterName),
    query       : { expected, updatedvalue: updated },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

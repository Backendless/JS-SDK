import Utils from '../../utils'
import Urls from '../../urls'
import Request from '../../request/index'

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

  return Request.put({
    url         : Urls.counterAddAndGet(counterName),
    query       : { value },
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

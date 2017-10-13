import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function compareAndSet(counterName, expected, updated/**, async */) {
  if (null == expected || null == updated) {
    throw new Error(
      'Missing values for the "expected" and/or "updated" arguments. The arguments must contain numeric values'
    )
  }

  if (!Utils.isNumber(expected) || !Utils.isNumber(updated)) {
    throw new Error(
      'Missing value for the "expected" and/or "updated" arguments. The arguments must contain a numeric value'
    )
  }

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  const queryParams = '?expected=' + expected + '&updatedvalue=' + updated

  return Request.put({
    url         : Urls.counterMethod(counterName, 'get/compareandset') + queryParams,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

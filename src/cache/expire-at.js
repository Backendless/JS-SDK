import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function expireAt(key, timestamp /**, async */) {
  if (Utils.isString(key) && (Utils.isNumber(timestamp) || Utils.isDate(timestamp)) && timestamp) {
    timestamp = (Utils.isDate(timestamp)) ? timestamp.getTime() : timestamp
    let responder = Utils.extractResponder(arguments), isAsync = false
    if (responder) {
      isAsync = true
      responder = Utils.wrapAsync(responder)
    }

    return Backendless._ajax({
      method      : 'PUT',
      url         : Urls.cacheItemExpireAt(key) + '?timestamp=' + timestamp,
      data        : {},
      isAsync     : isAsync,
      asyncHandler: responder
    })
  } else {
    throw new Error(
      'You can use only String as key while expire in Cache. ' +
      'Second attribute must be declared and must be a Number or Date type'
    )
  }
}

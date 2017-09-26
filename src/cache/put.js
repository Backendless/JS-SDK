import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

export function put(key, value, timeToLive, async) {
  if (!Utils.isString(key)) {
    throw new Error('You can use only String as key to put into Cache')
  }

  if (!(timeToLive instanceof Async)) {
    if (typeof timeToLive === 'object' && !arguments[3]) {
      async = timeToLive
      timeToLive = null
    } else if (typeof timeToLive !== ('number' || 'string') && timeToLive != null) {
      throw new Error('You can use only String as timeToLive attribute to put into Cache')
    }
  } else {
    async = timeToLive
    timeToLive = null
  }

  if (Utils.isObject(value) && value.constructor !== Object) {
    value.___class = value.___class || Utils.getClassName(value)
  }

  let responder = Utils.extractResponder([async])
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Backendless._ajax({
    method      : 'PUT',
    url         : Urls.cacheItem(key) + ((timeToLive) ? '?timeout=' + timeToLive : ''),
    data        : JSON.stringify(value),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

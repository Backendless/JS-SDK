import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

//TODO: rename me
export function cacheMethod(method, key, contain, async) {
  if (!Utils.isString(key)) {
    throw new Error('The "key" argument must be String')
  }

  //TODO: refactor me
  let responder = async
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Backendless._ajax({
    method      : method,
    url         : contain ? Urls.cacheItemCheck(key) : Urls.cacheItem(key),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

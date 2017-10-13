import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

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

  return Request.send({
    method      : method,
    url         : contain ? Urls.cacheItemCheck(key) : Urls.cacheItem(key),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

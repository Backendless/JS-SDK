import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

//TODO: rename me
export function cacheMethod(method, key, contain, asyncHandler) {
  if (!Utils.isString(key)) {
    throw new Error('The "key" argument must be String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.send({
    method      : method,
    url         : contain ? Urls.cacheItemCheck(key) : Urls.cacheItem(key),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

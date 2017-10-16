import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function expireIn(key, seconds, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (!seconds) {
    throw new Error('Cache Expiration must be number of seconds')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.put({
    url         : Urls.cacheItemExpireIn(key) + '?timeout=' + seconds,
    data        : {},
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

}

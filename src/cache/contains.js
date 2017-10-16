import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function contains(key, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.get({
    url         : Urls.cacheItemCheck(key),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

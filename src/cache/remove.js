import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function remove(key, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.delete({
    url         : Urls.cacheItem(key),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

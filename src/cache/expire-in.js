import Utils from '../utils'

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

  return this.app.request.put({
    url         : this.app.urls.cacheItemExpireIn(key) + '?timeout=' + seconds,
    data        : {},
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

}

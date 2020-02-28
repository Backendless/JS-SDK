import Utils from '../utils'

export function expireAt(key, timestamp, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (!timestamp) {
    throw new Error('Cache Expiration must be timestamp or instance of Date')
  }

  timestamp = Utils.isDate(timestamp) ? timestamp.getTime() : timestamp

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.put({
    url         : this.app.urls.cacheItemExpireAt(key) + '?timestamp=' + timestamp,
    data        : {},
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })

}

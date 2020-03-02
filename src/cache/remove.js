import Utils from '../utils'

export function remove(key, asyncHandler) {
  if (!key || !Utils.isString(key)) {
    throw new Error('Cache Key must be non empty String')
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return this.app.request.delete({
    url         : this.app.urls.cacheItem(key),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

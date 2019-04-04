import Request from '../request'

export function getCategories(asyncHandler) {
  return Request.get({
    url         : this.urls.geoCategories(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
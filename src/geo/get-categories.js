export function getCategories(asyncHandler) {
  return this.app.request.get({
    url         : this.app.urls.geoCategories(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
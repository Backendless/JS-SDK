export function getCategories(asyncHandler) {
  return this.backendless.request.get({
    url         : this.backendless.urls.geoCategories(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}
import Urls from '../urls'
import Request from '../request'

export function getCategories(asyncHandler) {
  return Request.get({
    url         : Urls.geoCategories(),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

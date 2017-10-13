import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function getCategories(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Request.get({
    url         : Urls.geoCategories(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

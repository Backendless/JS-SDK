import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function getCategories(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.geoCategories(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

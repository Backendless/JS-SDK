import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function describeUserClass(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.userClassProps(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

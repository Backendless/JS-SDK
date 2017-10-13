import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function describeUserClass(/** async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Request.get({
    url         : Urls.userClassProps(),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

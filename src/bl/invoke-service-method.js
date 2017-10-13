import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function invokeServiceMethod(serviceName, method, parameters /**, async */) {
  const responder = Utils.extractResponder(arguments)

  return Request.post({
    url         : Urls.blServiceMethod(serviceName, method),
    data        : parameters,
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function invokeServiceMethod(serviceName, method, parameters /**, async */) {
  const responder = Utils.extractResponder(arguments)

  return Backendless._ajax({
    method      : 'POST',
    url         : Urls.blServiceMethod(serviceName, method),
    data        : parameters,
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

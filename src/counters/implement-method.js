import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function implementMethod(counterName, urlPart/**, async */) {
  let responder = Utils.extractResponder(arguments)

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Backendless._ajax({
    method      : 'PUT',
    url         : Urls.counterMethod(counterName, urlPart),
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

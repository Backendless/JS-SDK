import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function get(counterName, /** async */) {
  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.counter(counterName),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

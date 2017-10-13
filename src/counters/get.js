import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function get(counterName, /** async */) {
  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Request.get({
    url         : Urls.counter(counterName),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function implementMethod(counterName, urlPart/**, async */) {
  let responder = Utils.extractResponder(arguments)

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Request.put({
    url         : Urls.counterMethod(counterName, urlPart),
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

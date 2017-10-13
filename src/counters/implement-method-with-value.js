import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function implementMethodWithValue(counterName, urlPart, value/**, async */) {
  if (!value) {
    throw new Error('Missing value for the "value" argument. The argument must contain a numeric value.')
  }

  if (!Utils.isNumber(value)) {
    throw new Error('Invalid value for the "value" argument. The argument must contain only numeric values')
  }

  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  return Request.put({
    url         : Urls.counterMethod(counterName, urlPart) + ((value) ? value : ''),
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

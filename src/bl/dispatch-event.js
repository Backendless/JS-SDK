import Utils from '../utils'
import Request from '../request'
import Async from '../request/async'
import Urls from '../urls'

export function dispatchEvent(eventName, eventArgs) {
  if (!eventName || !Utils.isString(eventName)) {
    throw new Error('Event Name must be provided and must be not an empty STRING!')
  }

  eventArgs = (Utils.isObject(eventArgs) && !(eventArgs instanceof Async)) ? eventArgs : {}

  let responder = Utils.extractResponder(arguments)

  if (responder) {
    responder = Utils.wrapAsync(responder)
  }

  eventArgs = eventArgs instanceof Async ? {} : eventArgs

  return Request.post({
    url         : Urls.blEvent(eventName),
    data        : eventArgs,
    isAsync     : !!responder,
    asyncHandler: responder
  })
}

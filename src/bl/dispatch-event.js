import Utils from '../utils'
import Request from '../request'
import Async from '../request/async'
import Urls from '../urls'

export function dispatchEvent(eventName, eventArgs, asyncHandler) {
  if (!eventName || !Utils.isString(eventName)) {
    throw new Error('Event Name must be provided and must be not an empty STRING!')
  }

  if (eventArgs instanceof Async) {
    asyncHandler = eventArgs
    eventArgs = undefined
  }

  if (!Utils.isObject(eventArgs)) {
    eventArgs = {}
  }

  if (asyncHandler) {
    asyncHandler = Utils.wrapAsync(asyncHandler)
  }

  return Request.post({
    url         : Urls.blEvent(eventName),
    data        : eventArgs,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

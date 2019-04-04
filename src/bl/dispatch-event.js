import Utils from '../utils'
import Async from '../request/async'

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

  return this.backendless.request.post({
    url         : this.backendless.urls.blEvent(eventName),
    data        : eventArgs,
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

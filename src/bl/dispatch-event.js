import Utils from '../utils'
import Request from '../request'
import Async from '../request/async'
import Urls from '../urls'

import { EXECUTION_TYPE_HEADER } from './constants'

export function dispatchEvent(eventName, eventArgs, executionType, asyncHandler) {
  if (!eventName || !Utils.isString(eventName)) {
    throw new Error('Event Name must be provided and must be not an empty STRING!')
  }

  if (typeof eventArgs === 'string') {
    asyncHandler = executionType
    executionType = eventArgs
    eventArgs = undefined
  }

  if (executionType instanceof Async) {
    asyncHandler = executionType
    executionType = undefined
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

  const headers = {}

  if (executionType) {
    headers[EXECUTION_TYPE_HEADER] = executionType
  }

  return Request.post({
    url         : Urls.blEvent(eventName),
    data        : eventArgs,
    isAsync     : !!asyncHandler,
    headers     : headers,
    asyncHandler: asyncHandler
  })
}

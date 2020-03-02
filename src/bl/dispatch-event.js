import Utils from '../utils'
import Async from '../request/async'

import { EXECUTION_TYPE_HEADER, isExecutionType } from './constants'

export function dispatchEvent(eventName, eventArgs, executionType, asyncHandler) {
  if (!eventName || !Utils.isString(eventName)) {
    throw new Error('Event Name must be provided and must be not an empty STRING!')
  }

  if (typeof eventArgs === 'string' && isExecutionType(eventArgs)) {
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

  return this.app.request.post({
    url         : this.app.urls.blEvent(eventName),
    data        : eventArgs,
    isAsync     : !!asyncHandler,
    headers     : headers,
    asyncHandler: asyncHandler
  })
}

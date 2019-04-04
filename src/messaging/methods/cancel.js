import Async from '../../request/async'

export function cancel(messageId, asyncHandler) {
  return this.backendless.request.delete({
    url         : this.backendless.urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: new Async()
  })
}


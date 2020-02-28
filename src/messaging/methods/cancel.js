import Async from '../../request/async'

export function cancel(messageId, asyncHandler) {
  return this.app.request.delete({
    url         : this.app.urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: new Async()
  })
}


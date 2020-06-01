export function cancel(messageId, asyncHandler) {
  return this.app.request.delete({
    url         : this.app.urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler
  })
}


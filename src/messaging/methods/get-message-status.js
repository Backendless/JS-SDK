export function getMessageStatus(messageId, asyncHandler) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  return this.app.request.get({
    url         : this.app.urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

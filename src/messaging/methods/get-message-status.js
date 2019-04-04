export function getMessageStatus(messageId, asyncHandler) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  return this.backendless.request.get({
    url         : this.backendless.urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

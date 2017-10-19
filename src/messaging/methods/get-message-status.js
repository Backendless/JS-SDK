import Urls from '../../urls'
import Request from '../../request'

export function getMessageStatus(messageId, asyncHandler) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  return Request.get({
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: asyncHandler
  })
}

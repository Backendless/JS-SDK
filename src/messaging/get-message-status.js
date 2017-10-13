import Urls from '../urls'
import Request from '../request'

export function getMessageStatus(messageId, async) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  return Request.get({
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!async,
    asyncHandler: async
  })
}

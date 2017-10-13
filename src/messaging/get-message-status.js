import Backendless from '../bundle'
import Urls from '../urls'

export function getMessageStatus(messageId, async) {
  if (!messageId) {
    throw Error('Message ID is required.')
  }

  return Backendless._ajax({
    method      : 'GET',
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!async,
    asyncHandler: async
  })
}

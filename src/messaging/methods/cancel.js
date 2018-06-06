import Urls from '../../urls'
import Request from '../../request'
import Async from '../../request/async'

export function cancel(messageId, asyncHandler) {
  return Request.delete({
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!asyncHandler,
    asyncHandler: new Async()
  })
}


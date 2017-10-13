import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

export function cancel(messageId, async) {
  return Request.delete({
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!async,
    asyncHandler: new Async(Utils.emptyFn)
  })
}


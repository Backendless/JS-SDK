import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'
import Async from '../request/async'

export function cancel(messageId, async) {
  return Backendless._ajax({
    method      : 'DELETE',
    url         : Urls.messagingMessage(messageId),
    isAsync     : !!async,
    asyncHandler: new Async(Utils.emptyFn)
  })
}


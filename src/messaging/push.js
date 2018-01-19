import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function push(data) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (!data || !Utils.isObject(data)) {
    throw new Error('Push Data must object!')
  }

  return Request.post({
    url         : Urls.messagingPush(),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : data
  })
}

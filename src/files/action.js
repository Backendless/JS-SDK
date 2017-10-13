import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

export function doAction(actionType, parameters/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Request.put({
    url         : Urls.fileAction(actionType),
    data        : parameters,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

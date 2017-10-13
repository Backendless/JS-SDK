import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

export function doAction(actionType, parameters/**, async */) {
  const responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  return Backendless._ajax({
    method      : 'PUT',
    url         : Urls.fileAction(actionType),
    data        : parameters,
    isAsync     : isAsync,
    asyncHandler: responder
  })
}

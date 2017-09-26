import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

import { parseResponse, wrapAsync } from './utils'

export function update(user /** async */) {
  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync(responder)
  }

  const result = Backendless._ajax({
    method      : 'PUT',
    url         : Urls.userObject(user.objectId),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : JSON.stringify(user)
  })

  return isAsync ? result : parseResponse(result)
}

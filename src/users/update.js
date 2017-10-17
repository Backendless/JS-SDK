import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import { parseResponse, wrapAsync } from './utils'

export function update(user /** async */) {
  let responder = Utils.extractResponder(arguments)
  const isAsync = !!responder

  if (responder) {
    responder = wrapAsync(responder)
  }

  const result = Request.put({
    url         : Urls.userObject(user.objectId),
    isAsync     : isAsync,
    asyncHandler: responder,
    data        : user
  })

  return isAsync ? result : parseResponse(result)
}

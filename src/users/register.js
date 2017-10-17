import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'

import User from './user'

import { parseResponse, wrapAsync } from './utils'

export function register(user /** async */) {
  if (!(user instanceof User)) {
    throw new Error('Only Backendless.User accepted')
  }

  const responder = Utils.extractResponder(arguments)

  const isAsync = !!responder

  const result = Request.post({
    url         : Urls.userRegister(),
    isAsync     : isAsync,
    asyncHandler: responder && wrapAsync(responder),
    data        : user
  })

  return isAsync ? result : parseResponse(result)
}

import Backendless from '../bundle'
import Utils from '../utils'
import Urls from '../urls'

import { parseResponse, wrapAsync } from './utils'

export function register(user /** async */) {
  if (!(user instanceof Backendless.User)) {
    throw new Error('Only Backendless.User accepted')
  }

  const responder = Utils.extractResponder(arguments)

  const isAsync = !!responder

  const result = Backendless._ajax({
    method      : 'POST',
    url         : Urls.userRegister(),
    isAsync     : isAsync,
    asyncHandler: responder && wrapAsync(responder),
    data        : user
  })

  return isAsync ? result : parseResponse(result)
}

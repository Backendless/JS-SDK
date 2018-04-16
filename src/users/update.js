import Utils from '../utils'
import Urls from '../urls'
import Request from '../request'
import Async from '../request/async'

import User from './user'

export function update(user /** async */) {
  const responder = Utils.extractResponder(arguments)

  const isAsync = !!responder

  const result = Request.put({
    url         : Urls.userObject(user.objectId),
    isAsync     : isAsync,
    asyncHandler: responder && wrapAsync(responder),
    data        : user
  })

  return isAsync ? result : parseResponse(result)
}

function parseResponse(data) {
  return Utils.deepExtend(new User(), data)
}

function wrapAsync(asyncHandler){
  //TODO: will be removed after remove all the "{methodName}Sync" methods

  const onSuccess = data => asyncHandler.success(parseResponse(data))
  const onError = error => asyncHandler.fault(error)

  return new Async(onSuccess, onError)
}

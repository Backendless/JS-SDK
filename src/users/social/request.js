import Async from '../../request/async'

import { parseResponse, getUserFromResponse } from '../utils'

export const sendSocialLoginRequest = (accessToken, socialType, fieldsMapping, stayLoggedIn, asyncHandler) => {
  if (!accessToken) {
    return asyncHandler.fault('"accessToken" is missing.')
  }

  const context = this

  const interimCallback = new Async(function(r) {
    context.setLocalCurrentUser(parseResponse.call(context, r))
    context.backendless.LocalCache.set('stayLoggedIn', !!stayLoggedIn)

    asyncHandler.success(getUserFromResponse.call(context, context.getLocalCurrentUser()))
  }, function(e) {
    asyncHandler.fault(e)
  })

  this.backendless.request.post({
    url         : this.backendless.urls.userSocialLogin(socialType),
    isAsync     : true,
    asyncHandler: interimCallback,
    data        : {
      accessToken,
      fieldsMapping
    }
  })
}

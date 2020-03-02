import Async from '../../request/async'

import { parseResponse, getUserFromResponse } from '../utils'

export function sendSocialLoginRequest (accessToken, socialType, fieldsMapping, stayLoggedIn, asyncHandler) {
  if (!accessToken) {
    return asyncHandler.fault('"accessToken" is missing.')
  }

  const context = this

  const interimCallback = new Async(function(r) {
    context.setLocalCurrentUser(parseResponse.call(context, r))
    context.app.LocalCache.set('stayLoggedIn', !!stayLoggedIn)

    asyncHandler.success(getUserFromResponse.call(context, context.getLocalCurrentUser()))
  }, function(e) {
    asyncHandler.fault(e)
  })

  this.app.request.post({
    url         : this.app.urls.userSocialLogin(socialType),
    isAsync     : true,
    asyncHandler: interimCallback,
    data        : {
      accessToken,
      fieldsMapping
    }
  })
}

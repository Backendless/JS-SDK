import Async from '../../request/async'
import LocalCache from '../../local-cache'
import { getLocalCurrentUser, setLocalCurrentUser } from '../current-user'

import { parseResponse, getUserFromResponse } from '../utils'

export const sendSocialLoginRequest = (accessToken, socialType, fieldsMapping, stayLoggedIn, asyncHandler) => {
  if (!accessToken) {
    return asyncHandler.fault('"accessToken" is missing.')
  }

  const interimCallback = new Async(function(r) {
    setLocalCurrentUser(parseResponse(r))
    LocalCache.set('stayLoggedIn', !!stayLoggedIn)
    asyncHandler.success(getUserFromResponse(getLocalCurrentUser()))
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

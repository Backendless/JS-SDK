import Async from '../../request/async'
import Urls from '../../urls'
import Request from '../../request'
import LocalCache from '../../local-cache'
import { getLocalCurrentUser, setLocalCurrentUser } from '../current-user'


import { parseResponse, getUserFromResponse } from '../utils'

export const sendSocialLoginRequest = (response, socialType, fieldsMapping, stayLoggedIn, asyncHandler) => {
  if (fieldsMapping) {
    response['fieldsMapping'] = fieldsMapping
  }

  const interimCallback = new Async(function(r) {
    setLocalCurrentUser(parseResponse(r))
    LocalCache.set('stayLoggedIn', !!stayLoggedIn)
    asyncHandler.success(getUserFromResponse(getLocalCurrentUser()))
  }, function(e) {
    asyncHandler.fault(e)
  })

  Request.post({
    url         : Urls.userSocialLogin(socialType),
    isAsync     : true,
    asyncHandler: interimCallback,
    data        : response
  })
}

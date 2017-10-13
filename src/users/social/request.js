import Backendless from '../../bundle'
import Async from '../../request/async'
import Private from '../../private'
import Urls from '../../urls'

import { parseResponse, getUserFromResponse } from '../utils'

export const sendSocialLoginRequest = (response, socialType, fieldsMapping, stayLoggedIn, async) => {
  if (fieldsMapping) {
    response['fieldsMapping'] = fieldsMapping
  }

  const interimCallback = new Async(function(r) {
    Private.setCurrentUser(parseResponse(r))
    Backendless.LocalCache.set('stayLoggedIn', !!stayLoggedIn)
    async.success(getUserFromResponse(Private.getCurrentUser()))
  }, function(e) {
    async.fault(e)
  })

  Backendless._ajax({
    method      : 'POST',
    url         : Urls.userSocialLogin(socialType),
    isAsync     : true,
    asyncHandler: interimCallback,
    data        : response
  })
}

import Async from '../../request/async'
import Utils from '../../utils'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export function loginWithFacebook(fieldsMapping, permissions, stayLoggedIn, asyncHandler) {
  console.warn( // eslint-disable-line no-console
    'Method "loginWithFacebook" is deprecated. and will be removed in the nearest release.\n' +
    'Use method "loginWithFacebookSdk" instead.'
  )

  return loginSocial.call(this, 'Facebook', fieldsMapping, permissions, null, stayLoggedIn, asyncHandler)
}

export function loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn, options) {
  const context = this

  Utils.checkPromiseSupport()

  if (typeof accessToken !== 'string') {
    options = stayLoggedIn
    stayLoggedIn = fieldsMapping
    fieldsMapping = accessToken
    accessToken = null
  }

  return new Promise((resolve, reject) => {
    function loginRequest() {
      const asyncHandler = new Async(resolve, reject)

      return sendSocialLoginRequest.call(context, accessToken, 'facebook', fieldsMapping, stayLoggedIn, asyncHandler)
    }

    if (accessToken || !fieldsMapping) {
      return loginRequest()
    }

    // eslint-disable-next-line no-console
    console.warn(
      'You must pass "accessToken" as the first argument into ' +
      ' "loginWithFacebook(accessToken:String, fieldsMapping:Object, stayLoggedIn?:Boolean)" method'
    )

    if (!FB) {
      return reject(new Error('Facebook SDK not found'))
    }

    FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        loginRequest(accessToken = response.authResponse.accessToken)

      } else {
        FB.login(response => loginRequest(accessToken = response.authResponse.accessToken), options)
      }
    })
  })
}

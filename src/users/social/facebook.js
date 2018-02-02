import Async from '../../request/async'
import Utils from '../../utils'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export const loginWithFacebook = (fieldsMapping, permissions, stayLoggedIn, asyncHandler) => {
  return loginSocial('Facebook', fieldsMapping, permissions, null, stayLoggedIn, asyncHandler)
}

export const loginWithFacebookSdk = (accessToken, fieldsMapping, stayLoggedIn, options) => {
  Utils.checkPromiseSupport()

  if (typeof accessToken !== 'string') {
    options = stayLoggedIn
    stayLoggedIn = fieldsMapping
    fieldsMapping = accessToken
    accessToken = null
  }

  return new Promise((resolve, reject) => {
    function loginRequest() {
      sendSocialLoginRequest(accessToken, 'facebook', fieldsMapping, stayLoggedIn, new Async(resolve, reject))
    }

    if (accessToken || !fieldsMapping) {
      return loginRequest()
    }

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

import Async from '../../request/async'
import Utils from '../../utils'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export const loginWithFacebook = (fieldsMapping, permissions, stayLoggedIn, asyncHandler) => {
  return loginSocial('Facebook', fieldsMapping, permissions, null, stayLoggedIn, asyncHandler)
}

export const loginWithFacebookSdk = (fieldsMapping, stayLoggedIn, options) => {
  Utils.checkPromiseSupport()

  return new Promise((resolve, reject) => {
    if (!FB) {
      return reject(new Error('Facebook SDK not found'))
    }

    function loginRequest(response) {
      const requestData = {
        ...response,
        accessToken: response.authResponse.accessToken
      }

      sendSocialLoginRequest(requestData, 'facebook', fieldsMapping, stayLoggedIn, new Async(resolve, reject))
    }

    FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        loginRequest(response)
      } else {
        FB.login(response => loginRequest(response), options)
      }
    })
  })
}

import Async from '../../request/async'
import Utils from '../../utils'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export const loginWithGooglePlus = (fieldsMapping, permissions, container, stayLoggedIn, asyncHandler) => {
  console.warn(
    'Method "loginWithGooglePlus" is deprecated. and will be removed in the nearest release.\n' +
    'Use method "loginWithGooglePlusSdk" instead.'
  )

  return loginSocial('GooglePlus', fieldsMapping, permissions, container, stayLoggedIn, asyncHandler)
}

export const loginWithGooglePlusSdk = (accessToken, fieldsMapping, stayLoggedIn) => {
  Utils.checkPromiseSupport()

  if (typeof accessToken !== 'string') {
    stayLoggedIn = fieldsMapping
    fieldsMapping = accessToken
    accessToken = null
  }

  return new Promise((resolve, reject) => {
    function loginRequest() {
      sendSocialLoginRequest(accessToken, 'googleplus', fieldsMapping, stayLoggedIn, new Async(resolve, reject))
    }

    if (accessToken || !fieldsMapping) {
      return loginRequest()
    }

    console.warn('You must pass "accessToken" as the first argument into "loginWithGooglePlusSdk(accessToken:String, fieldsMapping:Object, stayLoggedIn?:Boolean)" method')

    if (!gapi) {
      return reject(new Error('Google Plus SDK not found'))
    }

    gapi.auth.authorize({
      client_id: fieldsMapping.client_id,
      scope    : 'https://www.googleapis.com/auth/plus.login'
    }, ({ access_token, error }) => {
      if (error) {
        reject(error)
      } else {
        loginRequest(accessToken = access_token)
      }
    })
  })
}

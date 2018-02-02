import Async from '../../request/async'
import Utils from '../../utils'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export const loginWithGooglePlus = (fieldsMapping, permissions, container, stayLoggedIn, asyncHandler) => {
  return loginSocial('GooglePlus', fieldsMapping, permissions, container, stayLoggedIn, asyncHandler)
}

export const loginWithGooglePlusSdk = (fieldsMapping, stayLoggedIn) => {
  Utils.checkPromiseSupport()

  return new Promise((resolve, reject) => {
    if (!gapi) {
      return reject(new Error('Google Plus SDK not found'))
    }

    const asyncHandler = new Async(resolve, reject)

    gapi.auth.authorize({
      client_id: fieldsMapping.client_id,
      scope    : 'https://www.googleapis.com/auth/plus.login'
    }, ({ access_token }) => {
      sendSocialLoginRequest({ accessToken: access_token }, 'googleplus', fieldsMapping, stayLoggedIn, asyncHandler)
    })
  })
}

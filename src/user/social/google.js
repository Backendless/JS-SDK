import Async from '../../request/async'

import { loginSocial } from './login'
import { sendSocialLoginRequest } from './request'

export const loginWithGooglePlus = (fieldsMapping, permissions, container, stayLoggedIn, async) => {
  return loginSocial('GooglePlus', fieldsMapping, permissions, container, stayLoggedIn, async)
}

export const loginWithGooglePlusSdk = (fieldsMapping, stayLoggedIn) => {
  return new Promise((resolve, reject) => {
    if (!gapi) {
      return reject(new Error('Google Plus SDK not found'))
    }

    const async = new Async(resolve, reject)

    gapi.auth.authorize({
      client_id: fieldsMapping.client_id,
      scope    : 'https://www.googleapis.com/auth/plus.login'
    }, response => {
      delete response['g-oauth-window']
      sendSocialLoginRequest(response, 'googleplus', fieldsMapping, stayLoggedIn, async)
    })
  })
}

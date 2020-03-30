import { loginSocial } from './login'
import { getUserFromResponse, parseResponse } from '../utils'

export default class UsersSocial {
  constructor(users) {
    this.users = users
    this.app = users.app
  }

  async loginWithFacebook(fieldsMapping, permissions, stayLoggedIn) {
    console.warn( // eslint-disable-line no-console
      'Method "loginWithFacebook" is deprecated. and will be removed in the nearest release.\n' +
      'Use method "loginWithFacebookSdk" instead.'
    )

    return loginSocial.call(this, 'Facebook', fieldsMapping, permissions, null, stayLoggedIn)
  }

  async loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn, options) {
    if (typeof accessToken !== 'string') {
      options = stayLoggedIn
      stayLoggedIn = fieldsMapping
      fieldsMapping = accessToken
      accessToken = null
    }

    const loginRequest = () => {
      return this.sendSocialLoginRequest(accessToken, 'facebook', fieldsMapping, stayLoggedIn)
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
      throw new Error('Facebook SDK not found')
    }

    return new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          loginRequest(accessToken = response.authResponse.accessToken).then(resolve, reject)

        } else {
          FB.login(response => {
            loginRequest(accessToken = response.authResponse.accessToken).then(resolve, reject)
          }, options)
        }
      })
    })
  }

  async loginWithGooglePlus(fieldsMapping, permissions, container, stayLoggedIn) {
    console.warn( // eslint-disable-line no-console
      'Method "loginWithGooglePlus" is deprecated. and will be removed in the nearest release.\n' +
      'Use method "loginWithGooglePlusSdk" instead.'
    )

    return loginSocial.call(this, 'GooglePlus', fieldsMapping, permissions, container, stayLoggedIn)
  }

  async loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn) {
    if (typeof accessToken !== 'string') {
      stayLoggedIn = fieldsMapping
      fieldsMapping = accessToken
      accessToken = null
    }

    const loginRequest = () => {
      return this.sendSocialLoginRequest(accessToken, 'googleplus', fieldsMapping, stayLoggedIn)
    }

    if (accessToken || !fieldsMapping) {
      return loginRequest()
    }

    console.warn(// eslint-disable-line no-console
      'You must pass "accessToken" as the first argument into ' +
      '"loginWithGooglePlusSdk(accessToken:String, fieldsMapping:Object, stayLoggedIn?:Boolean)" method'
    )

    if (!gapi) {
      return throw new Error('Google Plus SDK not found')
    }

    return new Promise((resolve, reject) => {
      gapi.auth.authorize({
        client_id: fieldsMapping.client_id,
        scope    : 'https://www.googleapis.com/auth/plus.login'
      }, ({ access_token, error }) => {
        if (error) {
          reject(error)
        } else {
          loginRequest(accessToken = access_token).then(resolve, reject)
        }
      })
    })
  }

  async loginWithTwitter(fieldsMapping, stayLoggedIn) {
    return loginSocial.call(this, 'Twitter', fieldsMapping, null, null, stayLoggedIn)
  }

  async sendSocialLoginRequest(accessToken, socialType, fieldsMapping, stayLoggedIn) {
    if (!accessToken) {
      throw new Error('"accessToken" is missing.')
    }

    this.app.request
      .post({
        url : this.app.urls.userSocialLogin(socialType),
        data: {
          accessToken,
          fieldsMapping
        }
      })
      .then(() => {
        this.users.setLocalCurrentUser(parseResponse.call(this, r))

        this.app.LocalCache.set('stayLoggedIn', !!stayLoggedIn)

        return getUserFromResponse.call(this, this.users.getLocalCurrentUser())
      })
  }
}

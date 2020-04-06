import { SocialContainer } from './container'

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

    return this.loginSocial('Facebook', fieldsMapping, permissions, null, stayLoggedIn)
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

    return this.loginSocial('GooglePlus', fieldsMapping, permissions, container, stayLoggedIn)
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
      throw new Error('Google Plus SDK not found')
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
    return this.loginSocial('Twitter', fieldsMapping, null, null, stayLoggedIn)
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
      .then(data => {
        const user = this.users.dataStore.parseFindResponse(data)

        this.onLogin(user, stayLoggedIn)

        return user
      })
  }

  async loginSocial(socialType, fieldsMapping, permissions, container, stayLoggedIn) {
    const socialContainer = new SocialContainer(socialType, container)

    const resolveContainer = () => {
      return new Promise((resolve, reject) => {
        const onMessage = event => {
          if (event.origin === this.app.serverURL) {
            const result = JSON.parse(event.data)

            if (result.fault) {
              reject(result.fault)
            } else {
              resolve(result)
            }

            removeWindowEventListener('message', window, onMessage)

            socialContainer.closeContainer()
          }
        }

        addWindowEventListener('message', window, onMessage)
      })
    }

    const resolveUser = data => {
      const user = this.users.dataStore.parseFindResponse(data)

      this.onLogin(user, stayLoggedIn)

      return user
    }

    return this.app.request
      .post({
        url : this.app.urls.userSocialOAuth(socialType),
        data: {
          fieldsMapping: fieldsMapping || {},
          permissions  : permissions || [],
        }
      })
      .then(authUrl => socialContainer.doAuthorizationActivity(authUrl))
      .catch(error => {
        socialContainer.closeContainer()

        throw error
      })
      .then(resolveContainer)
      .then(resolveUser)
  }

  onLogin(user, stayLoggedIn) {
    this.users.onLogin(user, stayLoggedIn)
  }
}

function addWindowEventListener(event, elem, callback) {
  if (elem.addEventListener) {
    elem.addEventListener(event, callback, false)

  } else if (elem.attachEvent) {
    elem.attachEvent('on' + event, callback)

  } else {
    elem[event] = callback
  }
}

function removeWindowEventListener(event, elem, callback) {
  if (elem.removeEventListener) {
    elem.removeEventListener(event, callback, false)
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + event, callback)
  }

  elem[event] = null
}

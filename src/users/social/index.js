import BackendlessUser from '../user'
import { SocialContainer } from './container'

export default class UsersSocial {
  constructor(users) {
    this.users = users
    this.app = users.app
  }

  async loginWithFacebook(fieldsMapping, permissions, stayLoggedIn) {
    return this.loginWithContainer('facebook', fieldsMapping, permissions, null, stayLoggedIn)
  }

  async loginWithGooglePlus(fieldsMapping, permissions, container, stayLoggedIn) {
    return this.loginWithContainer('googleplus', fieldsMapping, permissions, container, stayLoggedIn)
  }

  async loginWithTwitter(fieldsMapping, stayLoggedIn) {
    return this.loginWithContainer('twitter', fieldsMapping, null, null, stayLoggedIn)
  }

  async loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn) {
    return this.sendWithAccessToken('facebook', accessToken, fieldsMapping, stayLoggedIn)
  }

  async loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn) {
    return this.sendWithAccessToken('googleplus', accessToken, fieldsMapping, stayLoggedIn)
  }

  async sendWithAccessToken(socialType, accessToken, fieldsMapping, stayLoggedIn) {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error('"accessToken" must be non empty string.')
    }

    if (typeof fieldsMapping === 'boolean') {
      stayLoggedIn = fieldsMapping
      fieldsMapping = undefined
    }

    return this.app.request
      .post({
        url : this.app.urls.userSocialLogin(socialType),
        data: {
          accessToken,
          fieldsMapping
        }
      })
      .then(data => this.users.setCurrentUser(data, stayLoggedIn))
  }

  async loginWithContainer(socialType, fieldsMapping, permissions, container, stayLoggedIn) {
    const socialContainer = new SocialContainer(socialType, container)

    const resolveContainer = () => {
      return new Promise((resolve, reject) => {
        const onMessage = event => {
          if (event.origin === this.app.serverURL) {
            const result = JSON.parse(event.data)

            if (result.fault) {
              reject(new Error(result.fault))
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
      .then(data => this.users.setCurrentUser(data, stayLoggedIn))
  }

  async loginWithOauth2(providerCode, accessToken, guestUser, fieldsMapping, stayLoggedIn) {
    if (!providerCode || typeof providerCode !== 'string') {
      throw new Error('"providerCode" must be non empty string.')
    }

    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error('"accessToken" must be non empty string.')
    }

    if (guestUser && !(guestUser instanceof BackendlessUser)) {
      stayLoggedIn = fieldsMapping
      fieldsMapping = guestUser
      guestUser = undefined
    }

    if (typeof fieldsMapping === 'boolean') {
      stayLoggedIn = fieldsMapping
      fieldsMapping = undefined
    }

    return this.app.request
      .post({
        url : this.app.urls.userOAuthLogin(providerCode),
        data: {
          accessToken,
          fieldsMapping,
          guestUser
        }
      })
      .then(data => this.users.setCurrentUser(data, stayLoggedIn))
  }

  async loginWithOauth1(providerCode, accessToken, accessTokenSecret, guestUser, fieldsMapping, stayLoggedIn) {
    if (!providerCode || typeof providerCode !== 'string') {
      throw new Error('"providerCode" must be non empty string.')
    }

    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error('"accessToken" must be non empty string.')
    }

    if (!accessTokenSecret || typeof accessTokenSecret !== 'string') {
      throw new Error('"accessTokenSecret" must be non empty string.')
    }

    if (guestUser && !(guestUser instanceof BackendlessUser)) {
      stayLoggedIn = fieldsMapping
      fieldsMapping = guestUser
      guestUser = undefined
    }

    if (typeof fieldsMapping === 'boolean') {
      stayLoggedIn = fieldsMapping
      fieldsMapping = undefined
    }

    return this.app.request
      .post({
        url : this.app.urls.userOAuthLogin(providerCode),
        data: {
          accessToken,
          accessTokenSecret,
          fieldsMapping,
          guestUser
        }
      })
      .then(data => this.users.setCurrentUser(data, stayLoggedIn))
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

import Utils from '../utils'
import Async from '../request/async'

import User from './user'

import { parseResponse, getUserFromResponse } from './utils'

import { loginSocial } from './social/login'
import { sendSocialLoginRequest } from './social/request'

export default class Users {
  constructor(app) {
    this.app = app
  }

  async register(user, asyncHandler) {
    function enrichWithLocaleInfo(user) {
      if (!user.blUserLocale) {
        const clientUserLocale = getClientUserLocale()

        if (clientUserLocale) {
          user.blUserLocale = clientUserLocale
        }
      }

      return user
    }

    function getClientUserLocale() {
      if (typeof navigator === 'undefined') {
        return
      }

      let language = ''

      if (navigator.languages && navigator.languages.length) {
        language = navigator.languages[0]
      } else {
        language = navigator.userLanguage
          || navigator.language
          || navigator.browserLanguage
          || navigator.systemLanguage
          || ''
      }

      return language.slice(0, 2).toLowerCase()
    }

    return this.app.request.post({
      url         : this.app.urls.userRegister(),
      parser      : data => Utils.deepExtend(new User(), data),
      asyncHandler: asyncHandler,
      data        : enrichWithLocaleInfo(user)
    })
  }

  async getUserRoles(asyncHandler) {
    return this.app.request.get({
      url         : this.app.urls.userRoles(),
      asyncHandler: asyncHandler
    })
  }

  async assignRole(identity, rolename, asyncHandler) {
    return roleHelper.call(this, identity, rolename, asyncHandler, 'assignRole')
  }

  async unassignRole(identity, rolename, asyncHandler) {
    return roleHelper.call(this, identity, rolename, asyncHandler, 'unassignRole')
  }

  async login(login, password, stayLoggedIn, /** async */) {
    const data = {}

    if (typeof login === 'string' && (!password || password instanceof Async)) {
      data.objectId = login

    } else {
      if (!login) {
        throw new Error('Login can not be empty')
      }

      if (!password) {
        throw new Error('Password can not be empty')
      }

      data.login = login
      data.password = password
    }

    stayLoggedIn = stayLoggedIn === true

    this.app.LocalCache.remove('user-token')
    this.app.LocalCache.remove('current-user-id')
    this.app.LocalCache.set('stayLoggedIn', false)

    const asyncHandler = Utils.extractResponder(arguments)

    return this.app.request.post({
      url         : this.app.urls.userLogin(),
      data        : data,
      asyncHandler: asyncHandler,
      parser      : data => {
        this.setLocalCurrentUser(parseResponse.call(this, Utils.tryParseJSON(data), stayLoggedIn))

        return getUserFromResponse.call(this, this.getLocalCurrentUser())
      },
    })
  }

  async loginAsGuest(stayLoggedIn, /** async */) {
    stayLoggedIn = stayLoggedIn === true

    this.app.LocalCache.remove('user-token')
    this.app.LocalCache.remove('current-user-id')
    this.app.LocalCache.set('stayLoggedIn', false)

    const asyncHandler = Utils.extractResponder(arguments)

    return this.app.request
      .post({
        url         : this.app.urls.guestLogin(),
        asyncHandler: asyncHandler,
        parser      : data => {
          this.setLocalCurrentUser(parseResponse.call(this, Utils.tryParseJSON(data), stayLoggedIn))

          return getUserFromResponse.call(this, this.getLocalCurrentUser())
        },
      })
  }

  async describeUserClass(asyncHandler) {
    return this.app.request.get({
      url         : this.app.urls.userClassProps(),
      asyncHandler: asyncHandler
    })
  }

  async restorePassword(emailAddress, asyncHandler) {
    if (!emailAddress) {
      throw new Error('emailAddress can not be empty')
    }

    const responder = Utils.extractResponder(arguments)

    return this.app.request.get({
      url         : this.app.urls.userRestorePassword(emailAddress),
      asyncHandler: asyncHandler
    })
  }

  async logout(asyncHandler) {
    const logoutUser = () => {
      this.app.LocalCache.remove('user-token')
      this.app.LocalCache.remove('current-user-id')
      this.app.LocalCache.remove('stayLoggedIn')

      this.setLocalCurrentUser(null)
    }

    return this.app.request
      .get({
        url         : this.app.urls.userLogout(),
        asyncHandler: asyncHandler
      })
      .then(logoutUser)
      .catch(error => {
        if (Utils.isObject(error) && [3064, 3091, 3090, 3023].includes(error.code)) {
          logoutUser()
        }

        throw error
      })
  }

  async getCurrentUser(asyncHandler) {
    let request = null

    if (this.currentUser) {
      const userFromResponse = getUserFromResponse.call(this, this.currentUser)

      request = Promise.resolve(userFromResponse)

    } else if (this.currentUserRequest) {
      request = this.currentUserRequest

    } else {
      const stayLoggedIn = this.app.LocalCache.get('stayLoggedIn')
      const currentUserId = stayLoggedIn && this.app.LocalCache.get('current-user-id')

      if (currentUserId) {
        const Data = this.app.Data
        const User = this.app.User

        request = this.currentUserRequest = Data.of(User).findById(currentUserId)
          .then(result => {
            this.currentUserRequest = null

            return this.currentUser = getUserFromResponse.call(this, result)
          })
          .catch(error => {
            this.currentUserRequest = null

            throw error
          })
      }
    }

    if (!request) {
      request = Promise.resolve(null)
    }

    if (asyncHandler) {
      request.then(asyncHandler.success, asyncHandler.fault)
    }

    return request
  }

  async update(user, asyncHandler) {
    return this.app.request.put({
      url         : this.app.urls.userObject(user.objectId),
      parser      : data => Utils.deepExtend(new User(), data),
      asyncHandler: asyncHandler,
      data        : user
    })
  }

  async loginWithFacebook(fieldsMapping, permissions, stayLoggedIn, asyncHandler) {
    console.warn( // eslint-disable-line no-console
      'Method "loginWithFacebook" is deprecated. and will be removed in the nearest release.\n' +
      'Use method "loginWithFacebookSdk" instead.'
    )

    return loginSocial.call(this, 'Facebook', fieldsMapping, permissions, null, stayLoggedIn, asyncHandler)
  }

  async loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn, options) {
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

  async loginWithGooglePlus(fieldsMapping, permissions, container, stayLoggedIn, asyncHandler) {
    console.warn( // eslint-disable-line no-console
      'Method "loginWithGooglePlus" is deprecated. and will be removed in the nearest release.\n' +
      'Use method "loginWithGooglePlusSdk" instead.'
    )

    return loginSocial.call(this, 'GooglePlus', fieldsMapping, permissions, container, stayLoggedIn, asyncHandler)
  }

  async loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn) {
    const context = this

    Utils.checkPromiseSupport()

    if (typeof accessToken !== 'string') {
      stayLoggedIn = fieldsMapping
      fieldsMapping = accessToken
      accessToken = null
    }

    return new Promise((resolve, reject) => {
      function loginRequest() {
        const asyncHandler = new Async(resolve, reject)

        return sendSocialLoginRequest.call(context, accessToken, 'googleplus', fieldsMapping, stayLoggedIn, asyncHandler)
      }

      if (accessToken || !fieldsMapping) {
        return loginRequest()
      }

      console.warn(// eslint-disable-line no-console
        'You must pass "accessToken" as the first argument into ' +
        '"loginWithGooglePlusSdk(accessToken:String, fieldsMapping:Object, stayLoggedIn?:Boolean)" method'
      )

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

  async loginWithTwitter(fieldsMapping, stayLoggedIn, asyncHandler) {
    return loginSocial.call(this, 'Twitter', fieldsMapping, null, null, stayLoggedIn, asyncHandler)
  }

  async isValidLogin(asyncHandler) {
    const userToken = this.getCurrentUserToken()

    if (userToken) {
      return this.app.request.get({
        url         : this.app.urls.userTokenCheck(userToken),
        asyncHandler: asyncHandler
      })
    }

    const result = this.getCurrentUser()
      .then(currentUser => !!currentUser)

    if (asyncHandler) {
      result.then(asyncHandler.success, asyncHandler.fault)
    }

    return result
  }

  async resendEmailConfirmation(emailAddress /** async */) {
    if (!emailAddress || emailAddress instanceof Async) {
      throw new Error('Email cannot be empty')
    }

    const responder = Utils.extractResponder(arguments)

    return this.app.request.post({
      url         : this.app.urls.userResendConfirmation(emailAddress),
      asyncHandler: responder
    })
  }

  loggedInUser() {
    return this.app.LocalCache.get('current-user-id')
  }

  getCurrentUserToken() {
    if (this.currentUser && this.currentUser['user-token']) {
      return this.currentUser['user-token'] || null
    }

    return this.app.LocalCache.get('user-token') || null
  }

  getLocalCurrentUser() {
    return this.currentUser
  }

  setLocalCurrentUser(user) {
    this.currentUser = user || null

    this.app.RT.updateUserTokenIfNeeded()
  }

}

async function roleHelper(identity, rolename, asyncHandler, operation) {
  if (!identity) {
    throw new Error('User identity can not be empty')
  }

  if (!rolename) {
    throw new Error('Rolename can not be empty')
  }

  const responder = Utils.extractResponder(arguments)

  return this.app.request.post({
    url         : this.app.urls.userRoleOperation(operation),
    data        : { user: identity, roleName: rolename },
    asyncHandler: responder,
  })
}

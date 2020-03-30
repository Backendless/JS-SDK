import Utils from '../utils'

import User from './user'
import UsersRoles from './roles'
import UsersSocial from './social'

import { parseResponse, getUserFromResponse } from './utils'

export default class Users {
  constructor(app) {
    this.app = app

    this.roles = new UsersRoles(this)
    this.social = new UsersSocial(this)

    Utils.enableAsyncHandlers(this, [
      'register',
      'login',
      'loginAsGuest',
      'loginWithFacebook',
      'loginWithFacebookSdk',
      'loginWithGooglePlus',
      'loginWithGooglePlusSdk',
      'loginWithTwitter',
      'logout',
      'getCurrentUser',
      'isValidLogin',
      'restorePassword',
      'resendEmailConfirmation',
      'update',
      'getUserRoles',
      'assignRole',
      'unassignRole',
      'describeUserClass',
    ])
  }

  async register(user) {
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
      url   : this.app.urls.userRegister(),
      parser: data => Utils.deepExtend(new User(), data),
      data  : enrichWithLocaleInfo(user)
    })
  }

  async login(login, password, stayLoggedIn) {
    const data = {}

    if (typeof login === 'string' && !password) {
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

    return this.app.request.post({
      url   : this.app.urls.userLogin(),
      data  : data,
      parser: data => {
        this.setLocalCurrentUser(parseResponse.call(this, Utils.tryParseJSON(data), stayLoggedIn))

        return getUserFromResponse.call(this, this.getLocalCurrentUser())
      },
    })
  }

  async loginAsGuest(stayLoggedIn) {
    stayLoggedIn = stayLoggedIn === true

    this.app.LocalCache.remove('user-token')
    this.app.LocalCache.remove('current-user-id')
    this.app.LocalCache.set('stayLoggedIn', false)

    return this.app.request
      .post({
        url   : this.app.urls.guestLogin(),
        parser: data => {
          this.setLocalCurrentUser(parseResponse.call(this, Utils.tryParseJSON(data), stayLoggedIn))

          return getUserFromResponse.call(this, this.getLocalCurrentUser())
        },
      })
  }

  async loginWithFacebook(fieldsMapping, permissions, stayLoggedIn) {
    return this.social.loginWithFacebook(fieldsMapping, permissions, stayLoggedIn)
  }

  async loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn, options) {
    return this.social.loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn, options)
  }

  async loginWithGooglePlus(fieldsMapping, permissions, container, stayLoggedIn) {
    return this.social.loginWithGooglePlus(fieldsMapping, permissions, container, stayLoggedIn)
  }

  async loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn) {
    return this.social.loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn)
  }

  async loginWithTwitter(fieldsMapping, stayLoggedIn) {
    return this.social.loginWithTwitter(fieldsMapping, stayLoggedIn)
  }

  async logout() {
    const logoutUser = () => {
      this.app.LocalCache.remove('user-token')
      this.app.LocalCache.remove('current-user-id')
      this.app.LocalCache.remove('stayLoggedIn')

      this.setLocalCurrentUser(null)
    }

    return this.app.request
      .get({
        url: this.app.urls.userLogout(),
      })
      .then(logoutUser)
      .catch(error => {
        if ([3064, 3091, 3090, 3023].includes(error.code)) {
          logoutUser()
        }

        throw error
      })
  }

  async getCurrentUser() {
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

    return request
  }

  async isValidLogin() {
    const userToken = this.getCurrentUserToken()

    if (userToken) {
      return this.app.request.get({
        url: this.app.urls.userTokenCheck(userToken),
      })
    }

    return this.getCurrentUser()
      .then(currentUser => !!currentUser)
  }

  async restorePassword(emailAddress) {
    if (!emailAddress) {
      throw new Error('emailAddress can not be empty')
    }

    return this.app.request.get({
      url: this.app.urls.userRestorePassword(emailAddress),
    })
  }

  async resendEmailConfirmation(emailAddress) {
    if (!emailAddress) {
      throw new Error('Email cannot be empty')
    }

    return this.app.request.post({
      url: this.app.urls.userResendConfirmation(emailAddress),
    })
  }

  async update(user) {
    return this.app.request.put({
      url   : this.app.urls.userObject(user.objectId),
      parser: data => Utils.deepExtend(new User(), data),
      data  : user
    })
  }

  async getUserRoles() {
    return this.roles.getUserRoles()
  }

  async assignRole(identity, rolename) {
    return this.roles.assignRole(identity, rolename)
  }

  async unassignRole(identity, rolename) {
    return this.roles.unassignRole(identity, rolename)
  }

  async describeUserClass() {
    return this.app.request.get({
      url: this.app.urls.userClassProps(),
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

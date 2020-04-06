import Utils from '../utils'

import { UsersUtils } from './utils'

import User from './user'
import UsersRoles from './roles'
import UsersSocial from './social'

export default class Users {
  constructor(app) {
    this.app = app

    this.roles = new UsersRoles(this)
    this.social = new UsersSocial(this)

    this.dataStore = this.app.Data.of(User)
  }

  async register(user) {
    user = { ...user }

    if (!user.blUserLocale) {
      const clientUserLocale = UsersUtils.getClientUserLocale()

      if (clientUserLocale) {
        user.blUserLocale = clientUserLocale
      }
    }

    return this.app.request
      .post({
        url : this.app.urls.userRegister(),
        data: user
      })
      .then(data => this.dataStore.parseFindResponse(data))
  }

  async login(login, password, stayLoggedIn) {
    const data = {}

    if (login && typeof login === 'string' && !password) {
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

    this.resetStore()

    return this.app.request
      .post({
        url : this.app.urls.userLogin(),
        data: data,
      })
      .then(data => {
        const user = this.dataStore.parseFindResponse(data)

        this.onLogin(user, stayLoggedIn)

        return user
      })
  }

  async loginAsGuest(stayLoggedIn) {
    stayLoggedIn = stayLoggedIn === true

    this.resetStore()

    return this.app.request
      .post({
        url: this.app.urls.guestLogin(),
      })
      .then(data => {
        const user = this.dataStore.parseFindResponse(data)

        this.onLogin(user, stayLoggedIn)

        return user
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

  resetStore(){
    this.app.LocalCache.remove('user-token')
    this.app.LocalCache.remove('current-user-id')
    this.app.LocalCache.remove('stayLoggedIn')

  }

  async logout() {
    const logoutUser = () => {
      this.resetStore()
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
    if (this.currentUser) {
      return Promise.resolve(this.currentUser)
    }

    if (this.currentUserRequest) {
      return this.currentUserRequest
    }

    const currentUserId = this.loggedInUser()

    if (currentUserId) {
      const Data = this.app.Data
      const User = this.app.User

      return this.currentUserRequest = Data.of(User).findById(currentUserId)
        .then(user => {
          this.currentUserRequest = null

          return this.currentUser = user
        })
        .catch(error => {
          this.currentUserRequest = null

          throw error
        })
    }

    return null
  }

  async isValidLogin() {
    const userToken = this.getCurrentUserToken()

    if (userToken) {
      return this.app.request.get({
        url: this.app.urls.userTokenCheck(userToken),
      })
    }

    return false
  }

  async restorePassword(emailAddress) {
    if (!emailAddress) {
      throw new Error('Email Address must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.userRestorePassword(emailAddress),
    })
  }

  async resendEmailConfirmation(emailAddress) {
    if (!emailAddress) {
      throw new Error('Email Address must be provided and must be a string.')
    }

    return this.app.request.post({
      url: this.app.urls.userResendConfirmation(emailAddress),
    })
  }

  async update(user) {
    return this.app.request
      .put({
        url : this.app.urls.userObject(user.objectId),
        data: user
      })
      .then(data => Utils.deepExtend(new User(), data))
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

    if (this.app.__RT) {
      this.app.RT.updateUserTokenIfNeeded()
    }
  }

  onLogin(user, stayLoggedIn){
    this.setLocalCurrentUser(user)

    if (stayLoggedIn) {
      this.app.LocalCache.set('stayLoggedIn', stayLoggedIn)
      this.app.LocalCache.set('user-token', user['user-token'])
    }

    this.app.LocalCache.set('current-user-id', user.objectId)
  }
}

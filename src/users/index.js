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

  get Utils() {
    return UsersUtils
  }

  async register(user) {
    user = { ...user }

    if (!user.blUserLocale) {
      const clientUserLocale = this.Utils.getClientUserLocale()

      if (clientUserLocale) {
        user.blUserLocale = clientUserLocale
      }
    }

    return this.app.request
      .post({
        url : this.app.urls.userRegister(),
        data: user
      })
      .then(data => this.dataStore.parseResponse(data))
  }

  async login(login, password, stayLoggedIn) {
    const data = {}

    if (typeof login !== 'string' && typeof login !== 'number') {
      throw new Error('the first argument must be either a string or a number')
    }

    if (!login) {
      throw new Error('the first argument cannot be an empty value')
    }

    if (typeof password === 'boolean') {
      stayLoggedIn = password
      password = undefined
    }

    if (typeof login === 'string' && password === undefined) {
      data.objectId = login

    } else {
      if (!password) {
        throw new Error('the "password" value cannot be an empty value')
      }

      data.login = login
      data.password = password
    }

    stayLoggedIn = stayLoggedIn === true

    return this.app.request
      .post({
        url : this.app.urls.userLogin(),
        data: data,
      })
      .then(data => this.setCurrentUser(data, stayLoggedIn))
  }

  async loginAsGuest(stayLoggedIn) {
    stayLoggedIn = stayLoggedIn === true

    return this.app.request
      .post({
        url: this.app.urls.guestLogin(),
      })
      .then(data => this.setCurrentUser(data, stayLoggedIn))
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

  async loginWithOauth2(providerCode, accessToken, guestUser, fieldsMapping, stayLoggedIn) {
    return this.social.loginWithOauth2(providerCode, accessToken, guestUser, fieldsMapping, stayLoggedIn)
  }

  async loginWithOauth1(providerCode, accessToken, accessTokenSecret, guestUser, fieldsMapping, stayLoggedIn) {
    return this.social.loginWithOauth1(providerCode, accessToken, accessTokenSecret, guestUser, fieldsMapping, stayLoggedIn) // eslint-disable-line max-len
  }

  async logout() {
    return this.app.request
      .get({
        url: this.app.urls.userLogout(),
      })
      .then(() => {
        this.setCurrentUser(null)
      })
      .catch(error => {
        if ([3023, 3064, 3090, 3091].includes(error.code)) {
          this.setCurrentUser(null)
        }

        throw error
      })
  }

  async getCurrentUser(reload) {
    if (this.currentUser && !reload) {
      return this.currentUser
    }

    if (this.currentUserRequest) {
      return this.currentUserRequest
    }

    const currentUserId = this.getCurrentUserId()

    if (currentUserId) {
      return this.currentUserRequest = this.dataStore.findById(currentUserId)
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

  setCurrentUser(user, stayLoggedIn) {
    this.app.LocalCache.remove(this.app.LocalCache.Keys.USER_TOKEN)
    this.app.LocalCache.remove(this.app.LocalCache.Keys.CURRENT_USER_ID)
    this.app.LocalCache.remove(this.app.LocalCache.Keys.STAY_LOGGED_IN)

    this.currentUser = user || null

    if (this.currentUser) {
      if (!(this.currentUser instanceof User)) {
        this.currentUser = this.dataStore.parseResponse(this.currentUser)
      }

      if (stayLoggedIn) {
        this.app.LocalCache.set(this.app.LocalCache.Keys.STAY_LOGGED_IN, true)
        this.app.LocalCache.set(this.app.LocalCache.Keys.USER_TOKEN, this.currentUser['user-token'])
        this.app.LocalCache.set(this.app.LocalCache.Keys.CURRENT_USER_ID, this.currentUser.objectId)
      }
    }

    if (this.app.__RT) {
      this.app.RT.updateUserTokenIfNeeded()
    }

    return this.currentUser
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

  async verifyPassword(currentPassword) {
    if (!currentPassword || typeof currentPassword !== 'string') {
      throw new Error('Password has to be a non empty string')
    }

    if (!this.getCurrentUserToken()) {
      throw new Error('In order to check password you have to be logged in')
    }

    return this.app.request
      .post({
        url : this.app.urls.userVerifyPassowrd(),
        data: {
          password: currentPassword,
        }
      })
      .then(result => !!(result && result.valid))
  }

  async restorePassword(emailAddress) {
    if (!emailAddress || typeof emailAddress !== 'string') {
      throw new Error('Email Address must be provided and must be a string.')
    }

    return this.app.request.get({
      url: this.app.urls.userRestorePassword(emailAddress),
    })
  }

  async resendEmailConfirmation(identity) {
    if (typeof identity === 'string') {
      if (!identity) {
        throw new Error('Identity can not be an empty string.')
      }
    } else if (typeof identity !== 'number') {
      throw new Error('Identity must be a string or number.')
    }

    return this.app.request.post({
      url: this.app.urls.userResendConfirmation(identity),
    })
  }

  async createEmailConfirmationURL(identity) {
    if (typeof identity === 'string') {
      if (!identity) {
        throw new Error('Identity can not be an empty string.')
      }
    } else if (typeof identity !== 'number') {
      throw new Error('Identity must be a string or number.')
    }

    return this.app.request.post({
      url: this.app.urls.userCreateConfirmationURL(identity),
    })
  }

  async update(user) {
    return this.app.request
      .put({
        url : this.app.urls.userObject(user.objectId),
        data: user
      })
      .then(data => this.dataStore.parseResponse(data))
  }

  async findByRole(roleName, loadRoles, query) {
    return this.roles.findByRole(roleName, loadRoles, query)
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

  async enableUser(userId) {
    return this.updateUserStatus(userId, 'ENABLED')
  }

  async disableUser(userId) {
    return this.updateUserStatus(userId, 'DISABLED')
  }

  async updateUserStatus(userId, userStatus) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User objectId must be non empty string')
    }

    if (!userStatus || typeof userStatus !== 'string') {
      throw new Error('User Status must be a valid string')
    }

    return this.app.request.put({
      url : this.app.urls.userStatus(userId),
      data: { userStatus },
    })
  }

  getAuthorizationUrlLink(providerCode, fieldsMapping, scope, redirect, redirectAfterLoginUrl) {
    return this.app.request.post({
      url : this.app.urls.userAuthorizationURL(providerCode),
      data: { fieldsMapping, permissions: scope, redirect, redirectAfterLoginUrl }
    })
  }

  loggedInUser() {
    return this.getCurrentUserId()
  }

  getCurrentUserToken() {
    if (this.currentUser && this.currentUser['user-token']) {
      return this.currentUser['user-token']
    }

    return this.app.LocalCache.get(this.app.LocalCache.Keys.USER_TOKEN) || null
  }

  setCurrentUserToken(userToken) {
    userToken = userToken || null

    if (this.currentUser) {
      this.currentUser['user-token'] = userToken
    }

    if (this.app.LocalCache.get('user-token')) {
      this.app.LocalCache.set('user-token', userToken)
    }

    if (this.app.__RT) {
      this.app.RT.updateUserTokenIfNeeded()
    }
  }

  getCurrentUserId() {
    if (this.currentUser) {
      return this.currentUser.objectId
    }

    return this.app.LocalCache.get(this.app.LocalCache.Keys.CURRENT_USER_ID) || null
  }

  /**
   * @deprecated
   * */
  getLocalCurrentUser() {
    return this.currentUser
  }

  /**
   * @deprecated
   * */
  setLocalCurrentUser(user, stayLoggedIn) {
    return this.setCurrentUser(user, stayLoggedIn)
  }
}

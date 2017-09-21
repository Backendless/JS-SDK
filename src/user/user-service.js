import Backendless from '../bundle'
import Utils from '../utils'
import Async from '../request/async'
import User from './user'
import persistence from '../data/persistence'
import Private from '../private'
import Urls from '../urls'

const UserService = function() {
  // this.restUrl = Urls.users()
}

UserService.prototype = {
  _wrapAsync: function(async, stayLoggedIn) {
    const success = data => {
      Private.setCurrentUser(this._parseResponse(Utils.tryParseJSON(data), stayLoggedIn))

      async.success(this._getUserFromResponse(Private.getCurrentUser()))
    }

    const error = data => {
      async.fault(data)
    }

    return new Async(success, error)
  },

  _parseResponse: function(data, stayLoggedIn) {
    const user = new Backendless.User()
    Utils.deepExtend(user, data)

    if (stayLoggedIn) {
      Backendless.LocalCache.set('stayLoggedIn', stayLoggedIn)
    }

    return user
  },

  register: Utils.promisified('_register'),

  registerSync: Utils.synchronized('_register'),

  _register: function(user /** async */) {
    if (!(user instanceof Backendless.User)) {
      throw new Error('Only Backendless.User accepted')
    }

    const responder = Utils.extractResponder(arguments)

    const isAsync = !!responder

    const result = Backendless._ajax({
      method      : 'POST',
      url         : Urls.userRegister(),
      isAsync     : isAsync,
      asyncHandler: responder && this._wrapAsync(responder),
      data        : JSON.stringify(user)
    })

    return isAsync ? result : this._parseResponse(result)
  },

  getUserRoles: Utils.promisified('_getUserRoles'),

  getUserRolesSync: Utils.synchronized('_getUserRoles'),

  _getUserRoles: function(/** async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    const result = Backendless._ajax({
      method      : 'GET',
      url         : Urls.userRoles(),
      isAsync     : isAsync,
      asyncHandler: responder
    })

    return isAsync ? result : this._parseResponse(result)
  },

  _roleHelper: function(identity, rolename, async, operation) {
    if (!identity) {
      throw new Error('User identity can not be empty')
    }

    if (!rolename) {
      throw new Error('Rolename can not be empty')
    }

    const responder = Utils.extractResponder(arguments)

    return Backendless._ajax({
      method      : 'POST',
      url         : Urls.userRoleOperation(operation),
      isAsync     : !!responder,
      asyncHandler: responder,
      data        : JSON.stringify({ user: identity, roleName: rolename })
    })
  },

  assignRole: Utils.promisified('_assignRole'),

  assignRoleSync: Utils.synchronized('_assignRole'),

  _assignRole: function(identity, rolename, async) {
    return this._roleHelper(identity, rolename, async, 'assignRole')
  },

  unassignRole: Utils.promisified('_unassignRole'),

  unassignRoleSync: Utils.synchronized('_unassignRole'),

  _unassignRole: function(identity, rolename, async) {
    return this._roleHelper(identity, rolename, async, 'unassignRole')
  },

  login: Utils.promisified('_login'),

  loginSync: Utils.synchronized('_login'),

  _login: function(login, password, stayLoggedIn, /** async */) {
    if (!login) {
      throw new Error('Login can not be empty')
    }

    if (!password) {
      throw new Error('Password can not be empty')
    }

    stayLoggedIn = stayLoggedIn === true

    Backendless.LocalCache.remove('user-token')
    Backendless.LocalCache.remove('current-user-id')
    Backendless.LocalCache.set('stayLoggedIn', false)

    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (responder) {
      responder = this._wrapAsync(responder, stayLoggedIn)
    }

    const data = {
      login   : login,
      password: password
    }

    let result = Backendless._ajax({
      method      : 'POST',
      url         : Urls.userLogin(),
      isAsync     : isAsync,
      asyncHandler: responder,
      data        : JSON.stringify(data)
    })

    if (!isAsync && result) {
      Private.setCurrentUser(this._parseResponse(result, stayLoggedIn))
      result = this._getUserFromResponse(Private.getCurrentUser())
    }

    return result
  },

  _getUserFromResponse: function(user) {
    Backendless.LocalCache.set('current-user-id', user.objectId)

    const userToken = user['user-token']

    if (userToken && Backendless.LocalCache.get('stayLoggedIn')) {
      Backendless.LocalCache.set('user-token', userToken)
    }

    return new Backendless.User(user)
  },

  loggedInUser: function() {
    return Backendless.LocalCache.get('current-user-id')
  },

  describeUserClass: Utils.promisified('_describeUserClass'),

  describeUserClassSync: Utils.synchronized('_describeUserClass'),

  _describeUserClass: function(/** async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.userClassProps(),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  restorePassword: Utils.promisified('_restorePassword'),

  restorePasswordSync: Utils.synchronized('_restorePassword'),

  _restorePassword: function(emailAddress /** async */) {
    if (!emailAddress) {
      throw new Error('emailAddress can not be empty')
    }

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'GET',
      url         : Urls.userRestorePassword(emailAddress),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  },

  logout: Utils.promisified('_logout'),

  logoutSync: Utils.synchronized('_logout'),

  _logout: function(/** async */) {
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder
    const errorCallback = isAsync ? responder.fault : null
    const successCallback = isAsync ? responder.success : null
    let result = {}

    const logoutUser = () => {
      Backendless.LocalCache.remove('user-token')
      Backendless.LocalCache.remove('current-user-id')
      Backendless.LocalCache.remove('stayLoggedIn')
      Private.setCurrentUser(null)
    }

    const onLogoutSuccess = () => {
      logoutUser()
      if (Utils.isFunction(successCallback)) {
        successCallback()
      }
    }

    const onLogoutError = e => {
      if (Utils.isObject(e) && [3064, 3091, 3090, 3023].indexOf(e.code) !== -1) {
        logoutUser()
      }
      if (Utils.isFunction(errorCallback)) {
        errorCallback(e)
      }
    }

    if (responder) {
      responder.fault = onLogoutError
      responder.success = onLogoutSuccess
    }

    try {
      result = Backendless._ajax({
        method      : 'GET',
        url         : Urls.userLogout(),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    } catch (e) {
      onLogoutError(e)
    }

    if (isAsync) {
      return result
    } else {
      logoutUser()
    }
  },

  getCurrentUser: Utils.promisified('_getCurrentUser'),

  getCurrentUserSync: Utils.synchronized('_getCurrentUser'),

  _getCurrentUser: function(async) {
    if (Private.getCurrentUser()) {
      const userFromResponse = this._getUserFromResponse(Private.getCurrentUser())

      return async ? async.success(userFromResponse) : userFromResponse
    }

    const stayLoggedIn = Backendless.LocalCache.get('stayLoggedIn')
    const currentUserId = stayLoggedIn && Backendless.LocalCache.get('current-user-id')

    if (currentUserId) {
      return persistence.of(User).findById(currentUserId, async)
    }

    return async ? async.success(null) : null
  },

  update: Utils.promisified('_update'),

  updateSync: Utils.synchronized('_update'),

  _update: function(user /** async */) {
    let responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (responder) {
      responder = this._wrapAsync(responder)
    }

    const result = Backendless._ajax({
      method      : 'PUT',
      url         : Urls.userObject(user.objectId),
      isAsync     : isAsync,
      asyncHandler: responder,
      data        : JSON.stringify(user)
    })

    return isAsync ? result : this._parseResponse(result)
  },

  loginWithFacebook: Utils.promisified('_loginWithFacebook'),

  loginWithFacebookSync: Utils.synchronized('_loginWithFacebook'),

  _loginWithFacebook: function(facebookFieldsMapping, permissions, stayLoggedIn, async) {
    return this._loginSocial('Facebook', facebookFieldsMapping, permissions, null, stayLoggedIn, async)
  },

  loginWithGooglePlus: Utils.promisified('_loginWithGooglePlus'),

  loginWithGooglePlusSync: Utils.synchronized('_loginWithGooglePlus'),

  _loginWithGooglePlus: function(googlePlusFieldsMapping, permissions, container, stayLoggedIn, async) {
    return this._loginSocial('GooglePlus', googlePlusFieldsMapping, permissions, container, stayLoggedIn, async)
  },

  loginWithTwitter: Utils.promisified('_loginWithTwitter'),

  loginWithTwitterSync: Utils.synchronized('_loginWithTwitter'),

  _loginWithTwitter: function(twitterFieldsMapping, stayLoggedIn, async) {
    return this._loginSocial('Twitter', twitterFieldsMapping, null, null, stayLoggedIn, async)
  },

  _socialContainer: function(socialType, container) {
    let loadingMsg

    if (container) {
      let client

      container = container[0]
      loadingMsg = document.createElement('div')
      loadingMsg.innerHTML = 'Loading...'
      container.appendChild(loadingMsg)
      container.style.cursor = 'wait'

      this.closeContainer = function() {
        container.style.cursor = 'default'
        container.removeChild(client)
      }

      this.removeLoading = function() {
        container.removeChild(loadingMsg)
      }

      this.doAuthorizationActivity = function(url) {
        this.removeLoading()
        client = document.createElement('iframe')
        client.frameBorder = 0
        client.width = container.style.width
        client.height = container.style.height
        client.id = 'SocialAuthFrame'
        client.setAttribute('src', url + '&amp;output=embed')
        container.appendChild(client)
        client.onload = function() {
          container.style.cursor = 'default'
        }
      }
    } else {
      container = window.open('', socialType + ' authorization',
        'resizable=yes, scrollbars=yes, titlebar=yes, top=10, left=10')
      loadingMsg = container.document.getElementsByTagName('body')[0].innerHTML
      loadingMsg = 'Loading...'
      container.document.getElementsByTagName('html')[0].style.cursor = 'wait'

      this.closeContainer = function() {
        container.close()
      }

      this.removeLoading = function() {
        loadingMsg = null
      }

      this.doAuthorizationActivity = function(url) {
        container.location.href = url
        container.onload = function() {
          container.document.getElementsByTagName('html')[0].style.cursor = 'default'
        }
      }
    }
  },

  _loginSocial: function(socialType, fieldsMapping, permissions, container, stayLoggedIn, async) {
    const socialContainer = new this._socialContainer(socialType, container)
    async = Utils.extractResponder(arguments)
    async = this._wrapAsync(async, stayLoggedIn)

    Utils.addEvent('message', window, function(e) {
      if (e.origin === Backendless.serverURL) {
        const result = JSON.parse(e.data)

        if (result.fault) {
          async.fault(result.fault)
        } else {
          async.success(result)
        }

        Utils.removeEvent('message', window)
        socialContainer.closeContainer()
      }
    })

    const interimCallback = new Async(function(r) {
      socialContainer.doAuthorizationActivity(r)
    }, function(e) {
      socialContainer.closeContainer()
      async.fault(e)
    })

    const request = {}
    request.fieldsMapping = fieldsMapping || {}
    request.permissions = permissions || []

    Backendless._ajax({
      method      : 'POST',
      url         : Urls.userSocialOAuth(socialType),
      isAsync     : true,
      asyncHandler: interimCallback,
      data        : JSON.stringify(request)
    })
  },

  loginWithFacebookSdk: function(fieldsMapping, stayLoggedIn, options) {
    const users = this

    return new Promise(function(resolve, reject) {
      if (!FB) {
        return reject(new Error('Facebook SDK not found'))
      }

      const async = new Async(resolve, reject, users)

      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          users._sendSocialLoginRequest(response, 'facebook', fieldsMapping, stayLoggedIn, async)
        } else {
          FB.login(function(response) {
            users._sendSocialLoginRequest(response, 'facebook', fieldsMapping, stayLoggedIn, async)
          }, options)
        }
      })
    })
  },

  loginWithGooglePlusSdk: function(fieldsMapping, stayLoggedIn /** async */) {
    const users = this

    return new Promise(function(resolve, reject) {
      if (!gapi) {
        return reject(new Error('Google Plus SDK not found'))
      }

      const async = new Async(resolve, reject, users)

      gapi.auth.authorize({
        client_id: fieldsMapping.client_id,
        scope    : 'https://www.googleapis.com/auth/plus.login'
      }, function(response) {
        delete response['g-oauth-window']
        users._sendSocialLoginRequest(response, 'googleplus', fieldsMapping, stayLoggedIn, async)
      })
    })
  },

  _sendSocialLoginRequest: function(response, socialType, fieldsMapping, stayLoggedIn, async) {
    if (fieldsMapping) {
      response['fieldsMapping'] = fieldsMapping
    }

    const interimCallback = new Async(function(r) {
      Private.setCurrentUser(context._parseResponse(r))
      Backendless.LocalCache.set('stayLoggedIn', !!stayLoggedIn)
      async.success(context._getUserFromResponse(Private.getCurrentUser()))
    }, function(e) {
      async.fault(e)
    })

    Backendless._ajax({
      method      : 'POST',
      url         : Urls.userSocialLogin(socialType),
      isAsync     : true,
      asyncHandler: interimCallback,
      data        : JSON.stringify(response)
    })
  },

  isValidLogin: Utils.promisified('_isValidLogin'),

  isValidLoginSync: Utils.synchronized('_isValidLogin'),

  _isValidLogin: function(/** async */) {
    const userToken = Backendless.LocalCache.get('user-token')
    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    if (userToken) {
      if (!isAsync) {
        try {
          const result = Backendless._ajax({
            method: 'GET',
            url   : Urls.userTokenCheck(userToken)
          })
          return !!result
        } catch (e) {
          return false
        }
      }

      return Backendless._ajax({
        method      : 'GET',
        url         : Urls.userTokenCheck(userToken),
        isAsync     : isAsync,
        asyncHandler: responder
      })
    }

    if (!isAsync) {
      return !!this.getCurrentUserSync()
    }

    this.getCurrentUser().then(function(user) {
      responder.success(!!user)
    }, function() {
      responder.success(false)
    })
  },

  resendEmailConfirmation: Utils.promisified('_resendEmailConfirmation'),

  resendEmailConfirmationSync: Utils.synchronized('_resendEmailConfirmation'),

  _resendEmailConfirmation: function(emailAddress /** async */) {
    if (!emailAddress || emailAddress instanceof Async) {
      throw new Error('Email cannot be empty')
    }

    const responder = Utils.extractResponder(arguments)
    const isAsync = !!responder

    return Backendless._ajax({
      method      : 'POST',
      url         : Urls.userResendConfirmation(emailAddress),
      isAsync     : isAsync,
      asyncHandler: responder
    })
  }
}

export default UserService

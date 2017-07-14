UserService.prototype = {
  _wrapAsync: function(async, stayLoggedIn) {
    var me = this;
    var success = function(data) {
      async.success(me._setCurrentUserFromResponse(data, stayLoggedIn));
    };
    var error = function(err) {
      async.fault(err);
    };

    return new Async(success, error);
  },

  _setCurrentUserFromResponse: function(data, stayLoggedIn) {
    var user = this._getUserFromResponse(data);
    this._setCurrentUser(user, stayLoggedIn);

    return user;
  },

  _setCurrentUser: function(user, stayLoggedIn) {
    currentUser = user;
    Backendless.LocalCache.set('current-user-id', user.objectId);
    if (stayLoggedIn !== undefined) {
      Backendless.LocalCache.set('stayLoggedIn', !!stayLoggedIn);
    }

    var userToken = user['user-token'];

    if (userToken && stayLoggedIn) {
      Backendless.LocalCache.set('user-token', userToken)
    }

    return user;
  },

  _getUserFromResponse: function(data) {
    return Utils.deepExtend(new Backendless.User(), Utils.tryParseJSON(data));
  },

  register: promisified('_register'),

  registerSync: synchronized('_register'),

  _register: function(user, async) {
    if (!(user instanceof Backendless.User)) {
      throw new Error('Only Backendless.User accepted');
    }

    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    if (responder) {
      responder = this._wrapAsync(responder);
    }

    var result = Backendless._ajax({
      method      : 'POST',
      url         : this.restUrl + '/register',
      isAsync     : isAsync,
      asyncHandler: responder,
      data        : JSON.stringify(user)
    });

    return isAsync ? result : this._setCurrentUserFromResponse(result);
  },

  getUserRoles: promisified('_getUserRoles'),

  getUserRolesSync: synchronized('_getUserRoles'),

  _getUserRoles: function(async) {
    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    return Backendless._ajax({
      method      : 'GET',
      url         : this.restUrl + '/userroles',
      isAsync     : isAsync,
      asyncHandler: responder
    });
  },

  _roleHelper: function(identity, rolename, async, operation) {
    if (!identity) {
      throw new Error('User identity can not be empty');
    }

    if (!rolename) {
      throw new Error('Rolename can not be empty');
    }

    var responder = Utils.extractResponder(arguments);

    return Backendless._ajax({
      method      : 'POST',
      url         : this.restUrl + '/' + operation,
      isAsync     : !!responder,
      asyncHandler: responder,
      data        : JSON.stringify({ user: identity, roleName: rolename })
    });
  },

  assignRole: promisified('_assignRole'),

  assignRoleSync: synchronized('_assignRole'),

  _assignRole: function(identity, rolename, async) {
    return this._roleHelper(identity, rolename, async, 'assignRole');
  },

  unassignRole: promisified('_unassignRole'),

  unassignRoleSync: synchronized('_unassignRole'),

  _unassignRole: function(identity, rolename, async) {
    return this._roleHelper(identity, rolename, async, 'unassignRole');
  },

  login: promisified('_login'),

  loginSync: synchronized('_login'),

  _login: function(login, password, stayLoggedIn, async) {
    if (!login) {
      throw new Error('Login can not be empty');
    }

    if (!password) {
      throw new Error('Password can not be empty');
    }

    stayLoggedIn = stayLoggedIn === true;

    Backendless.LocalCache.remove("user-token");
    Backendless.LocalCache.remove("current-user-id");
    Backendless.LocalCache.set("stayLoggedIn", false);

    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    if (responder) {
      responder = this._wrapAsync(responder, stayLoggedIn);
    }

    var data = {
      login   : login,
      password: password
    };

    var result = Backendless._ajax({
      method      : 'POST',
      url         : this.restUrl + '/login',
      isAsync     : isAsync,
      asyncHandler: responder,
      data        : JSON.stringify(data)
    });

    if (!isAsync && result) {
      return this._setCurrentUserFromResponse(result, stayLoggedIn);
    }

    return result;
  },

  loggedInUser: function() {
    return Backendless.LocalCache.get('current-user-id');
  },

  describeUserClass: promisified('_describeUserClass'),

  describeUserClassSync: synchronized('_describeUserClass'),

  _describeUserClass: function(async) {
    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    return Backendless._ajax({
      method      : 'GET',
      url         : this.restUrl + '/userclassprops',
      isAsync     : isAsync,
      asyncHandler: responder
    });
  },

  restorePassword: promisified('_restorePassword'),

  restorePasswordSync: synchronized('_restorePassword'),

  _restorePassword: function(emailAddress, async) {
    if (!emailAddress) {
      throw new Error('emailAddress can not be empty');
    }

    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    return Backendless._ajax({
      method      : 'GET',
      url         : this.restUrl + '/restorepassword/' + encodeURIComponent(emailAddress),
      isAsync     : isAsync,
      asyncHandler: responder
    });
  },

  logout: promisified('_logout'),

  logoutSync: synchronized('_logout'),

  _logout: function(async) {
    var responder       = Utils.extractResponder(arguments),
        isAsync         = responder != null,
        errorCallback   = isAsync ? responder.fault : null,
        successCallback = isAsync ? responder.success : null,
        result          = {},

        logoutUser      = function() {
          Backendless.LocalCache.remove("user-token");
          Backendless.LocalCache.remove("current-user-id");
          Backendless.LocalCache.remove("stayLoggedIn");
          currentUser = null;
        },

        onLogoutSuccess = function() {
          logoutUser();
          if (Utils.isFunction(successCallback)) {
            successCallback();
          }
        },

        onLogoutError   = function(e) {
          if (Utils.isObject(e) && [3064, 3091, 3090, 3023].indexOf(e.code) !== -1) {
            logoutUser();
          }
          if (Utils.isFunction(errorCallback)) {
            errorCallback(e);
          }
        };

    if (responder) {
      responder.fault = onLogoutError;
      responder.success = onLogoutSuccess;
    }

    try {
      result = Backendless._ajax({
        method      : 'GET',
        url         : this.restUrl + '/logout',
        isAsync     : isAsync,
        asyncHandler: responder
      });
    } catch (e) {
      onLogoutError(e);
    }

    if (isAsync) {
      return result;
    } else {
      logoutUser();
    }
  },

  getCurrentUser: promisified('_getCurrentUser'),

  getCurrentUserSync: synchronized('_getCurrentUser'),

  _getCurrentUser: function(async) {
    if (currentUser) {
      var user = this._setCurrentUserFromResponse(currentUser);

      return async ? async.success(user) : user;
    }

    var stayLoggedIn = Backendless.LocalCache.get("stayLoggedIn");
    var currentUserId = stayLoggedIn && Backendless.LocalCache.get("current-user-id");

    if (!currentUserId) {
      return async ? async.success(null) : null;
    }

    if (!async) {
      var userData = persistence.of(User).findByIdSync(currentUserId);

      return this._setCurrentUserFromResponse(userData);
    }

    var users = this;

    persistence.of(User).findById(currentUserId).then(
      function(data) {
        async.success(users._setCurrentUserFromResponse(data));
      },
      function(err) {
        async.fault(err);
      }
    );
  },

  update: promisified('_update'),

  updateSync: synchronized('_update'),

  _update: function(user, async) {
    var responder = Utils.extractResponder(arguments);
    var isAsync = responder != null;

    if (responder) {
      responder = this._wrapAsync(responder);
    }

    var result = Backendless._ajax({
      method      : 'PUT',
      url         : this.restUrl + '/' + user.objectId,
      isAsync     : isAsync,
      asyncHandler: responder,
      data        : JSON.stringify(user)
    });

    return isAsync ? result : this._setCurrentUserFromResponse(result);
  },

  loginWithFacebook: promisified('_loginWithFacebook'),

  loginWithFacebookSync: synchronized('_loginWithFacebook'),

  _loginWithFacebook: function(facebookFieldsMapping, permissions, stayLoggedIn, async) {
    return this._loginSocial('Facebook', facebookFieldsMapping, permissions, null, stayLoggedIn, async);
  },

  loginWithGooglePlus: promisified('_loginWithGooglePlus'),

  loginWithGooglePlusSync: synchronized('_loginWithGooglePlus'),

  _loginWithGooglePlus: function(googlePlusFieldsMapping, container, stayLoggedIn, async) {
    return this._loginSocial('GooglePlus', googlePlusFieldsMapping, null, container, stayLoggedIn, async);
  },

  loginWithTwitter: promisified('_loginWithTwitter'),

  loginWithTwitterSync: synchronized('_loginWithTwitter'),

  _loginWithTwitter: function(twitterFieldsMapping, stayLoggedIn, async) {
    return this._loginSocial('Twitter', twitterFieldsMapping, null, null, stayLoggedIn, async);
  },

  _socialContainer: function(socialType, container) {
    var loadingMsg;

    if (container) {
      var client;

      container = container[0];
      loadingMsg = document.createElement('div');
      loadingMsg.innerHTML = "Loading...";
      container.appendChild(loadingMsg);
      container.style.cursor = 'wait';

      this.closeContainer = function() {
        container.style.cursor = 'default';
        container.removeChild(client);
      };

      this.removeLoading = function() {
        container.removeChild(loadingMsg);
      };

      this.doAuthorizationActivity = function(url) {
        this.removeLoading();
        client = document.createElement('iframe');
        client.frameBorder = 0;
        client.width = container.style.width;
        client.height = container.style.height;
        client.id = "SocialAuthFrame";
        client.setAttribute("src", url + "&amp;output=embed");
        container.appendChild(client);
        client.onload = function() {
          container.style.cursor = 'default';
        };
      };
    } else {
      container = window.open('', socialType + ' authorization',
        "resizable=yes, scrollbars=yes, titlebar=yes, top=10, left=10");
      loadingMsg = container.document.getElementsByTagName('body')[0].innerHTML;
      loadingMsg = "Loading...";
      container.document.getElementsByTagName('html')[0].style.cursor = 'wait';

      this.closeContainer = function() {
        container.close();
      };

      this.removeLoading = function() {
        loadingMsg = null;
      };

      this.doAuthorizationActivity = function(url) {
        container.location.href = url;
        container.onload = function() {
          container.document.getElementsByTagName("html")[0].style.cursor = 'default';
        };
      };
    }
  },

  _loginSocial: function(socialType, fieldsMapping, permissions, container, stayLoggedIn, async) {
    console.warn(
      'Method "loginWith' + socialType + '" is depricated.\n' +
      'Use method "loginWith' + socialType + 'Sdk" instead.'
    );

    var socialContainer = new this._socialContainer(socialType, container);
    async = Utils.extractResponder(arguments);
    async = this._wrapAsync(async, stayLoggedIn);

    Utils.addEvent('message', window, function(e) {
      if (e.origin == Backendless.serverURL) {
        var result = JSON.parse(e.data);

        if (result.fault) {
          async.fault(result.fault);
        } else {
          async.success(result);
        }

        Utils.removeEvent('message', window);
        socialContainer.closeContainer();
      }
    });

    var interimCallback = new Async(function(r) {
      socialContainer.doAuthorizationActivity(r);
    }, function(e) {
      socialContainer.closeContainer();
      async.fault(e);
    });

    var request = {};
    request.fieldsMapping = fieldsMapping || {};
    request.permissions = permissions || [];

    Backendless._ajax({
      method      : 'POST',
      url         : this.restUrl + "/social/oauth/" + socialType.toLowerCase() + "/request_url",
      isAsync     : true,
      asyncHandler: interimCallback,
      data        : JSON.stringify(request)
    });
  },

  loginWithFacebookSdk: function(accessToken, fieldsMapping, stayLoggedIn) {
    return this._sendSocialLoginRequest("facebook", accessToken, fieldsMapping, stayLoggedIn);
  },

  loginWithGooglePlusSdk: function(accessToken, fieldsMapping, stayLoggedIn) {
    return this._sendSocialLoginRequest("googleplus", accessToken, fieldsMapping, stayLoggedIn);
  },

  loginWithTwitterSdk: function(accessToken, fieldsMapping, stayLoggedIn) {
    return this._sendSocialLoginRequest("twitter", accessToken, fieldsMapping, stayLoggedIn);
  },

  _sendSocialLoginRequest: function(socialType, accessToken, fieldsMapping, stayLoggedIn) {
    var socialLoginLabels = {
      googleplus: 'Google+',
      facebook  : 'Facebook',
      twitter   : 'Twitter'
    };
    var data = {
      fieldsMapping: fieldsMapping || {},
      accessToken  : accessToken
    };
    var url = this.restUrl + "/social/" + socialType + "/sdk/login";
    var users = this;

    return new Promise(function(resolve, reject) {
      if (!accessToken) {
        return reject(new Error(socialLoginLabels[socialType] + ' Access Token cannot be empty'));
      }

      var asyncHandler = users._wrapAsync(new Async(resolve, reject), stayLoggedIn);

      Backendless._ajax({
        method      : 'POST',
        url         : url,
        isAsync     : true,
        asyncHandler: asyncHandler,
        data        : JSON.stringify(data)
      });
    });
  },

  isValidLogin: promisified('_isValidLogin'),

  isValidLoginSync: synchronized('_isValidLogin'),

  _isValidLogin: function(async) {
    var userToken = Backendless.LocalCache.get("user-token");
    var responder = Utils.extractResponder(arguments);
    var isAsync = !!responder;

    if (userToken) {
      if (!isAsync) {
        try {
          var result = Backendless._ajax({
            method: 'GET',
            url   : this.restUrl + '/isvalidusertoken/' + userToken
          });
          return !!result;
        } catch (e) {
          return false;
        }
      }

      return Backendless._ajax({
        method      : 'GET',
        url         : this.restUrl + '/isvalidusertoken/' + userToken,
        isAsync     : isAsync,
        asyncHandler: responder
      });
    }

    if (!isAsync) {
      return !!this.getCurrentUserSync();
    }

    this.getCurrentUser().then(function(user) {
      responder.success(!!user);
    }, function() {
      responder.success(false);
    });
  },

  resendEmailConfirmation: promisified('_resendEmailConfirmation'),

  resendEmailConfirmationSync: synchronized('_resendEmailConfirmation'),

  _resendEmailConfirmation: function(emailAddress, async) {
    if (!emailAddress || emailAddress instanceof Async) {
      throw new Error('Email cannot be empty');
    }

    var responder = Utils.extractResponder(arguments);
    var isAsync = !!responder;

    return Backendless._ajax({
      method      : 'POST',
      url         : this.restUrl + "/resendconfirmation/" + emailAddress,
      isAsync     : isAsync,
      asyncHandler: responder
    });
  }
};
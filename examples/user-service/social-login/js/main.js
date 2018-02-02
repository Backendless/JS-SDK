(function($, Backendless) {
  var SERVER_URL = "https://api.backendless.com";
  var APPLICATION_ID = '';
  var API_KEY = '';
  var GOOGLE_CLIENT_ID = '';
  var FACEBOOK_APP_ID = '';

  var app = {
    ui: {
      preloader       : '.preloader',
      loginForm       : '.form.login',
      logoutForm      : '.form.logout',
      googleLoginBtn  : '#google-plus-login',
      facebookLoginBtn: '#facebook-login',
      twitterLoginBtn : '#twitter-login',
      logoutBtn       : '#logout'
    },

    toBind: [
      'onLogoutClick',
      'onGoogleLoginClick',
      'onFacebookLoginClick',
      'onTwitterLoginClick',
      'onLoggedIn'
    ],

    init: function() {
      this.initBackendless();

      this.bindMethods();
      this.collectUiElements();
      this.initEventHandlers();

      this.setInitialState();
    },

    initBackendless: function() {
      Backendless.serverURL = SERVER_URL;
      Backendless.initApp(APPLICATION_ID, API_KEY);

      if (!APPLICATION_ID || !API_KEY) {
        alert(
          'Missing application ID or api key arguments. ' +
          'Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. ' +
          'Copy/paste the values into the Backendless.initApp call located in js/main.js'
        )
      }
    },

    setInitialState: function() {
      var app = this;
      var cache = Backendless.LocalCache.getAll();

      if (cache.stayLoggedIn) {
        Backendless.UserService.isValidLogin().then(function(isLoginValid) {
          if (isLoginValid) {
            app.showLogoutForm();
          } else {
            Backendless.LocalCache.clear();
            app.showLoginForm();
          }
        }, this.onError);

        return;
      }

      this.showLoginForm();
    },

    collectUiElements: function() {
      for (var key in this.ui) {
        this.ui[key] = $(this.ui[key])
      }
    },

    bindMethods: function() {
      var app = this;

      this.toBind.forEach(function(methodName) {
        app[methodName] = app[methodName].bind(app)
      })
    },

    initEventHandlers: function() {
      this.ui.googleLoginBtn.on('click', this.onGoogleLoginClick);
      this.ui.facebookLoginBtn.on('click', this.onFacebookLoginClick);
      this.ui.twitterLoginBtn.on('click', this.onTwitterLoginClick);
      this.ui.logoutBtn.on('click', this.onLogoutClick)
    },

    showLoginForm: function() {
      this.ui.preloader.hide();
      this.ui.logoutForm.hide();
      this.ui.loginForm.show();
    },

    showLogoutForm: function() {
      this.ui.preloader.hide();
      this.ui.loginForm.hide();
      this.ui.logoutForm.show();

      console.log(Backendless.UserService.getUserRolesSync());
    },

    onGoogleLoginClick: function() {
      if (!gapi) {
        return alert("Google+ SDK not found");
      }

      if (!GOOGLE_CLIENT_ID) {
        return alert(
          'Missing Google client ID. ' +
          'Select client ID from your account on https://console.developers.google.com'
        );
      }

      var app = this;

      gapi.auth.authorize({
        client_id: GOOGLE_CLIENT_ID,
        scope    : "https://www.googleapis.com/auth/plus.login"
      }, function(response) {
        var accessToken = response && response.access_token;

        app.backendlessLoginWithGooglePlusSDK(accessToken);
      });
    },

    onFacebookLoginClick: function() {
      if (!FB) {
        return alert("Facebook SDK not found");
      }

      if (!FACEBOOK_APP_ID) {
        return alert("Facebook App Id cannot be empty");
      }

      // description of options parameter: https://developers.facebook.com/docs/reference/javascript/FB.login/v2.9
      var fbLoginOptions = {};
      var app = this;

      FB.init({
        appId  : FACEBOOK_APP_ID,
        cookie : true,
        xfbml  : true,
        version: 'v2.12'
      });

      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          app.backendlessLoginWithFacebookSDK(response);
        } else {
          FB.login(function(response) {
            app.backendlessLoginWithFacebookSDK(response);
          }, fbLoginOptions);
        }
      });
    },

    onTwitterLoginClick: function() {
      Backendless.UserService.loginWithTwitter().then(this.onLoggedIn, this.onError);
    },

    /*
     * Backendless Login with Facebook SDK
     *
     * @param {Object} Facebook login status
     */
    backendlessLoginWithFacebookSDK: function(loginStatus) {
      var accessToken = loginStatus && loginStatus.authResponse && loginStatus.authResponse.accessToken;
      var fieldsMapping = { 'email': 'email', 'first_name': 'first_name' };
      var stayLoggedIn = false;

      Backendless.UserService.loginWithFacebookSdk(accessToken, fieldsMapping, stayLoggedIn)
        .then(this.onLoggedIn, this.onError);
    },

    /*
     * Backendless Login with Google+ SDK
     *
     * @param {accessToken} Google+ access token
     */
    backendlessLoginWithGooglePlusSDK: function(accessToken) {
      var fieldsMapping = {};
      var stayLoggedIn = true;

      Backendless.UserService.loginWithGooglePlusSdk(accessToken, fieldsMapping, stayLoggedIn)
        .then(this.onLoggedIn, this.onError);
    },

    /*
     * Login with Twitter
     */
    onTwitterLoginClick: function() {
      Backendless.UserService.loginWithTwitter().then(this.onLoggedIn, this.onError);
    },

    /*
     * Logout
     */
    onLogoutClick: function() {
      Backendless.UserService.logout().then(this.onLoggedOut, this.onError);
    },

    onLoggedIn: function(user) {
      this.showLogoutForm();

      console.log(user);
    },

    onLoggedOut: function() {
      location.reload();
    },

    onError: function(err) {
      err = err || {};

      console.log(err)

      console.error("error message - " + err.message);

      if (err.statusCode) {
        console.error("error statusCode - " + err.statusCode);
      }
    }
  };

  app.init();

})($, Backendless);

                                
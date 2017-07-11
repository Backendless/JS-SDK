(function($, Backendless) {
  var SERVER_URL = "https://api.backendless.com";
  var APPLICATION_ID;
  var API_KEY;
  var GOOGLE_CLIENT_ID;
  var FACEBOOK_APP_ID;

  var app = {
    ui: {
      preloader          : '.preloader',
      loginForm          : '.form.login',
      logoutForm         : '.form.logout',
      googleLoginBtn     : '#google-plus-login',
      googleSdkLoginBtn  : '#google-plus-sdk-login',
      facebookLoginBtn   : '#facebook-login',
      facebookSdkLoginBtn: '#facebook-sdk-login',
      twitterLoginBtn    : '#twitter-login',
      logoutBtn          : '#logout'
    },

    toBind: [
      'onLogoutClick',
      'onGoogleLoginClick',
      'onGoogleSDKLoginClick',
      'onFacebookLoginClick',
      'onFacebookSDKLoginClick',
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
      var cache = Backendless.LocalCache.getAll();

      if (cache.stayLoggedIn) {
        Backendless.UserService.isValidLogin().then(function(isLoginValid) {
          if (isLoginValid) {
            this.showLogoutForm();
          } else {
            Backendless.LocalCache.clear();
            this.showLoginForm();
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
      this.ui.googleSdkLoginBtn.on('click', this.onGoogleSDKLoginClick);
      this.ui.facebookLoginBtn.on('click', this.onFacebookLoginClick);
      this.ui.facebookSdkLoginBtn.on('click', this.onFacebookSDKLoginClick);
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
    },

    /*
     * Login with Google Plus
     */
    onGoogleLoginClick: function() {
      Backendless.UserService.loginWithGooglePlus().then(this.onLoggedIn, this.onError);
    },

    /*
     * Login with Google Plus SDK
     */
    onGoogleSDKLoginClick: function() {
      if (!GOOGLE_CLIENT_ID) {
        alert(
          'Missing Google client ID. ' +
          'Select client ID from your account on https://console.developers.google.com'
        );

        return;
      }

      Backendless.UserService.loginWithGooglePlusSdk(GOOGLE_CLIENT_ID).then(this.onLoggedIn, this.onError);
    },

    /*
     * Login with Facebook
     */
    onFacebookLoginClick: function() {
      Backendless.UserService.loginWithFacebook().then(this.onLoggedIn, this.onError);
    },

    /*
     * Login with Facebook SDK
     */
    onFacebookSDKLoginClick: function() {
      Backendless.UserService.loginWithFacebookSdk(FACEBOOK_APP_ID).then(this.onLoggedIn, this.onError);
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

      console.error("error message - " + err.message);
      console.error("error code - " + err.statusCode);
    }
  };

  app.init();

})($, Backendless);

                                
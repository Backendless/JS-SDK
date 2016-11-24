(function ($, Backendless) {
    var APPLICATION_ID = '';
    var SECRET_KEY = '';

    if (!APPLICATION_ID || !SECRET_KEY)
        alert("Missing application ID or secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in UserExample.js");

    init();

    function init() {
        $('.carousel').carousel({interval: false});

        Backendless.initApp(APPLICATION_ID, SECRET_KEY);

        initEventHandlers();
    }

    function initEventHandlers() {
        $('#register-btn').on('click', createUser);
        $('#login-btn').on('click', loginUser);
    }

    function createUser() {
        var user = new Backendless.User();

        $('.register-field').each(function () {
            var propertyName = $(this)[0].name;
            user[propertyName] = $(this)[0].value;
        });

        showInfo('Creating...');

        Backendless.UserService.register(user).then(
            function () {
                showInfo("User successfully created");
            },
            onError
        );
    }

    function loginUser() {
        var login = {};

        $('.login-field').each(function () {
            var propertyName = $(this)[0].name;
            login[propertyName] = $(this)[0].value;
        });

        showInfo('Entering...');

        Backendless.UserService.login(login.email, login.password).then(
            function (user) {
                user ? showInfo("Login successful") : showInfo("Login failed");
            },
            onError
        );

    }

    function onError(e) {
        showInfo(e.message);
    }

    function showInfo(text) {
        var carousel = $('.carousel');

        $('#message').text(text);
        carousel.carousel(2);
        carousel.carousel('pause');
    }
})(jQuery, Backendless);
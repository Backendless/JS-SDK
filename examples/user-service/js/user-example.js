var APPLICATION_ID = '';
var SECRET_KEY = '';
var VERSION = 'v1';

if (!APPLICATION_ID || !SECRET_KEY || !VERSION)
    alert("Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in UserExample.js");

init();
function init() {
    $('.carousel').carousel({interval: false});
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
    var userProps = [
        {name: 'email'},
        {name: 'name'},
        {name: 'password'}
    ];

    for (var element in userProps) {
        makeComponent(userProps[element]);
    }
}

function makeComponent(property) {
    $("#regFields").append("<div><input type='text' class='input-block-level user-properties' placeholder= '" + property.name + "' name='" + property.name + "'> </input></div>");
}

function createUser(form) {
    var user = new Backendless.User();

    $(".user-properties").each(function () {
        var propertyName = $(this)[0].name;
        if (propertyName)
            user[propertyName] = $(this)[0].value;
    });

    try {
        var register = Backendless.UserService.register(user);
        showInfo(" User successfully created");
    }
    catch (e) {
        showInfo(e.message);
    }
}

function loginUser(form)/*function to check userid & password*/ {
    try {
        var user = Backendless.UserService.login(form.userid.value, form.pswrd.value);
        if (user != null)
            showInfo("Login successful");
        else
            showInfo("Login failed");
    }
    catch (e) {
        showInfo("Login failed. " + e.message);
    }
}

function showInfo(text) {
    $('#message').text(text);
    var carousel = $('.carousel');
    carousel.carousel(2);
    carousel.carousel('pause');
}
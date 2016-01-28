var APPLICATION_ID = '';
var SECRET_KEY = '';
var VERSION = 'v1';

var DEVICE_ID = "fileServiceTest";
var TEST_FOLDER = "testFolder";
var files;

if( !APPLICATION_ID || !SECRET_KEY || !VERSION )
    alert( "Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in FilesExample.js" );

$().ready( function()
{
    init();
});

function init() {
    $('.carousel').carousel({interval: false});
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
}
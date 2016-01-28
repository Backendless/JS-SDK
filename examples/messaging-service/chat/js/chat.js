var APPLICATION_ID = '';
var SECRET_KEY = '';
var VERSION = 'v1';
var CHANNEL = 'default';

if( !APPLICATION_ID || !SECRET_KEY || !VERSION )
    alert( "Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in chat.js" );


Backendless.initApp( APPLICATION_ID, SECRET_KEY, VERSION );

var $name_field;
var $messages_history_field;
var $message_field;

$( function ()
   {
       $name_field = $( '#name-field' );
       $messages_history_field = $( '#messages-history-field' );
       $message_field = $( '#message-field' );

    $("#message-field").keyup(function(event){
        if(event.keyCode == 13){
            publish();
        }
    });

   } );

function subscribe()
{
    if( !$name_field.val() )
    {
        alert( "Enter your name" );
        return;
    }

    var subscriptionOptions = new SubscriptionOptions();
    Backendless.Messaging.subscribe( CHANNEL, onMessage, subscriptionOptions, new Backendless.Async( onSubscribed, onFault ) );
}

function publish()
{
    if( !$message_field )
        return;

    var publishOptions = new PublishOptions();
    publishOptions.publisherId = $name_field.val();
    Backendless.Messaging.publish( CHANNEL, $message_field.val(), publishOptions );
    $message_field.val( null );
}

function onSubscribed()
{
    $( '#welcome-screen' ).effect( "fade", function ()
    {
        $( '#chat_screen' ).effect( "fade" );
    } );
}

function protectXSS(val)
{
    return val.replace(/(<|>)/g, function (match) {
        return match == '<' ? '&lt;' : '&gt;';
    });
}

function onMessage( result )
{
    $.each( result.messages, function ()
    {
        this.data = protectXSS(this.data);
        this.publisherId = protectXSS(this.publisherId);
        $messages_history_field.html( this.publisherId + ": " + this.data + "<br/>" + $messages_history_field.html() );
    } );
}

function onFault( fault )
{
    alert( fault.message );
}
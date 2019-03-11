var APPLICATION_ID = '';
var SECRET_KEY = '';
var CHANNEL = 'default';

if (!APPLICATION_ID || !SECRET_KEY) {
  alert(
    "Missing application ID or secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen.");
}

Backendless.initApp(APPLICATION_ID, SECRET_KEY);

var $name_field;
var $messages_history_field;
var $message_field;
var messages = [];
var channel;

$(function() {
  $name_field = $('#name-field');
  $messages_history_field = $('#messages-history-field');
  $message_field = $('#message-field');

  $("#message-field").keyup(function(event) {
    if (event.keyCode == 13) {
      publish();
    }
  });

});

function subscribe() {
  if (!$name_field.val()) {
    alert("Enter your name");
    return;
  }

  channel = Backendless.Messaging.subscribe(CHANNEL);

  channel.addMessageListener(onMessage);

  onSubscribed();
}

function publish() {
  if (!$message_field) {
    return;
  }

  channel.publish($message_field.val()).catch(onFault)

  $message_field.val(null);
}

function onSubscribed() {
  $('#welcome-screen').effect("fade", function() {
    $('#chat_screen').effect("fade");
  });
}

function onMessage(result) {
  messages.push(result.message);

  $messages_history_field.html(result.message + "<br/>" + $messages_history_field.html());
}

function onFault(fault) {
  alert(fault.message);
}

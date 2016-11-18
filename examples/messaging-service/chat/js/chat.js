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

  var subscriptionOptions = new SubscriptionOptions();
  Backendless.Messaging.subscribe(CHANNEL, onMessage, subscriptionOptions).then(onSubscribed, onFault);
}

function publish() {
  if (!$message_field) {
    return;
  }

  var publishOptions = new PublishOptions();
  var deliveryTarget = new DeliveryOptions();

  publishOptions.publisherId = $name_field.val();
  Backendless.Messaging.publish(CHANNEL, $message_field.val(), publishOptions, deliveryTarget);

  $message_field.val(null);
}

function onSubscribed() {
  $('#welcome-screen').effect("fade", function() {
    $('#chat_screen').effect("fade");
  });
}

function protectXSS(val) {
  return val.replace(/(<|>)/g, function(match) {
    return match == '<' ? '&lt;' : '&gt;';
  });
}

function onMessage(result) {
  $.each(result.messages, function() {
    this.data = protectXSS(this.data);
    this.publisherId = protectXSS(this.publisherId);
    $messages_history_field.html(this.publisherId + ": " + this.data + "<br/>" + $messages_history_field.html());
  });
}

function onFault(fault) {
  alert(fault.message);
}
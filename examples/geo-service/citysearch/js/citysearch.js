var APP_ID     = '',
    SECRET_KEY = '',
    CATEGORY = 'geoservice_sample',
    FENCE_NAME = '';

function initApp() {
  Backendless.initApp(APP_ID, SECRET_KEY);
}

if (!APP_ID || !SECRET_KEY) {
  alert(
    "Missing application ID or secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in citysearch.js");
}

function FenceEvent(args) {
  args = args || {};
  this.latitude = args.latitude || 0;
  this.longitude = args.longitude || 0;
  this.fenceName = args.fenceName || "defaultName";
  this.rule = args.rule || "noname";
}

var myLocation = new GeoPoint();

var inAppCallBack = {
  onenter: function(geofenceName, geofenceId, latitude, longitude) {
    var logger = new FenceEvent({
      latitude : latitude,
      longitude: longitude,
      fenceName: geofenceName,
      rule     : "onEnter"
    });

    Backendless.Persistence.of(FenceEvent).save(logger);
  },

  onstay: function(geofenceName, geofenceId, latitude, longitude) {
    var logger = new FenceEvent({
      latitude : latitude,
      longitude: longitude,
      fenceName: geofenceName,
      rule     : "onStay"
    });

    Backendless.Persistence.of(FenceEvent).save(logger);
  },

  onexit: function(geofenceName, geofenceId, latitude, longitude) {
    var logger = new FenceEvent({
      latitude : latitude,
      longitude: longitude,
      fenceName: geofenceName,
      rule     : "onExit"
    });

    Backendless.Persistence.of(FenceEvent).save(logger);
  }
};

initApp();

// start monitoring all fences with callback defined on client
Backendless.Geo.startGeofenceMonitoringWithInAppCallback(null, inAppCallBack);

// start monitoring fence with name FENCE_NAME with callback defined on client
//Backendless.Geo.startGeofenceMonitoringWithInAppCallback(FENCE_NAME, inAppCallBack);

//var onStartMonitoringSuccess = function(result) {
//  console.log("geofence monitoring has been started");
//};

//var onError = function(error) {
//  console.log(error);
//};

// start monitoring all fences with callback defined on server
//Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(null, myLocation).then(onStartMonitoringSuccess, onError);

// start monitoring fence with name FENCE_NAME with callback defined on server
//Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(FENCE_NAME, myLocation, completionCallback)
//  .then(onStartMonitoringSuccess, onError);

var $resultBlock;
var $count;
var $thead;
var $tbody;
var $geoQuery;

$(function() {
  $('#radius-slider').slider({
    range: "min",
    value: 1,
    min  : 1,
    max  : 20000,
    slide: function(event, ui) {
      $("#radius-value").text(ui.value);
    }
  });

  $("#search-button").click(function() {
    searchGeoPoints();
  });

  $resultBlock = $('#result-block');
  $count = $('#total-count');
  $thead = $('#thead');
  $tbody = $('#tbody');

  $geoQuery = new BackendlessGeoQuery();
  $geoQuery.latitude = parseInt($('#latitude').text());
  $geoQuery.longitude = parseInt($('#longitude').text());
  $geoQuery.units = Backendless.Geo.UNITS.KILOMETERS;
  $geoQuery.categories.push(CATEGORY);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(applyLocation);
  }
});

function applyLocation(position) {
  $('#latitude').text(position.coords.latitude);
  $geoQuery.latitude = position.coords.latitude;

  $('#longitude').text(position.coords.longitude);
  $geoQuery.longitude = position.coords.longitude;
}

function searchGeoPoints() {
  startLoading();

  $tbody.empty();
  $count.text('loading...');
  $resultBlock.hide();

  $geoQuery.radius = $('#radius-value').text();
  Backendless.Geo.find($geoQuery).then(onResult, onFault);
  Backendless.Geo.getGeopointCount($geoQuery).then(onCountResult, onFault);
}

function onCountResult(count) {
  $count.text(count);
}

function onResult(result) {
  finishLoading();
  $resultBlock.show();

  if (!result.length) {
    $thead.hide();
    $tbody.append("<h3 style='text-align: center'>No geo points found</h3>");
    return;
  }

  $.each(result, function() {
    var cells = [
      "<td>" + this.metadata.city + "</td>", "<td>" + this.latitude + "</td>", "<td>" + this.longitude + "</td>"
    ];

    $thead.show();
    $tbody.append("<tr>" + cells.join('') + "</tr>");
  });
}

function onFault(fault) {
  finishLoading();
  alert(fault.message);
}

function startLoading() {
  $('#search-button').hide();
  $('#loader').show();
}

function finishLoading() {
  $('#search-button').show();
  $('#loader').hide();
}
/// <reference path="../libs/backendless.d.ts" />

function testMain() {
    var VERSION:string = Backendless.VERSION;
    var applicationId:string = Backendless.applicationId;
    var secretKey:string = Backendless.secretKey;
    var appVersion:string = Backendless.appVersion;
    var serverURL:string = Backendless.serverURL;
    var appPath:string = Backendless.appPath;
    var APPLICATION_ID:string = 'my-application-id';
    var JS_SECRET_KEY:string = 'my-js-secret-key';
    var APPLICATION_VERSION:string = 'my-app-version';

    Backendless.browser = {browser: 'string', version: 'string'};

    Backendless.initApp(APPLICATION_ID, JS_SECRET_KEY, APPLICATION_VERSION);

    Backendless.setUIState('state');
    Backendless.setUIState(null);
}

function testUtils() {
    var isObjectResult:boolean = Backendless.Utils.isObject(null);
    var isStringResult:boolean = Backendless.Utils.isString(null);
    var isNumberResult:boolean = Backendless.Utils.isNumber(null);
    var isFunctionResult:boolean = Backendless.Utils.isFunction(null);
    var isBooleanResult:boolean = Backendless.Utils.isBoolean(null);
    var isDateResult:boolean = Backendless.Utils.isDate(null);
    var isArrayResult:boolean = Backendless.Utils.isArray(null);
    var isEmptyResult:boolean = Backendless.Utils.isEmpty(null);

    Backendless.Utils.addEvent('my-event', document.createElement('DIV'), function (event:Event) {
    });

    Backendless.Utils.removeEvent('my-event', document.createElement('DIV'));

    Backendless.Utils.forEach({a: 1, b: true, c: null, d: 'string'}, function (value:any, key:string, obj:Object) {
    }, this);
}

function testLocalCache() {
    var key:string = 'key';
    var str:string = 'string';
    var obj:Object = {};
    var arr:any[] = [];
    var num:number = 1234;
    var bol:boolean = true;
    var nul:any = null;

    var result:boolean = Backendless.LocalCache.enabled;
    var result1:boolean = Backendless.LocalCache.exists(key);
    var result2:boolean = Backendless.LocalCache.set(key);
    var result3:Object = Backendless.LocalCache.set(key, obj);
    var result4:any[] = Backendless.LocalCache.set(key, arr);
    var result5:number = Backendless.LocalCache.set(key, num);
    var result6:string = Backendless.LocalCache.set(key, str);
    var result7:any = Backendless.LocalCache.set(key, nul);
    var result8:boolean = Backendless.LocalCache.set(key, bol);
    var result9:any = Backendless.LocalCache.get(key);
    var result11:boolean = Backendless.LocalCache.remove(key);
    var result12:Object = Backendless.LocalCache.getAll();
    var result13:Object = Backendless.LocalCache.getCachePolicy(key);
    var result14:string = Backendless.LocalCache.serialize(obj);
    var result15:string = Backendless.LocalCache.serialize(arr);
    var result16:string = Backendless.LocalCache.serialize(num);
    var result17:string = Backendless.LocalCache.serialize(str);
    var result18:string = Backendless.LocalCache.serialize(bol);
    var result19:any = Backendless.LocalCache.deserialize(key);

    Backendless.LocalCache.clear(key);
    Backendless.LocalCache.flushExpired();
}

function testAsyncClass() {
    var onSuccess = function (data:Object) {
    };

    var onError = function (data:Object) {
    };

    var context:Object = this;
    var data:Object = {};

    var async1:Backendless.Async = new Backendless.Async(onSuccess);
    var async2:Backendless.Async = new Backendless.Async(onSuccess, onError);
    var async3:Backendless.Async = new Backendless.Async(onSuccess, onError, context);
    var async4:Backendless.Async = new Backendless.Async(onSuccess, context);

    async1.success(data);
    async1.fault(data);
}

function testDataQueryClass() {
    var dataQuery:Backendless.DataQuery = new Backendless.DataQuery();
    var properties:string[] = dataQuery.properties;
    var condition:string = dataQuery.condition;
    var options:Object = dataQuery.options;
    var url:string = dataQuery.url;
    var str:string = 'str';

    dataQuery.addProperty(str);
}

function testDataStoreClass() {
    var item:Object = {};
    var dataStore1:Backendless.DataStore = Backendless.Persistence.of('str');
    var dataStore2:Backendless.DataStore = Backendless.Persistence.of({});
    var dataStore3:Backendless.DataStore = Backendless.Persistence.of(function () {
    });

    var model:Function|Object = dataStore1.model;
    var className:string = dataStore1.className;
    var restUrl:string = dataStore1.restUrl;

    var dataQuery1:Backendless.DataQuery = new Backendless.DataQuery();
    var dataQuery2:Object = {url: 'my/url'};

    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    resultObj = dataStore1.save(item);
    resultXHR = dataStore1.save(item, async);

    resultObj = dataStore1.remove('str');
    resultObj = dataStore1.remove(item);
    resultXHR = dataStore1.remove('str', async);
    resultXHR = dataStore1.remove(item, async);

    resultObj = dataStore1.find(dataQuery1);
    resultObj = dataStore1.find(dataQuery2);
    resultObj = dataStore1.find('id');
    resultObj = dataStore1.find();
    resultXHR = dataStore1.find(dataQuery1, async);
    resultXHR = dataStore1.find(dataQuery2, async);
    resultXHR = dataStore1.find('id', async);
    resultXHR = dataStore1.find(async);

    resultObj = dataStore1.findById(dataQuery1);
    resultObj = dataStore1.findById(dataQuery2);
    resultObj = dataStore1.findById('myId');
    resultXHR = dataStore1.findById(dataQuery1, async);
    resultXHR = dataStore1.findById(dataQuery2, async);
    resultXHR = dataStore1.findById('myId', async);

    resultObj = dataStore1.findFirst();
    resultObj = dataStore1.findFirst(dataQuery1);
    resultObj = dataStore1.findFirst(dataQuery2);
    resultXHR = dataStore1.findFirst(async);
    resultXHR = dataStore1.findFirst(dataQuery1, async);
    resultXHR = dataStore1.findFirst(dataQuery2, async);

    resultObj = dataStore1.findLast();
    resultObj = dataStore1.findLast(dataQuery1);
    resultObj = dataStore1.findLast(dataQuery2);
    resultXHR = dataStore1.findLast(async);
    resultXHR = dataStore1.findLast(dataQuery1, async);
    resultXHR = dataStore1.findLast(dataQuery2, async);

    dataStore1.loadRelations(dataQuery1);
    dataStore1.loadRelations(dataQuery2);
    dataStore1.loadRelations(dataQuery1, ['item1', 'item2']);
    dataStore1.loadRelations(dataQuery2, ['item1', 'item2']);
}

function testPersistence() {
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;
    var dataStore:Backendless.DataStore = Backendless.Persistence.of('str');
    var Model:Function;
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    resultObj = Backendless.Persistence.save('model', {});
    resultObj = Backendless.Persistence.save(dataStore, {});
    resultXHR = Backendless.Persistence.save('model', {}, async);
    resultXHR = Backendless.Persistence.save(dataStore, {}, async);

    resultXHR = Backendless.Persistence.getView('viewName', 'whereClause', 123, 123, async);
    resultXHR = Backendless.Persistence.getView('viewName', 'whereClause', 123, async);
    resultXHR = Backendless.Persistence.getView('viewName', 'whereClause', async);
    resultXHR = Backendless.Persistence.getView('viewName', async);
    resultObj = Backendless.Persistence.getView('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Persistence.getView('viewName', 'whereClause', 123);
    resultObj = Backendless.Persistence.getView('viewName', 'whereClause');
    resultObj = Backendless.Persistence.getView('viewName');

    resultXHR = Backendless.Persistence.callStoredProcedure('spName', 'argumentValues', async);
    resultXHR = Backendless.Persistence.callStoredProcedure('spName', {}, async);
    resultObj = Backendless.Persistence.callStoredProcedure('spName', 'argumentValues');
    resultObj = Backendless.Persistence.callStoredProcedure('spName', {});

    dataStore = Backendless.Persistence.of(Model);
    dataStore = Backendless.Persistence.of('str');
    dataStore = Backendless.Persistence.of({});

    resultObj = Backendless.Persistence.describe(Model);
    resultObj = Backendless.Persistence.describe('str');
    resultObj = Backendless.Persistence.describe({});
    resultXHR = Backendless.Persistence.describe(Model, async);
    resultXHR = Backendless.Persistence.describe('str', async);
    resultXHR = Backendless.Persistence.describe({}, async);
}

function testData() {
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;
    var dataStore:Backendless.DataStore = Backendless.Persistence.of('str');
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    resultObj = Backendless.Data.save('model', {});
    resultObj = Backendless.Data.save(dataStore, {});
    resultXHR = Backendless.Data.save('model', {}, async);
    resultXHR = Backendless.Data.save(dataStore, {}, async);

    resultXHR = Backendless.Data.getView('viewName', 'whereClause', 123, 123, async);
    resultXHR = Backendless.Data.getView('viewName', 'whereClause', 123, async);
    resultXHR = Backendless.Data.getView('viewName', 'whereClause', async);
    resultXHR = Backendless.Data.getView('viewName', async);
    resultObj = Backendless.Data.getView('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Data.getView('viewName', 'whereClause', 123);
    resultObj = Backendless.Data.getView('viewName', 'whereClause');
    resultObj = Backendless.Data.getView('viewName');

    resultXHR = Backendless.Data.callStoredProcedure('spName', 'argumentValues', async);
    resultXHR = Backendless.Data.callStoredProcedure('spName', {}, async);
    resultObj = Backendless.Data.callStoredProcedure('spName', 'argumentValues');
    resultObj = Backendless.Data.callStoredProcedure('spName', {});

    dataStore = Backendless.Data.of(function () {
    });
    dataStore = Backendless.Data.of('str');
    dataStore = Backendless.Data.of({});

    resultObj = Backendless.Data.describe(function () {
    });
    resultObj = Backendless.Data.describe('str');
    resultObj = Backendless.Data.describe({});
    resultXHR = Backendless.Data.describe(function () {
    }, async);
    resultXHR = Backendless.Data.describe('str', async);
    resultXHR = Backendless.Data.describe({}, async);
}

function testDataPermissions() {
    var userId:string = 'userId';
    var roleName:string = 'myRole';
    var dataObj:Backendless.ExistDataItemI = {___class: 'myClass', objectId: 'myId'};
    var resultObj:Backendless.ExistDataItemI;
    var resultXHR:XMLHttpRequest;

    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    resultObj = Backendless.Data.Permissions.FIND.grantUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.grantUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.FIND.grantRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.grantRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.FIND.grant(dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.grant(dataObj, async);
    resultObj = Backendless.Data.Permissions.FIND.denyUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.denyUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.FIND.denyRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.denyRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.FIND.deny(dataObj);
    resultXHR = Backendless.Data.Permissions.FIND.deny(dataObj, async);

    resultObj = Backendless.Data.Permissions.REMOVE.grantUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.grantUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.REMOVE.grantRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.grantRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.REMOVE.grant(dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.grant(dataObj, async);
    resultObj = Backendless.Data.Permissions.REMOVE.denyUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.denyUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.REMOVE.denyRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.denyRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.REMOVE.deny(dataObj);
    resultXHR = Backendless.Data.Permissions.REMOVE.deny(dataObj, async);

    resultObj = Backendless.Data.Permissions.UPDATE.grantUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.grantUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.UPDATE.grantRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.grantRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.UPDATE.grant(dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.grant(dataObj, async);
    resultObj = Backendless.Data.Permissions.UPDATE.denyUser(userId, dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.denyUser(userId, dataObj, async);
    resultObj = Backendless.Data.Permissions.UPDATE.denyRole(roleName, dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.denyRole(roleName, dataObj, async);
    resultObj = Backendless.Data.Permissions.UPDATE.deny(dataObj);
    resultXHR = Backendless.Data.Permissions.UPDATE.deny(dataObj, async);
}

function testUser() {
    var newUser = new Backendless.User();

    var className:string = newUser.___class;
}

function testUserService() {
    var userName:string = 'userName';
    var roleName:string = 'rolename';
    var password:string = 'password';
    var div:HTMLElement = document.createElement('div');
    var bol:boolean = true;
    var newUser:Backendless.User = new Backendless.User();
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    var restUrl:string = Backendless.UserService.restUrl;
    var loggedInUser:boolean = Backendless.UserService.loggedInUser();

    resultObj = Backendless.UserService.restorePassword('email');
    resultXHR = Backendless.UserService.restorePassword('email', async);

    newUser = Backendless.UserService.register(newUser);
    resultXHR = Backendless.UserService.register(newUser, async);

    newUser = Backendless.UserService.getUserRoles();
    resultXHR = Backendless.UserService.getUserRoles(async);

    newUser = Backendless.UserService.assignRole(userName, roleName);
    resultXHR = Backendless.UserService.assignRole(userName, roleName, async);

    newUser = Backendless.UserService.unassignRole(userName, roleName);
    resultXHR = Backendless.UserService.unassignRole(userName, roleName, async);

    newUser = Backendless.UserService.login(userName, password);
    newUser = Backendless.UserService.login(userName, password, bol);
    resultXHR = Backendless.UserService.login(userName, password, bol, async);
    resultXHR = Backendless.UserService.login(userName, password, null, async);

    newUser = Backendless.UserService.describeUserClass();
    resultXHR = Backendless.UserService.describeUserClass(async);

    Backendless.UserService.logout();
    resultXHR = Backendless.UserService.logout(async);

    newUser = Backendless.UserService.getCurrentUser();

    newUser = Backendless.UserService.update(newUser);
    resultXHR = Backendless.UserService.update(newUser, async);

    Backendless.UserService.loginWithFacebook();
    Backendless.UserService.loginWithFacebook({});
    Backendless.UserService.loginWithFacebook({}, {});
    Backendless.UserService.loginWithFacebook({}, {}, async);
    Backendless.UserService.loginWithFacebook({}, null, async);
    Backendless.UserService.loginWithFacebook(null, null, async);
    Backendless.UserService.loginWithFacebook({}, {}, async, document.createElement('div'));
    Backendless.UserService.loginWithFacebook({}, {}, null, document.createElement('div'));

    Backendless.UserService.loginWithGooglePlus();
    Backendless.UserService.loginWithGooglePlus({});
    Backendless.UserService.loginWithGooglePlus({}, {});
    Backendless.UserService.loginWithGooglePlus({}, {}, async);
    Backendless.UserService.loginWithGooglePlus({}, null, async);
    Backendless.UserService.loginWithGooglePlus(null, null, async);
    Backendless.UserService.loginWithGooglePlus({}, {}, async, document.createElement('div'));
    Backendless.UserService.loginWithGooglePlus({}, {}, null, document.createElement('div'));

    Backendless.UserService.loginWithTwitter();
    Backendless.UserService.loginWithTwitter({}, async);
    Backendless.UserService.loginWithTwitter(null, async);

    Backendless.UserService.loginWithFacebookSdk();
    Backendless.UserService.loginWithFacebookSdk({}, async);
    Backendless.UserService.loginWithFacebookSdk(null, async);

    Backendless.UserService.loginWithGooglePlusSdk();
    Backendless.UserService.loginWithGooglePlusSdk({}, async);
    Backendless.UserService.loginWithGooglePlusSdk(null, async);

    bol = Backendless.UserService.isValidLogin();
    resultXHR = Backendless.UserService.isValidLogin(async);
}

function testGoeService() {
    var newGeoPoint:Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;
    newGeoPoint.categories = ["c"];
    newGeoPoint.metadata = {"owner": "XXX"};

    var existPoint:Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.___class = 'c';
    newGeoPoint.objectId = 'id';
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;

    var geoClaster:Backendless.GeoCluster = new Backendless.GeoCluster();

    geoClaster.___class = 'geo';
    geoClaster.objectId = 'id';
    geoClaster.latitude = 20;
    geoClaster.longitude = 30;
    geoClaster.totalPoints = 10;
    geoClaster.geoQuery = new Backendless.GeoQuery();

    var bool:boolean = true;
    var errorStr:string = 'str';
    var fenceName:string = 'str';
    var categoryName:string = 'str';
    var restUrl:string = Backendless.Geo.restUrl;
    var EARTH_RADIUS:number = Backendless.Geo.EARTH_RADIUS;
    var geoCollectionResult:Backendless.GeoCollectionResultI;
    var geoCategory:Backendless.GeoCategoryI;
    var geoCategories:Backendless.GeoCategoryI[];
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    var baseGeoQuery:Backendless.GeoQueryI = new Backendless.GeoQuery();
    var rectangleGeoQuery:Backendless.RectangleGeoQueryI = {searchRectangle: [1, 2, 3, 4]};
    var circleGeoQuery:Backendless.CircleGeoQueryI = {latitude: 1, longitude: 1, radius: 1, units: 'm'};
    var categories:string|string[] = baseGeoQuery.categories;
    var includeMetadata:boolean = baseGeoQuery.includeMetadata;
    var metadata:Object = baseGeoQuery.metadata;
    var condition:string = baseGeoQuery.condition;
    var relativeFindMetadata:Object = baseGeoQuery.relativeFindMetadata;
    var relativeFindPercentThreshold:number = baseGeoQuery.relativeFindPercentThreshold;
    var pageSize:number = baseGeoQuery.pageSize;

    var searchRectangle:number[] = rectangleGeoQuery.searchRectangle;

    var latitude:number = circleGeoQuery.latitude;
    var longitude:number = circleGeoQuery.longitude;
    var radius:number = circleGeoQuery.radius;
    var units:string = circleGeoQuery.units;

    var inAppCallback:Backendless.GeofenceMonitoringCallbacksI = {
        onenter: function () {
        }
    };

    existPoint = Backendless.Geo.addPoint(newGeoPoint);
    resultXHR = Backendless.Geo.addPoint(newGeoPoint, async);

    geoCollectionResult = Backendless.Geo.find(baseGeoQuery);
    resultXHR = Backendless.Geo.find(baseGeoQuery, async);

    geoCollectionResult = Backendless.Geo.find(rectangleGeoQuery);
    resultXHR = Backendless.Geo.find(rectangleGeoQuery, async);

    geoCollectionResult = Backendless.Geo.find(circleGeoQuery);
    resultXHR = Backendless.Geo.find(circleGeoQuery, async);

    errorStr = Backendless.Geo.deletePoint(categoryName);
    resultXHR = Backendless.Geo.deletePoint(categoryName, async);
    errorStr = Backendless.Geo.deletePoint(existPoint);
    resultXHR = Backendless.Geo.deletePoint(existPoint, async);

    resultObj = Backendless.Geo.loadMetadata(existPoint);
    resultXHR = Backendless.Geo.loadMetadata(existPoint, async);
    resultObj = Backendless.Geo.loadMetadata(geoClaster);
    resultXHR = Backendless.Geo.loadMetadata(geoClaster, async);

    geoCollectionResult = Backendless.Geo.getClusterPoints(geoClaster);
    resultXHR = Backendless.Geo.getClusterPoints(geoClaster, async);

    geoCollectionResult = Backendless.Geo.getFencePoints(fenceName, baseGeoQuery);
    resultXHR = Backendless.Geo.getFencePoints(fenceName, baseGeoQuery, async);

    geoCollectionResult = Backendless.Geo.relativeFind(baseGeoQuery);
    resultXHR = Backendless.Geo.relativeFind(baseGeoQuery, async);

    geoCategory = Backendless.Geo.addCategory(categoryName);
    resultXHR = Backendless.Geo.addCategory(categoryName, async);

    bool = Backendless.Geo.deleteCategory(categoryName);
    resultXHR = Backendless.Geo.deleteCategory(categoryName, async);

    geoCategories = Backendless.Geo.getCategories();
    resultXHR = Backendless.Geo.getCategories(async);

    resultObj = Backendless.Geo.runOnStayAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnStayAction(fenceName, existPoint, async);

    resultObj = Backendless.Geo.runOnExitAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnExitAction(fenceName, existPoint, async);

    resultObj = Backendless.Geo.runOnEnterAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnEnterAction(fenceName, existPoint, async);

    Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback);
    Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback, async);

    Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint);
    Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint, async);

    Backendless.Geo.stopGeofenceMonitoring(fenceName);

}

function testMessaging() {
    var restUrl:string = Backendless.Messaging.restUrl;
    var channelProperties:Object = Backendless.Messaging.channelProperties;
    var channelName:string = 'str';
    var subject:string = 'str';
    var messageId:string = 'str';
    var message:string|Object = 'str';
    var resultObj:Object;
    var resultBool:boolean = true;
    var resultXHR:XMLHttpRequest;
    var bodyParts:Backendless.Bodyparts = new Backendless.Bodyparts();
    var recipients:string[] = ['str'];
    var attachments:string[] = ['str'];
    var channels:string[] = ['str'];
    var expiration:number|Date = 123;
    var publishOptions:Backendless.PublishOptions = new Backendless.PublishOptions();
    var deliveryOptions:Backendless.DeliveryOptions = new Backendless.DeliveryOptions();
    var subscription:Backendless.SubscriptionI;
    var subscriptionOptions:Backendless.SubscriptionOptions = new Backendless.SubscriptionOptions();
    var subscriptionCallback = function ():void {
    };
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    subscription = Backendless.Messaging.subscribe(channelName, subscriptionCallback, subscriptionOptions);
    resultXHR = Backendless.Messaging.subscribe(channelName, subscriptionCallback, subscriptionOptions, async);

    resultObj = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions);
    resultXHR = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions, async);

    resultObj = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments);
    resultXHR = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments, async);

    resultBool = Backendless.Messaging.cancel(messageId);
    resultXHR = Backendless.Messaging.cancel(messageId, async);

    resultObj = Backendless.Messaging.registerDevice(channels, expiration);
    resultXHR = Backendless.Messaging.registerDevice(channels, expiration, async);

    resultObj = Backendless.Messaging.getRegistrations();
    resultXHR = Backendless.Messaging.getRegistrations(async);

    resultObj = Backendless.Messaging.unregisterDevice();
    resultXHR = Backendless.Messaging.unregisterDevice(async);
}

function testFilesService() {
    var path:string = 'str';
    var fileName:string = 'str';
    var fileContent:Blob = new Blob();
    var pattern:string = 'str';
    var recursively:boolean = true;
    var pageSize:number = 123;
    var offset:number = 123;
    var overwrite:boolean = true;
    var file:File;
    var files:File[] = [file];
    var oldPathName:string = 'str';
    var newName:string = 'str';
    var sourcePath:string = 'str';
    var targetPath:string = 'str';
    var fileURL:string = 'str';
    var userid:string = 'str';
    var url:string = 'str';
    var permissionType:string = 'str';
    var roleName:string = 'str';

    var resultStr:string;
    var resultBool:boolean;
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {
    });

    resultStr = Backendless.Files.restUrl;
    resultStr = Backendless.Files.Permissions.restUrl;

    resultBool = Backendless.Files.saveFile(path, fileName, fileContent, overwrite);
    resultBool = Backendless.Files.saveFile(path, fileName, fileContent);

    Backendless.Files.saveFile(path, fileName, fileContent, overwrite, async);
    Backendless.Files.saveFile(path, fileName, fileContent, async);

    Backendless.Files.upload(file, path, overwrite, async);
    Backendless.Files.upload(files, path, overwrite, async);
    Backendless.Files.upload(file, path, null, async);
    Backendless.Files.upload(files, path, null, async);

    resultObj = Backendless.Files.listing(path);
    resultXHR = Backendless.Files.listing(path, async);
    resultObj = Backendless.Files.listing(path, pattern);
    resultXHR = Backendless.Files.listing(path, pattern, async);
    resultObj = Backendless.Files.listing(path, pattern, recursively);
    resultXHR = Backendless.Files.listing(path, pattern, recursively, async);
    resultObj = Backendless.Files.listing(path, pattern, recursively, pageSize);
    resultXHR = Backendless.Files.listing(path, pattern, recursively, pageSize, async);
    resultObj = Backendless.Files.listing(path, pattern, recursively, pageSize, offset);
    resultXHR = Backendless.Files.listing(path, pattern, recursively, pageSize, offset, async);

    resultObj = Backendless.Files.renameFile(oldPathName, newName);
    Backendless.Files.renameFile(oldPathName, newName, async);

    resultObj = Backendless.Files.moveFile(sourcePath, targetPath);
    Backendless.Files.moveFile(sourcePath, targetPath, async);

    resultObj = Backendless.Files.copyFile(sourcePath, targetPath);
    Backendless.Files.copyFile(sourcePath, targetPath, async);

    Backendless.Files.remove(fileURL);
    Backendless.Files.remove(fileURL, async);

    resultObj = Backendless.Files.exists(path);
    resultXHR = Backendless.Files.exists(path, async);

    Backendless.Files.removeDirectory(path);
    Backendless.Files.removeDirectory(path, async);

    resultObj = Backendless.Files.Permissions.grantUser(userid, url, permissionType);
    resultXHR = Backendless.Files.Permissions.grantUser(userid, url, permissionType, async);

    resultObj = Backendless.Files.Permissions.grantRole(roleName, url, permissionType);
    resultXHR = Backendless.Files.Permissions.grantRole(roleName, url, permissionType, async);

    resultObj = Backendless.Files.Permissions.denyUser(userid, url, permissionType);
    resultXHR = Backendless.Files.Permissions.denyUser(userid, url, permissionType, async);

    resultObj = Backendless.Files.Permissions.denyRole(roleName, url, permissionType);
    resultXHR = Backendless.Files.Permissions.denyRole(roleName, url, permissionType, async);
}

function testCommerce() {
    var packageName:string = 'str';
    var productId:string = 'str';
    var token:string = 'str';
    var subscriptionId:string = 'str';
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });

    var resultStr:string;
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    resultStr = Backendless.Commerce.restUrl;

    resultObj = Backendless.Commerce.validatePlayPurchase(packageName, productId, token);
    resultXHR = Backendless.Commerce.validatePlayPurchase(packageName, productId, token, async);

    resultObj = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token);
    resultXHR = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token, async);

    resultObj = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token);
    resultXHR = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token, async);
}

function testEvents() {
    var eventName:string = 'str';
    var eventArgs:Object = {};
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });

    var resultStr:string;
    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    resultStr = Backendless.Events.restUrl;

    resultObj = Backendless.Events.dispatch(eventName, eventArgs);
    resultXHR = Backendless.Events.dispatch(eventName, eventArgs, async);
}

function testCache() {
    var key:string = 'str';
    var value:any = [{}, 1, 2];
    var timeToLive:number = 123;
    var seconds:number = 123;
    var date:Date = new Date();
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });

    var resultObj:Object;
    var resultXHR:XMLHttpRequest;

    resultObj = Backendless.Cache.put(key, value);
    resultObj = Backendless.Cache.put(key, value, timeToLive);
    resultXHR = Backendless.Cache.put(key, value, async);
    resultXHR = Backendless.Cache.put(key, value, timeToLive, async);

    resultObj = Backendless.Cache.expireIn(key, seconds);
    resultXHR = Backendless.Cache.expireIn(key, seconds, async);
    resultObj = Backendless.Cache.expireIn(key, date);
    resultXHR = Backendless.Cache.expireIn(key, date, async);

    resultObj = Backendless.Cache.expireAt(key, seconds);
    resultXHR = Backendless.Cache.expireAt(key, seconds, async);
    resultObj = Backendless.Cache.expireAt(key, date);
    resultXHR = Backendless.Cache.expireAt(key, date, async);

    resultObj = Backendless.Cache.contains(key);
    resultXHR = Backendless.Cache.contains(key, async);

    resultObj = Backendless.Cache.get(key);
    resultXHR = Backendless.Cache.get(key, async);

    resultObj = Backendless.Cache.remove(key);
    resultXHR = Backendless.Cache.remove(key, async);
}

function testCounters() {
    var value:number = 123;
    var counterName:string = 'str';
    var expected:number = 123;
    var updated:number = 123;
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });

    var resultNum:number = 123;
    var resultXHR:XMLHttpRequest;

    resultNum = Backendless.Counters.get(counterName);
    resultXHR = Backendless.Counters.get(counterName, async);

    resultNum = Backendless.Counters.getAndIncrement(counterName);
    resultXHR = Backendless.Counters.getAndIncrement(counterName, async);

    resultNum = Backendless.Counters.incrementAndGet(counterName);
    resultXHR = Backendless.Counters.incrementAndGet(counterName, async);

    resultNum = Backendless.Counters.getAndDecrement(counterName);
    resultXHR = Backendless.Counters.getAndDecrement(counterName, async);

    resultNum = Backendless.Counters.decrementAndGet(counterName);
    resultXHR = Backendless.Counters.decrementAndGet(counterName, async);

    resultNum = Backendless.Counters.addAndGet(counterName, value);
    resultXHR = Backendless.Counters.addAndGet(counterName, value, async);

    resultNum = Backendless.Counters.getAndAdd(counterName, value);
    resultXHR = Backendless.Counters.getAndAdd(counterName, value, async);

    resultNum = Backendless.Counters.compareAndSet(counterName, expected, updated);
    resultXHR = Backendless.Counters.compareAndSet(counterName, expected, updated, async);

    resultNum = Backendless.Counters.reset(counterName);
    resultXHR = Backendless.Counters.reset(counterName, async);

    var atomicInstance:Backendless.AtomicInstance = Backendless.Counters.of(counterName);

    resultNum = atomicInstance.get();
    resultXHR = atomicInstance.get(async);

    resultNum = atomicInstance.getAndIncrement();
    resultXHR = atomicInstance.getAndIncrement(async);

    resultNum = atomicInstance.incrementAndGet();
    resultXHR = atomicInstance.incrementAndGet(async);

    resultNum = atomicInstance.getAndDecrement();
    resultXHR = atomicInstance.getAndDecrement(async);

    resultNum = atomicInstance.decrementAndGet();
    resultXHR = atomicInstance.decrementAndGet(async);

    resultNum = atomicInstance.addAndGet(value);
    resultXHR = atomicInstance.addAndGet(value, async);

    resultNum = atomicInstance.getAndAdd(value);
    resultXHR = atomicInstance.getAndAdd(value, async);

    resultNum = atomicInstance.compareAndSet(expected, updated);
    resultXHR = atomicInstance.compareAndSet(expected, updated, async);

    resultNum = atomicInstance.reset();
    resultXHR = atomicInstance.reset(async);
}

function testCustomServices() {
    var serviceName:string = 'str';
    var serviceVersion:string = 'str';
    var method:string = 'str';
    var parameters:Object = {};
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });

    var resultObj:Object = Backendless.CustomServices.invoke(serviceName, serviceVersion, method, parameters);
    var resultXHR:XMLHttpRequest = Backendless.CustomServices.invoke(serviceName, serviceVersion, method, parameters, async);
}

function testLogging() {
    var numOfMessagesValue:number = 123;
    var timeFrequencySecValue:number = 123;
    var loggerName:string = 'str';
    var logger:Backendless.Logger;
    var message:string = 'str';

    var restUrl:string = Backendless.Logging.restUrl;
    var loggers:Object = Backendless.Logging.loggers;
    var logInfo:Object[] = Backendless.Logging.logInfo;
    var messagesCount:number = Backendless.Logging.messagesCount;
    var numOfMessages:number = Backendless.Logging.numOfMessages;
    var timeFrequency:number = Backendless.Logging.timeFrequency;

    Backendless.Logging.setLogReportingPolicy(numOfMessagesValue, timeFrequencySecValue);

    logger = Backendless.Logging.getLogger(loggerName);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.fatal(message);
    logger.trace(message);
}
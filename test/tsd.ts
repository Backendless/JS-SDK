/// <reference path="../src/backendless.d.ts" />
/// <reference path="./es6-promise.d.ts" />

import Counter = __Backendless.Counter;
function testMain() {
    var VERSION:string = Backendless.VERSION;
    var applicationId:string = Backendless.applicationId;
    var secretKey:string = Backendless.secretKey;
    var serverURL:string = Backendless.serverURL;
    var appPath:string = Backendless.appPath;
    var APPLICATION_ID:string = 'my-application-id';
    var JS_SECRET_KEY:string = 'my-js-secret-key';

    Backendless.browser = {browser: 'string', version: 'string'};

    Backendless.initApp(APPLICATION_ID, JS_SECRET_KEY);

    Backendless.setUIState('state');
    Backendless.setUIState(null);
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
    var dataStore:Backendless.DataStore = Backendless.Persistence.of('str');
    var dataStore2:Backendless.DataStore = Backendless.Persistence.of({});
    var dataStore3:Backendless.DataStore = Backendless.Persistence.of(function () {
    });

    var model:Function|Object = dataStore.model;
    var className:string = dataStore.className;
    var restUrl:string = dataStore.restUrl;

    var dataQueryBuilder:Backendless.DataQueryBuilder = new Backendless.DataQueryBuilder.create();

    dataQueryBuilder.setWhereClause("objectId like '%00%'");

    var loadRelationsQueryBuilder:Backendless.LoadRelationsQueryBuilder = new Backendless.LoadRelationsQueryBuilder.create();
    var parentTableName:string = 'Test';

    var resultObj:Object;

    resultObj = dataStore.saveSync(item);
    dataStore.save(item).then().catch().then().then();

    resultObj = dataStore.removeSync('str');
    resultObj = dataStore.removeSync(item);
    dataStore.remove('str').then().catch().then().then();
    dataStore.remove(item).then().catch().then().then();

    resultObj = dataStore.findSync(dataQueryBuilder);
    resultObj = dataStore.findSync();
    dataStore.find(dataQueryBuilder).then().catch().then().then();
    dataStore.find().then().catch().then().then();

    resultObj = dataStore.findByIdSync('myId');
    dataStore.findById('myId').then().catch().then().then();

    resultObj = dataStore.findFirstSync();
    dataStore.findFirst().then().catch().then().then();

    resultObj = dataStore.findLastSync();
    dataStore.findLast().then().catch().then().then();

    dataStore.loadRelationsSync(parentTableName, loadRelationsQueryBuilder);
    dataStore.loadRelations(parentTableName, loadRelationsQueryBuilder).then().catch().then().then();
}

function testPersistence() {
    var resultObj:Object;
    var dataStore:Backendless.DataStore = Backendless.Persistence.of('str');
    var Model:Function;

    resultObj = Backendless.Persistence.saveSync('model', {});
    resultObj = Backendless.Persistence.saveSync(dataStore, {});
    Backendless.Persistence.save('model', {}).then().catch().then().then();
    Backendless.Persistence.save(dataStore, {}).then().catch().then().then();

    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause', 123);
    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause');
    resultObj = Backendless.Persistence.getViewSync('viewName');
    Backendless.Persistence.getView('viewName', 'whereClause', 123, 123).then().catch().then().then();
    Backendless.Persistence.getView('viewName', 'whereClause', 123).then().catch().then().then();
    Backendless.Persistence.getView('viewName', 'whereClause').then().catch().then().then();
    Backendless.Persistence.getView('viewName').then().catch().then().then();

    resultObj = Backendless.Persistence.callStoredProcedureSync('spName', 'argumentValues');
    resultObj = Backendless.Persistence.callStoredProcedureSync('spName', {});
    Backendless.Persistence.callStoredProcedure('spName', 'argumentValues').then().catch().then().then();
    Backendless.Persistence.callStoredProcedure('spName', {}).then().catch().then().then();

    dataStore = Backendless.Persistence.of(Model);
    dataStore = Backendless.Persistence.of('str');
    dataStore = Backendless.Persistence.of({});

    resultObj = Backendless.Persistence.describeSync(Model);
    resultObj = Backendless.Persistence.describeSync('str');
    resultObj = Backendless.Persistence.describeSync({});
    Backendless.Persistence.describe(Model).then().catch().then().then();
    Backendless.Persistence.describe('str').then().catch().then().then();
    Backendless.Persistence.describe({}).then().catch().then().then();
}

function testData() {
    var resultObj:Object;
    var dataStore:Backendless.DataStore = Backendless.Persistence.of('str');
    var Model:Function;

    resultObj = Backendless.Data.saveSync('model', {});
    resultObj = Backendless.Data.saveSync(dataStore, {});
    Backendless.Data.save('model', {}).then().catch().then().then();
    Backendless.Data.save(dataStore, {}).then().catch().then().then();

    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause', 123);
    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause');
    resultObj = Backendless.Data.getViewSync('viewName');
    Backendless.Data.getView('viewName', 'whereClause', 123, 123).then().catch().then().then();
    Backendless.Data.getView('viewName', 'whereClause', 123).then().catch().then().then();
    Backendless.Data.getView('viewName', 'whereClause').then().catch().then().then();
    Backendless.Data.getView('viewName').then().catch().then().then();

    resultObj = Backendless.Data.callStoredProcedureSync('spName', 'argumentValues');
    resultObj = Backendless.Data.callStoredProcedureSync('spName', {});
    Backendless.Data.callStoredProcedure('spName', 'argumentValues').then().catch().then().then();
    Backendless.Data.callStoredProcedure('spName', {}).then().catch().then().then();

    dataStore = Backendless.Data.of(Model);
    dataStore = Backendless.Data.of('str');
    dataStore = Backendless.Data.of({});

    resultObj = Backendless.Data.describeSync(Model);
    resultObj = Backendless.Data.describeSync('str');
    resultObj = Backendless.Data.describeSync({});
    Backendless.Data.describe(Model).then().catch().then().then();
    Backendless.Data.describe('str').then().catch().then().then();
    Backendless.Data.describe({}).then().catch().then().then();
}

function testDataPermissions() {
    var userId:string = 'userId';
    var roleName:string = 'myRole';
    var dataObj:Backendless.ExistDataItemI = {___class: 'myClass', objectId: 'myId'};
    var resultObj:Backendless.ExistDataItemI;

    resultObj = Backendless.Data.Permissions.FIND.grantUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.FIND.grantRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.FIND.grantSync(dataObj);
    resultObj = Backendless.Data.Permissions.FIND.denyUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.FIND.denyRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.FIND.denySync(dataObj);

    resultObj = Backendless.Data.Permissions.REMOVE.grantUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.REMOVE.grantRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.REMOVE.grantSync(dataObj);
    resultObj = Backendless.Data.Permissions.REMOVE.denyUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.REMOVE.denyRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.REMOVE.denySync(dataObj);

    resultObj = Backendless.Data.Permissions.UPDATE.grantUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.UPDATE.grantRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.UPDATE.grantSync(dataObj);
    resultObj = Backendless.Data.Permissions.UPDATE.denyUserSync(userId, dataObj);
    resultObj = Backendless.Data.Permissions.UPDATE.denyRoleSync(roleName, dataObj);
    resultObj = Backendless.Data.Permissions.UPDATE.denySync(dataObj);

    Backendless.Data.Permissions.FIND.grantUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.FIND.grantRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.FIND.grant(dataObj).then().catch().then().then();
    Backendless.Data.Permissions.FIND.denyUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.FIND.denyRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.FIND.deny(dataObj).then().catch().then().then();

    Backendless.Data.Permissions.REMOVE.grantUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.REMOVE.grantRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.REMOVE.grant(dataObj).then().catch().then().then();
    Backendless.Data.Permissions.REMOVE.denyUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.REMOVE.denyRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.REMOVE.deny(dataObj).then().catch().then().then();

    Backendless.Data.Permissions.UPDATE.grantUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.UPDATE.grantRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.UPDATE.grant(dataObj).then().catch().then().then();
    Backendless.Data.Permissions.UPDATE.denyUser(userId, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.UPDATE.denyRole(roleName, dataObj).then().catch().then().then();
    Backendless.Data.Permissions.UPDATE.deny(dataObj).then().catch().then().then();

}

function testUser() {
    var newUser = new Backendless.User();

    var className:string = newUser.___class;
}

function testUserService() {
    var userName:string = 'userName';
    var identity:string = 'identity';
    var roleName:string = 'rolename';
    var password:string = 'password';
    var div:HTMLElement = document.createElement('div');
    var bol:boolean = true;
    var newUser:Backendless.User = new Backendless.User();
    var resultObj:Object;

    var restUrl:string = Backendless.UserService.restUrl;
    var loggedInUser:boolean = Backendless.UserService.loggedInUser();

    resultObj = Backendless.UserService.restorePasswordSync('email');
    Backendless.UserService.restorePassword('email').then().catch().then().then();

    newUser = Backendless.UserService.registerSync(newUser);
    Backendless.UserService.register(newUser).then().catch().then().then();

    newUser = Backendless.UserService.getUserRolesSync();
    Backendless.UserService.getUserRoles().then().catch().then().then();

    newUser = Backendless.UserService.assignRoleSync(identity, roleName);
    Backendless.UserService.assignRole(identity, roleName).then().catch().then().then();

    newUser = Backendless.UserService.unassignRoleSync(identity, roleName);
    Backendless.UserService.unassignRole(identity, roleName).then().catch().then().then();

    newUser = Backendless.UserService.loginSync(userName, password);
    newUser = Backendless.UserService.loginSync(userName, password, bol);
    Backendless.UserService.login(userName, password).then().catch().then().then();
    Backendless.UserService.login(userName, password, bol).then().catch().then().then();

    newUser = Backendless.UserService.describeUserClassSync();
    Backendless.UserService.describeUserClass().then().catch().then().then();

    Backendless.UserService.logoutSync();
    Backendless.UserService.logout().then().catch().then().then();

    newUser = Backendless.UserService.getCurrentUserSync();
    Backendless.UserService.getCurrentUser().then().catch().then().then();

    newUser = Backendless.UserService.updateSync(newUser);
    Backendless.UserService.update(newUser).then().catch().then().then();

    Backendless.UserService.loginWithFacebookSync();
    Backendless.UserService.loginWithFacebookSync({});
    Backendless.UserService.loginWithFacebookSync({}, {});
    Backendless.UserService.loginWithFacebookSync({}, {}, true);
    Backendless.UserService.loginWithFacebookSync({}, null, true);
    Backendless.UserService.loginWithFacebookSync(null, null, true);
    Backendless.UserService.loginWithFacebook().then().catch().then().then();
    Backendless.UserService.loginWithFacebook({}).then().catch().then().then();
    Backendless.UserService.loginWithFacebook({}, {}).then().catch().then().then();
    Backendless.UserService.loginWithFacebook({}, {}, true).then().catch().then().then();
    Backendless.UserService.loginWithFacebook({}, null, true).then().catch().then().then();
    Backendless.UserService.loginWithFacebook(null, null, true).then().catch().then().then();

    Backendless.UserService.loginWithGooglePlusSync();
    Backendless.UserService.loginWithGooglePlusSync({});
    Backendless.UserService.loginWithGooglePlusSync({}, {});
    Backendless.UserService.loginWithGooglePlusSync({}, {}, document.createElement('div'));
    Backendless.UserService.loginWithGooglePlusSync({}, {}, document.createElement('div'), true);
    Backendless.UserService.loginWithGooglePlusSync({}, {}, null, true);
    Backendless.UserService.loginWithGooglePlusSync({}, null, null, true);
    Backendless.UserService.loginWithGooglePlusSync(null, null, null, true);
    Backendless.UserService.loginWithGooglePlus().then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}, {}).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div')).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div'), true).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}, {}, null, true).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus({}, null, null, true).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlus(null, null, null, true).then().catch().then().then();

    Backendless.UserService.loginWithTwitterSync();
    Backendless.UserService.loginWithTwitterSync({});
    Backendless.UserService.loginWithTwitterSync({}, true);
    Backendless.UserService.loginWithTwitterSync(null, true);
    Backendless.UserService.loginWithTwitter().then().catch().then().then();
    Backendless.UserService.loginWithTwitter({}).then().catch().then().then();
    Backendless.UserService.loginWithTwitter({}, true).then().catch().then().then();
    Backendless.UserService.loginWithTwitter(null, true).then().catch().then().then();

    Backendless.UserService.loginWithFacebookSdkSync();
    Backendless.UserService.loginWithFacebookSdkSync({});
    Backendless.UserService.loginWithFacebookSdkSync({}, true);
    Backendless.UserService.loginWithFacebookSdk().then().catch().then().then();
    Backendless.UserService.loginWithFacebookSdk({}).then().catch().then().then();
    Backendless.UserService.loginWithFacebookSdk({}, true).then().catch().then().then();

    Backendless.UserService.loginWithGooglePlusSdkSync();
    Backendless.UserService.loginWithGooglePlusSdkSync({});
    Backendless.UserService.loginWithGooglePlusSdkSync({}, true);
    Backendless.UserService.loginWithGooglePlusSdk().then().catch().then().then();
    Backendless.UserService.loginWithGooglePlusSdk({}).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlusSdk({}, true).then().catch().then().then();

    bol = Backendless.UserService.isValidLoginSync();
    Backendless.UserService.isValidLogin().then().catch().then().then();

    Backendless.UserService.resendEmailConfirmationSync('email');
    Backendless.UserService.resendEmailConfirmation('email').then().catch().then().then();

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
    var geoCollectionResult:Array<Object>;
    var geoCategory:Backendless.GeoCategoryI;
    var geoCategories:Backendless.GeoCategoryI[];
    var resultObj:Object;

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

    existPoint = Backendless.Geo.savePointSync(newGeoPoint);
    Backendless.Geo.savePoint(newGeoPoint).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.findSync(baseGeoQuery);
    Backendless.Geo.find(baseGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.findSync(rectangleGeoQuery);
    Backendless.Geo.find(rectangleGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.findSync(circleGeoQuery);
    Backendless.Geo.find(circleGeoQuery).then().catch().then().then();

    errorStr = Backendless.Geo.deletePointSync(categoryName);
    errorStr = Backendless.Geo.deletePointSync(existPoint);
    Backendless.Geo.deletePoint(categoryName).then().catch().then().then();
    Backendless.Geo.deletePoint(existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.loadMetadataSync(existPoint);
    resultObj = Backendless.Geo.loadMetadataSync(geoClaster);
    Backendless.Geo.loadMetadata(existPoint).then().catch().then().then();
    Backendless.Geo.loadMetadata(geoClaster).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.getClusterPointsSync(geoClaster);
    Backendless.Geo.getClusterPoints(geoClaster).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.getFencePointsSync(fenceName, baseGeoQuery);
    Backendless.Geo.getFencePoints(fenceName, baseGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.relativeFindSync(baseGeoQuery);
    Backendless.Geo.relativeFind(baseGeoQuery).then().catch().then().then();

    geoCategory = Backendless.Geo.addCategorySync(categoryName);
    Backendless.Geo.addCategory(categoryName).then().catch().then().then();

    bool = Backendless.Geo.deleteCategorySync(categoryName);
    Backendless.Geo.deleteCategory(categoryName).then().catch().then().then();

    geoCategories = Backendless.Geo.getCategoriesSync();
    Backendless.Geo.getCategories().then().catch().then().then();

    resultObj = Backendless.Geo.runOnStayActionSync(fenceName, existPoint);
    Backendless.Geo.runOnStayAction(fenceName, existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.runOnExitActionSync(fenceName, existPoint);
    Backendless.Geo.runOnExitAction(fenceName, existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.runOnEnterActionSync(fenceName, existPoint);
    Backendless.Geo.runOnEnterAction(fenceName, existPoint).then().catch().then().then();

    Backendless.Geo.startGeofenceMonitoringWithInAppCallbackSync(fenceName, inAppCallback);
    Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback).then().catch().then().then();

    Backendless.Geo.startGeofenceMonitoringWithRemoteCallbackSync(fenceName, existPoint);
    Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint).then().catch().then().then();

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

    subscription = Backendless.Messaging.subscribeSync(channelName, subscriptionCallback, subscriptionOptions);
    Backendless.Messaging.subscribe(channelName, subscriptionCallback, subscriptionOptions).then().catch().then().then();

    resultObj = Backendless.Messaging.publishSync(channelName, message, publishOptions, deliveryOptions);
    Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions).then().catch().then().then();

    resultObj = Backendless.Messaging.sendEmailSync(subject, bodyParts, recipients, attachments);
    Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments).then().catch().then().then();

    resultBool = Backendless.Messaging.cancelSync(messageId);
    Backendless.Messaging.cancel(messageId).then().catch().then().then();

    resultObj = Backendless.Messaging.registerDeviceSync(channels, expiration);
    Backendless.Messaging.registerDevice(channels, expiration).then().catch().then().then();

    resultObj = Backendless.Messaging.getRegistrationsSync();
    Backendless.Messaging.getRegistrations().then().catch().then().then();

    resultObj = Backendless.Messaging.unregisterDeviceSync();
    Backendless.Messaging.unregisterDevice().then().catch().then().then();

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

    resultStr = Backendless.Files.restUrl;
    resultStr = Backendless.Files.Permissions.restUrl;

    resultBool = Backendless.Files.saveFileSync(path, fileName, fileContent, overwrite);
    resultBool = Backendless.Files.saveFileSync(path, fileName, fileContent);

    Backendless.Files.saveFile(path, fileName, fileContent, overwrite).then().catch().then().then();
    Backendless.Files.saveFile(path, fileName, fileContent).then().catch().then().then();

    Backendless.Files.uploadSync(file, path, overwrite);
    Backendless.Files.uploadSync(files, path, overwrite);
    Backendless.Files.uploadSync(file, path, null);
    Backendless.Files.uploadSync(files, path, null);

    Backendless.Files.upload(file, path, overwrite).then().catch().then().then();
    Backendless.Files.upload(files, path, overwrite).then().catch().then().then();
    Backendless.Files.upload(file, path, null).then().catch().then().then();
    Backendless.Files.upload(files, path, null).then().catch().then().then();

    resultObj = Backendless.Files.listingSync(path);
    resultObj = Backendless.Files.listingSync(path, pattern);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively, pageSize);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively, pageSize, offset);

    Backendless.Files.listing(path).then().catch().then().then();
    Backendless.Files.listing(path, pattern).then().catch().then().then();
    Backendless.Files.listing(path, pattern, recursively).then().catch().then().then();
    Backendless.Files.listing(path, pattern, recursively, pageSize).then().catch().then().then();
    Backendless.Files.listing(path, pattern, recursively, pageSize, offset).then().catch().then().then();

    resultObj = Backendless.Files.renameFileSync(oldPathName, newName);
    Backendless.Files.renameFile(oldPathName, newName).then().catch().then().then();

    resultObj = Backendless.Files.moveFileSync(sourcePath, targetPath);
    Backendless.Files.moveFile(sourcePath, targetPath).then().catch().then().then();

    resultObj = Backendless.Files.copyFileSync(sourcePath, targetPath);
    Backendless.Files.copyFile(sourcePath, targetPath).then().catch().then().then();

    Backendless.Files.removeSync(fileURL);
    Backendless.Files.remove(fileURL).then().catch().then().then();

    resultObj = Backendless.Files.existsSync(path);
    Backendless.Files.exists(path).then().catch().then().then();

    Backendless.Files.removeDirectorySync(path);
    Backendless.Files.removeDirectory(path).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.grantUserSync(userid, url, permissionType);
    Backendless.Files.Permissions.grantUser(userid, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.grantRoleSync(roleName, url, permissionType);
    Backendless.Files.Permissions.grantRole(roleName, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.denyUserSync(userid, url, permissionType);
    Backendless.Files.Permissions.denyUser(userid, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.denyRoleSync(roleName, url, permissionType);
    Backendless.Files.Permissions.denyRole(roleName, url, permissionType).then().catch().then().then();
}

function testCommerce() {
    var packageName:string = 'str';
    var productId:string = 'str';
    var token:string = 'str';
    var subscriptionId:string = 'str';

    var resultStr:string;
    var resultObj:Object;

    resultStr = Backendless.Commerce.restUrl;

    resultObj = Backendless.Commerce.validatePlayPurchaseSync(packageName, productId, token);
    Backendless.Commerce.validatePlayPurchase(packageName, productId, token).then().catch().then().then();

    resultObj = Backendless.Commerce.cancelPlaySubscriptionSync(packageName, subscriptionId, token);
    Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token).then().catch().then().then();

    resultObj = Backendless.Commerce.getPlaySubscriptionStatusSync(packageName, subscriptionId, token);
    Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token).then().catch().then().then();
}

function testEvents() {
    var eventName:string = 'str';
    var eventArgs:Object = {};

    var resultStr:string;
    var resultObj:Object;

    resultStr = Backendless.Events.restUrl;

    resultObj = Backendless.Events.dispatchSync(eventName, eventArgs);
    Backendless.Events.dispatch(eventName, eventArgs).then().catch().then().then();
}

function testCache() {
    var key:string = 'str';
    var value:any = [{}, 1, 2];
    var timeToLive:number = 123;
    var seconds:number = 123;
    var date:Date = new Date();

    var resultObj:Object;

    resultObj = Backendless.Cache.putSync(key, value);
    resultObj = Backendless.Cache.putSync(key, value, timeToLive);
    Backendless.Cache.put(key, value).then().catch().then().then();
    Backendless.Cache.put(key, value, timeToLive).then().catch().then().then();

    resultObj = Backendless.Cache.expireInSync(key, seconds);
    resultObj = Backendless.Cache.expireInSync(key, date);
    Backendless.Cache.expireIn(key, seconds).then().catch().then().then();
    Backendless.Cache.expireIn(key, date).then().catch().then().then();

    resultObj = Backendless.Cache.expireAtSync(key, seconds);
    resultObj = Backendless.Cache.expireAtSync(key, date);
    Backendless.Cache.expireAt(key, seconds).then().catch().then().then();
    Backendless.Cache.expireAt(key, date).then().catch().then().then();

    resultObj = Backendless.Cache.containsSync(key);
    Backendless.Cache.contains(key).then().catch().then().then();

    resultObj = Backendless.Cache.getSync(key);
    Backendless.Cache.get(key).then().catch().then().then();

    resultObj = Backendless.Cache.removeSync(key);
    Backendless.Cache.remove(key).then().catch().then().then();
}

function testCounters() {
    var value:number = 123;
    var counterName:string = 'str';
    var expected:number = 123;
    var updated:number = 123;
 
    //'implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet'
    var resultNum:number = 123;

    resultNum = Backendless.Counters.getSync(counterName);
    Backendless.Counters.get(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.getAndIncrementSync(counterName);
    Backendless.Counters.getAndIncrement(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.incrementAndGetSync(counterName);
    Backendless.Counters.incrementAndGet(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.getAndDecrementSync(counterName);
    Backendless.Counters.getAndDecrement(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.decrementAndGetSync(counterName);
    Backendless.Counters.decrementAndGet(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.addAndGetSync(counterName, value);
    Backendless.Counters.addAndGet(counterName, value).then().catch().then().then();

    resultNum = Backendless.Counters.getAndAddSync(counterName, value);
    Backendless.Counters.getAndAdd(counterName, value).then().catch().then().then();

    resultNum = Backendless.Counters.compareAndSetSync(counterName, expected, updated);
    Backendless.Counters.compareAndSet(counterName, expected, updated).then().catch().then().then();

    resultNum = Backendless.Counters.resetSync(counterName);
    Backendless.Counters.reset(counterName).then().catch().then().then();

    var counter:Counter = Backendless.Counters.of(counterName);

    resultNum = counter.getSync();
    counter.get().then().catch().then().then();

    resultNum = counter.getAndIncrementSync();
    counter.getAndIncrement().then().catch().then().then();

    resultNum = counter.incrementAndGetSync();
    counter.incrementAndGet().then().catch().then().then();

    resultNum = counter.getAndDecrementSync();
    counter.getAndDecrement().then().catch().then().then();

    resultNum = counter.decrementAndGetSync();
    counter.decrementAndGet().then().catch().then().then();

    resultNum = counter.addAndGetSync(value);
    counter.addAndGet(value).then().catch().then().then();

    resultNum = counter.getAndAddSync(value);
    counter.getAndAdd(value).then().catch().then().then();

    resultNum = counter.compareAndSetSync(expected, updated);
    counter.compareAndSet(expected, updated).then().catch().then().then();

    resultNum = counter.resetSync();
    counter.reset().then().catch().then().then();
}

function testCustomServices() {
    var serviceName:string = 'str';
    var serviceVersion:string = 'str';
    var method:string = 'str';
    var parameters:Object = {};

    var resultObj:Object = Backendless.CustomServices.invokeSync(serviceName, serviceVersion, method, parameters);
    Backendless.CustomServices.invoke(serviceName, serviceVersion, method, parameters).then().catch().then().then();
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
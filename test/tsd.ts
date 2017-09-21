/// <reference path="../src/backendless.d.ts" />
/// <reference path="./es6-promise.d.ts" />

import Counter = __Backendless.Counter;

function testMain() {
    var applicationId: string = Backendless.applicationId;
    var secretKey: string = Backendless.secretKey;
    var serverURL: string = Backendless.serverURL;
    var appPath: string = Backendless.appPath;
    var browser: { browser: string, version: string } = Backendless.browser;

    Backendless.initApp('APPLICATION_ID', 'JS_SECRET_KEY');

    Backendless.setUIState('state');
    Backendless.setUIState(null);
}

function testLocalCache() {
    var key: string = 'key';
    var str: string = 'string';
    var obj: Object = {};
    var arr: any[] = [];
    var num: number = 1234;
    var bol: boolean = true;
    var nul: any = null;

    var result: boolean = Backendless.LocalCache.enabled;
    var result1: boolean = Backendless.LocalCache.exists(key);
    var result2: boolean = Backendless.LocalCache.set(key);
    var result3: Object = Backendless.LocalCache.set(key, obj);
    var result4: any[] = Backendless.LocalCache.set(key, arr);
    var result5: number = Backendless.LocalCache.set(key, num);
    var result6: string = Backendless.LocalCache.set(key, str);
    var result7: any = Backendless.LocalCache.set(key, nul);
    var result8: boolean = Backendless.LocalCache.set(key, bol);
    var result9: any = Backendless.LocalCache.get(key);
    var result11: boolean = Backendless.LocalCache.remove(key);
    var result12: Object = Backendless.LocalCache.getAll();
    var result13: Object = Backendless.LocalCache.getCachePolicy(key);
    var result14: string = Backendless.LocalCache.serialize(obj);
    var result15: string = Backendless.LocalCache.serialize(arr);
    var result16: string = Backendless.LocalCache.serialize(num);
    var result17: string = Backendless.LocalCache.serialize(str);
    var result18: string = Backendless.LocalCache.serialize(bol);
    var result19: any = Backendless.LocalCache.deserialize(key);

    Backendless.LocalCache.clear(key);
    Backendless.LocalCache.flushExpired();
}

function testDataQueryClass() {
    var dataQuery: Backendless.DataQuery = new Backendless.DataQuery();
    var properties: string[] = dataQuery.properties;
    var condition: string = dataQuery.condition;
    var options: Object = dataQuery.options;
    var url: string = dataQuery.url;
    var str: string = 'str';

    dataQuery.addProperty(str);
}

function testDataStoreClass() {
    var item: Object = {};
    var dataStore: Backendless.DataStore = Backendless.Persistence.of('str');
    var dataStore2: Backendless.DataStore = Backendless.Persistence.of({});
    var dataStore3: Backendless.DataStore = Backendless.Persistence.of(function () {
    });

    var model: Function | Object = dataStore.model;
    var className: string = dataStore.className;
    var restUrl: string = dataStore.restUrl;

    var dataQueryBuilder: Backendless.DataQueryBuilder = Backendless.DataQueryBuilder.create();

    dataQueryBuilder.setWhereClause("objectId like '%00%'");

    var loadRelationsQueryBuilder: Backendless.LoadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();
    var parentTableName: string = 'Test';

    var resultObj: Object;
    var resultNum: number;
    var promiseObject: Promise<Object>;
    var promiseNum: Promise<number>;


    resultObj = dataStore.saveSync(item);
    promiseObject = dataStore.save(item);

    resultObj = dataStore.removeSync('str');
    resultObj = dataStore.removeSync(item);
    promiseObject = dataStore.remove('str');
    promiseObject = dataStore.remove(item);

    resultObj = dataStore.findSync(dataQueryBuilder);
    resultObj = dataStore.findSync();
    promiseObject = dataStore.find(dataQueryBuilder);
    promiseObject = dataStore.find();

    resultObj = dataStore.findByIdSync('myId');
    promiseObject = dataStore.findById('myId');

    resultObj = dataStore.findFirstSync();
    promiseObject = dataStore.findFirst();

    resultObj = dataStore.findLastSync();
    promiseObject = dataStore.findLast();

    dataStore.loadRelationsSync(parentTableName, loadRelationsQueryBuilder);
    promiseObject = dataStore.loadRelations(parentTableName, loadRelationsQueryBuilder);

    resultNum = dataStore.getObjectCountSync();
    resultNum = dataStore.getObjectCountSync(dataQueryBuilder);
    promiseNum = dataStore.getObjectCount();
    promiseNum = dataStore.getObjectCount(dataQueryBuilder);

}

function testPersistence() {
    var resultObj: Object;
    var dataStore: Backendless.DataStore = Backendless.Persistence.of('str');
    var Model: Function;
    var promiseObject: Promise<Object>;

    resultObj = Backendless.Persistence.saveSync('model', {});
    resultObj = Backendless.Persistence.saveSync(dataStore, {});
    promiseObject = Backendless.Persistence.save('model', {});
    promiseObject = Backendless.Persistence.save(dataStore, {});

    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause', 123);
    resultObj = Backendless.Persistence.getViewSync('viewName', 'whereClause');
    resultObj = Backendless.Persistence.getViewSync('viewName');
    promiseObject = Backendless.Persistence.getView('viewName', 'whereClause', 123, 123);
    promiseObject = Backendless.Persistence.getView('viewName', 'whereClause', 123);
    promiseObject = Backendless.Persistence.getView('viewName', 'whereClause');
    promiseObject = Backendless.Persistence.getView('viewName');

    resultObj = Backendless.Persistence.callStoredProcedureSync('spName', 'argumentValues');
    resultObj = Backendless.Persistence.callStoredProcedureSync('spName', {});
    promiseObject = Backendless.Persistence.callStoredProcedure('spName', 'argumentValues');
    promiseObject = Backendless.Persistence.callStoredProcedure('spName', {});

    dataStore = Backendless.Persistence.of(Model);
    dataStore = Backendless.Persistence.of('str');
    dataStore = Backendless.Persistence.of({});

    resultObj = Backendless.Persistence.describeSync(Model);
    resultObj = Backendless.Persistence.describeSync('str');
    resultObj = Backendless.Persistence.describeSync({});
    promiseObject = Backendless.Persistence.describe(Model);
    promiseObject = Backendless.Persistence.describe('str');
    promiseObject = Backendless.Persistence.describe({});
}

function testData() {
    var resultObj: Object;
    var dataStore: Backendless.DataStore = Backendless.Persistence.of('str');
    var Model: Function;
    var promiseObject: Promise<Object>;

    resultObj = Backendless.Data.saveSync('model', {});
    resultObj = Backendless.Data.saveSync(dataStore, {});
    promiseObject = Backendless.Data.save('model', {});
    promiseObject = Backendless.Data.save(dataStore, {});

    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause', 123, 123);
    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause', 123);
    resultObj = Backendless.Data.getViewSync('viewName', 'whereClause');
    resultObj = Backendless.Data.getViewSync('viewName');
    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123, 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause');
    promiseObject = Backendless.Data.getView('viewName');

    resultObj = Backendless.Data.callStoredProcedureSync('spName', 'argumentValues');
    resultObj = Backendless.Data.callStoredProcedureSync('spName', {});
    promiseObject = Backendless.Data.callStoredProcedure('spName', 'argumentValues');
    promiseObject = Backendless.Data.callStoredProcedure('spName', {});

    dataStore = Backendless.Data.of(Model);
    dataStore = Backendless.Data.of('str');
    dataStore = Backendless.Data.of({});

    resultObj = Backendless.Data.describeSync(Model);
    resultObj = Backendless.Data.describeSync('str');
    resultObj = Backendless.Data.describeSync({});
    promiseObject = Backendless.Data.describe(Model);
    promiseObject = Backendless.Data.describe('str');
    promiseObject = Backendless.Data.describe({});
}

function testDataPermissions() {
    var userId: string = 'userId';
    var roleName: string = 'myRole';
    var dataObj: Backendless.ExistDataItemI = {___class: 'myClass', objectId: 'myId'};
    var resultObj: Backendless.ExistDataItemI;
    var promiseObject: Promise<Object>;

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

    promiseObject = Backendless.Data.Permissions.FIND.grantUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.grantRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.grant(dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.deny(dataObj);

    promiseObject = Backendless.Data.Permissions.REMOVE.grantUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.grantRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.grant(dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.deny(dataObj);

    promiseObject = Backendless.Data.Permissions.UPDATE.grantUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.grantRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.grant(dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.deny(dataObj);

}

function testUser() {
    var newUser = new Backendless.User();

    var className: string = newUser.___class;
}

function testUserService() {
    var userName: string = 'userName';
    var identity: string = 'identity';
    var roleName: string = 'rolename';
    var password: string = 'password';
    var div: HTMLElement = document.createElement('div');
    var bol: boolean = true;
    var newUser: Backendless.User = new Backendless.User();
    var resultObj: Object;
    var promiseObject: Promise<Object>;
    var promiseVoid: Promise<void>;

    var restUrl: string = Backendless.UserService.restUrl;
    var loggedInUser: boolean = Backendless.UserService.loggedInUser();

    resultObj = Backendless.UserService.restorePasswordSync('email');
    promiseObject = Backendless.UserService.restorePassword('email');

    newUser = Backendless.UserService.registerSync(newUser);
    promiseObject = Backendless.UserService.register(newUser);

    newUser = Backendless.UserService.getUserRolesSync();
    promiseObject = Backendless.UserService.getUserRoles();

    newUser = Backendless.UserService.assignRoleSync(identity, roleName);
    promiseObject = Backendless.UserService.assignRole(identity, roleName);

    newUser = Backendless.UserService.unassignRoleSync(identity, roleName);
    promiseObject = Backendless.UserService.unassignRole(identity, roleName);

    newUser = Backendless.UserService.loginSync(userName, password);
    newUser = Backendless.UserService.loginSync(userName, password, bol);
    promiseObject = Backendless.UserService.login(userName, password);
    promiseObject = Backendless.UserService.login(userName, password, bol);

    newUser = Backendless.UserService.describeUserClassSync();
    promiseObject = Backendless.UserService.describeUserClass();

    Backendless.UserService.logoutSync();
    promiseVoid = Backendless.UserService.logout();

    newUser = Backendless.UserService.getCurrentUserSync();
    promiseObject = Backendless.UserService.getCurrentUser();

    newUser = Backendless.UserService.updateSync(newUser);
    promiseObject = Backendless.UserService.update(newUser);

    Backendless.UserService.loginWithFacebookSync();
    Backendless.UserService.loginWithFacebookSync({});
    Backendless.UserService.loginWithFacebookSync({}, {});
    Backendless.UserService.loginWithFacebookSync({}, {}, true);
    Backendless.UserService.loginWithFacebookSync({}, null, true);
    Backendless.UserService.loginWithFacebookSync(null, null, true);
    promiseVoid = Backendless.UserService.loginWithFacebook();
    promiseVoid = Backendless.UserService.loginWithFacebook({});
    promiseVoid = Backendless.UserService.loginWithFacebook({}, {});
    promiseVoid = Backendless.UserService.loginWithFacebook({}, {}, true);
    promiseVoid = Backendless.UserService.loginWithFacebook({}, null, true);
    promiseVoid = Backendless.UserService.loginWithFacebook(null, null, true);

    Backendless.UserService.loginWithGooglePlusSync();
    Backendless.UserService.loginWithGooglePlusSync({});
    Backendless.UserService.loginWithGooglePlusSync({}, {});
    Backendless.UserService.loginWithGooglePlusSync({}, {}, document.createElement('div'));
    Backendless.UserService.loginWithGooglePlusSync({}, {}, document.createElement('div'), true);
    Backendless.UserService.loginWithGooglePlusSync({}, {}, null, true);
    Backendless.UserService.loginWithGooglePlusSync({}, null, null, true);
    Backendless.UserService.loginWithGooglePlusSync(null, null, null, true);
    promiseVoid = Backendless.UserService.loginWithGooglePlus();
    promiseVoid = Backendless.UserService.loginWithGooglePlus({});
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {});
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div'));
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div'), true);
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, null, true);
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, null, null, true);
    promiseVoid = Backendless.UserService.loginWithGooglePlus(null, null, null, true);

    Backendless.UserService.loginWithTwitterSync();
    Backendless.UserService.loginWithTwitterSync({});
    Backendless.UserService.loginWithTwitterSync({}, true);
    Backendless.UserService.loginWithTwitterSync(null, true);
    promiseVoid = Backendless.UserService.loginWithTwitter();
    promiseVoid = Backendless.UserService.loginWithTwitter({});
    promiseVoid = Backendless.UserService.loginWithTwitter({}, true);
    promiseVoid = Backendless.UserService.loginWithTwitter(null, true);

    promiseVoid = Backendless.UserService.loginWithFacebookSdk();
    promiseVoid = Backendless.UserService.loginWithFacebookSdk({});
    promiseVoid = Backendless.UserService.loginWithFacebookSdk({}, true);

    promiseVoid = Backendless.UserService.loginWithGooglePlusSdk();
    promiseVoid = Backendless.UserService.loginWithGooglePlusSdk({});
    promiseVoid = Backendless.UserService.loginWithGooglePlusSdk({}, true);

    bol = Backendless.UserService.isValidLoginSync();
    promiseObject = Backendless.UserService.isValidLogin();

    Backendless.UserService.resendEmailConfirmationSync('email');
    promiseVoid = Backendless.UserService.resendEmailConfirmation('email');

}

function testGoeService() {
    var newGeoPoint: Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;
    newGeoPoint.categories = ["c"];
    newGeoPoint.metadata = {"owner": "XXX"};

    var existPoint: Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.___class = 'c';
    newGeoPoint.objectId = 'id';
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;

    var geoClaster: Backendless.GeoCluster = new Backendless.GeoCluster();

    geoClaster.___class = 'geo';
    geoClaster.objectId = 'id';
    geoClaster.latitude = 20;
    geoClaster.longitude = 30;
    geoClaster.totalPoints = 10;
    geoClaster.geoQuery = new Backendless.GeoQuery();

    var bool: boolean = true;
    var errorStr: string = 'str';
    var fenceName: string = 'str';
    var categoryName: string = 'str';
    var restUrl: string = Backendless.Geo.restUrl;
    var EARTH_RADIUS: number = Backendless.Geo.EARTH_RADIUS;
    var geoCollectionResult: Array<Object>;
    var geoCategory: Backendless.GeoCategoryI;
    var geoCategories: Backendless.GeoCategoryI[];
    var resultObj: Object;

    var baseGeoQuery: Backendless.GeoQueryI = new Backendless.GeoQuery();
    var rectangleGeoQuery: Backendless.RectangleGeoQueryI = {searchRectangle: [1, 2, 3, 4]};
    var circleGeoQuery: Backendless.CircleGeoQueryI = {latitude: 1, longitude: 1, radius: 1, units: 'm'};
    var categories: string | string[] = baseGeoQuery.categories;
    var includeMetadata: boolean = baseGeoQuery.includeMetadata;
    var metadata: Object = baseGeoQuery.metadata;
    var condition: string = baseGeoQuery.condition;
    var relativeFindMetadata: Object = baseGeoQuery.relativeFindMetadata;
    var relativeFindPercentThreshold: number = baseGeoQuery.relativeFindPercentThreshold;
    var pageSize: number = baseGeoQuery.pageSize;

    var searchRectangle: number[] = rectangleGeoQuery.searchRectangle;

    var latitude: number = circleGeoQuery.latitude;
    var longitude: number = circleGeoQuery.longitude;
    var radius: number = circleGeoQuery.radius;
    var units: string = circleGeoQuery.units;
    var promiseObject: Promise<Object>;
    var promiseVoid: Promise<void>;
    var promiseNum: Promise<number>;
    var resultNum: number;

    var inAppCallback: Backendless.GeofenceMonitoringCallbacksI = {
        onenter: function () {
        }
    };

    existPoint = Backendless.Geo.savePointSync(newGeoPoint);
    promiseObject = Backendless.Geo.savePoint(newGeoPoint);

    geoCollectionResult = Backendless.Geo.findSync(baseGeoQuery);
    promiseObject = Backendless.Geo.find(baseGeoQuery);

    geoCollectionResult = Backendless.Geo.findSync(rectangleGeoQuery);
    promiseObject = Backendless.Geo.find(rectangleGeoQuery);

    geoCollectionResult = Backendless.Geo.findSync(circleGeoQuery);
    promiseObject = Backendless.Geo.find(circleGeoQuery);

    resultNum = Backendless.Geo.getGeopointCountSync(baseGeoQuery);
    resultNum = Backendless.Geo.getGeopointCountSync(fenceName, baseGeoQuery);
    promiseNum = Backendless.Geo.getGeopointCount(baseGeoQuery);
    promiseNum = Backendless.Geo.getGeopointCount(fenceName, baseGeoQuery);

    errorStr = Backendless.Geo.deletePointSync(categoryName);
    errorStr = Backendless.Geo.deletePointSync(existPoint);
    promiseObject = Backendless.Geo.deletePoint(categoryName);
    promiseObject = Backendless.Geo.deletePoint(existPoint);

    resultObj = Backendless.Geo.loadMetadataSync(existPoint);
    resultObj = Backendless.Geo.loadMetadataSync(geoClaster);
    promiseObject = Backendless.Geo.loadMetadata(existPoint);
    promiseObject = Backendless.Geo.loadMetadata(geoClaster);

    geoCollectionResult = Backendless.Geo.getClusterPointsSync(geoClaster);
    promiseObject = Backendless.Geo.getClusterPoints(geoClaster);

    geoCollectionResult = Backendless.Geo.getFencePointsSync(fenceName, baseGeoQuery);
    promiseObject = Backendless.Geo.getFencePoints(fenceName, baseGeoQuery);

    geoCollectionResult = Backendless.Geo.relativeFindSync(baseGeoQuery);
    promiseObject = Backendless.Geo.relativeFind(baseGeoQuery);

    geoCategory = Backendless.Geo.addCategorySync(categoryName);
    promiseObject = Backendless.Geo.addCategory(categoryName);

    bool = Backendless.Geo.deleteCategorySync(categoryName);
    promiseObject = Backendless.Geo.deleteCategory(categoryName);

    geoCategories = Backendless.Geo.getCategoriesSync();
    promiseObject = Backendless.Geo.getCategories();

    resultObj = Backendless.Geo.runOnStayActionSync(fenceName, existPoint);
    promiseObject = Backendless.Geo.runOnStayAction(fenceName, existPoint);

    resultObj = Backendless.Geo.runOnExitActionSync(fenceName, existPoint);
    promiseObject = Backendless.Geo.runOnExitAction(fenceName, existPoint);

    resultObj = Backendless.Geo.runOnEnterActionSync(fenceName, existPoint);
    promiseObject = Backendless.Geo.runOnEnterAction(fenceName, existPoint);

    Backendless.Geo.startGeofenceMonitoringWithInAppCallbackSync(fenceName, inAppCallback);
    promiseVoid = Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback);

    Backendless.Geo.startGeofenceMonitoringWithRemoteCallbackSync(fenceName, existPoint);
    promiseVoid = Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint);

    Backendless.Geo.stopGeofenceMonitoring(fenceName);

}

function testMessaging() {
    var restUrl: string = Backendless.Messaging.restUrl;
    var channelProperties: Object = Backendless.Messaging.channelProperties;
    var channelName: string = 'str';
    var deviceToken: string = 'str';
    var subject: string = 'str';
    var messageId: string = 'str';
    var message: string | Object = 'str';
    var resultObj: Object;
    var resultString: String;
    var resultBool: boolean = true;
    var promiseObject: Promise<Object>;
    var PromiseString: Promise<String>;
    var bodyParts: Backendless.Bodyparts = new Backendless.Bodyparts();
    var recipients: string[] = ['str'];
    var attachments: string[] = ['str'];
    var channels: string[] = ['str'];
    var expiration: number | Date = 123;
    var publishOptions: Backendless.PublishOptions = new Backendless.PublishOptions();
    var deliveryOptions: Backendless.DeliveryOptions = new Backendless.DeliveryOptions();
    var subscription: Backendless.SubscriptionI;
    var subscriptionOptions: Backendless.SubscriptionOptions = new Backendless.SubscriptionOptions();
    var subscriptionCallback = function (data: Object): void {
        var messagesArray: Array<String> = data["messages"];
    };

    subscription = Backendless.Messaging.subscribeSync(channelName, subscriptionCallback, subscriptionOptions);
    promiseObject = Backendless.Messaging.subscribe(channelName, subscriptionCallback, subscriptionOptions);

    resultObj = Backendless.Messaging.publishSync(channelName, message, publishOptions, deliveryOptions);
    promiseObject = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions);

    resultString = Backendless.Messaging.sendEmailSync(subject, bodyParts, recipients, attachments);
    PromiseString = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments);

    resultBool = Backendless.Messaging.cancelSync(messageId);
    promiseObject = Backendless.Messaging.cancel(messageId);

    resultObj = Backendless.Messaging.registerDeviceSync(deviceToken, channels, expiration);
    promiseObject = Backendless.Messaging.registerDevice(deviceToken, channels, expiration);

    resultObj = Backendless.Messaging.getRegistrationsSync();
    promiseObject = Backendless.Messaging.getRegistrations();

    resultObj = Backendless.Messaging.unregisterDeviceSync();
    promiseObject = Backendless.Messaging.unregisterDevice();

}

function testFilesService() {
    var path: string = 'str';
    var fileName: string = 'str';
    var fileContent: Blob = new Blob();
    var pattern: string = 'str';
    var recursively: boolean = true;
    var pageSize: number = 123;
    var offset: number = 123;
    var overwrite: boolean = true;
    var file: File;
    var files: File[] = [file];
    var oldPathName: string = 'str';
    var newName: string = 'str';
    var sourcePath: string = 'str';
    var targetPath: string = 'str';
    var fileURL: string = 'str';
    var userid: string = 'str';
    var url: string = 'str';
    var permissionType: string = 'str';
    var roleName: string = 'str';

    var resultStr: string;
    var resultBool: boolean;
    var resultObj: Object;
    var promiseObject: Promise<Object>;
    var promiseVoid: Promise<void>;

    resultStr = Backendless.Files.restUrl;

    resultBool = Backendless.Files.saveFileSync(path, fileName, fileContent, overwrite);
    resultBool = Backendless.Files.saveFileSync(path, fileName, fileContent);

    promiseObject = Backendless.Files.saveFile(path, fileName, fileContent, overwrite);
    promiseObject = Backendless.Files.saveFile(path, fileName, fileContent);

    Backendless.Files.uploadSync(file, path, overwrite);
    Backendless.Files.uploadSync(files, path, overwrite);
    Backendless.Files.uploadSync(file, path, null);
    Backendless.Files.uploadSync(files, path, null);

    promiseVoid = Backendless.Files.upload(file, path, overwrite);
    promiseVoid = Backendless.Files.upload(files, path, overwrite);
    promiseVoid = Backendless.Files.upload(file, path, null);
    promiseVoid = Backendless.Files.upload(files, path, null);

    resultObj = Backendless.Files.listingSync(path);
    resultObj = Backendless.Files.listingSync(path, pattern);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively, pageSize);
    resultObj = Backendless.Files.listingSync(path, pattern, recursively, pageSize, offset);

    promiseObject = Backendless.Files.listing(path);
    promiseObject = Backendless.Files.listing(path, pattern);
    promiseObject = Backendless.Files.listing(path, pattern, recursively);
    promiseObject = Backendless.Files.listing(path, pattern, recursively, pageSize);
    promiseObject = Backendless.Files.listing(path, pattern, recursively, pageSize, offset);

    resultObj = Backendless.Files.renameFileSync(oldPathName, newName);
    promiseObject = Backendless.Files.renameFile(oldPathName, newName);

    resultObj = Backendless.Files.moveFileSync(sourcePath, targetPath);
    promiseObject = Backendless.Files.moveFile(sourcePath, targetPath);

    resultObj = Backendless.Files.copyFileSync(sourcePath, targetPath);
    promiseObject = Backendless.Files.copyFile(sourcePath, targetPath);

    Backendless.Files.removeSync(fileURL);
    promiseVoid = Backendless.Files.remove(fileURL);

    resultObj = Backendless.Files.existsSync(path);
    promiseObject = Backendless.Files.exists(path);

    Backendless.Files.removeDirectorySync(path);
    promiseVoid = Backendless.Files.removeDirectory(path);

    resultObj = Backendless.Files.Permissions.READ.grantUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.READ.grantRoleSync(roleName, url);
    resultObj = Backendless.Files.Permissions.READ.denyUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.READ.denyRoleSync(roleName, url);

    resultObj = Backendless.Files.Permissions.DELETE.grantUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.DELETE.grantRoleSync(roleName, url);
    resultObj = Backendless.Files.Permissions.DELETE.denyUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.DELETE.denyRoleSync(roleName, url);

    resultObj = Backendless.Files.Permissions.WRITE.grantUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.WRITE.grantRoleSync(roleName, url);
    resultObj = Backendless.Files.Permissions.WRITE.denyUserSync(userid, url);
    resultObj = Backendless.Files.Permissions.WRITE.denyRoleSync(roleName, url);

    promiseObject = Backendless.Files.Permissions.READ.grantUser(userid, url);
    promiseObject = Backendless.Files.Permissions.READ.grantRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.READ.denyUser(userid, url);
    promiseObject = Backendless.Files.Permissions.READ.denyRole(roleName, url);

    promiseObject = Backendless.Files.Permissions.DELETE.grantUser(userid, url);
    promiseObject = Backendless.Files.Permissions.DELETE.grantRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyUser(userid, url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyRole(roleName, url);

    promiseObject = Backendless.Files.Permissions.WRITE.grantUser(userid, url);
    promiseObject = Backendless.Files.Permissions.WRITE.grantRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyUser(userid, url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyRole(roleName, url);
}

function testCommerce() {
    var packageName: string = 'str';
    var productId: string = 'str';
    var token: string = 'str';
    var subscriptionId: string = 'str';

    var resultStr: string;
    var resultObj: Object;
    var promiseObject: Promise<Object>;

    resultStr = Backendless.Commerce.restUrl;

    resultObj = Backendless.Commerce.validatePlayPurchaseSync(packageName, productId, token);
    promiseObject = Backendless.Commerce.validatePlayPurchase(packageName, productId, token);

    resultObj = Backendless.Commerce.cancelPlaySubscriptionSync(packageName, subscriptionId, token);
    promiseObject = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token);

    resultObj = Backendless.Commerce.getPlaySubscriptionStatusSync(packageName, subscriptionId, token);
    promiseObject = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token);
}

function testEvents() {
    var eventName: string = 'str';
    var eventArgs: Object = {};

    var resultStr: string;
    var resultObj: Object;
    var promiseObject: Promise<Object>;

    resultStr = Backendless.Events.restUrl;

    resultObj = Backendless.Events.dispatchSync(eventName, eventArgs);
    promiseObject = Backendless.Events.dispatch(eventName, eventArgs);
}

function testCache() {
    var key: string = 'str';
    var value: any = [{}, 1, 2];
    var timeToLive: number = 123;
    var seconds: number = 123;
    var date: Date = new Date();

    var resultObj: Object;
    var promiseObject: Promise<Object>;

    resultObj = Backendless.Cache.putSync(key, value);
    resultObj = Backendless.Cache.putSync(key, value, timeToLive);
    promiseObject = Backendless.Cache.put(key, value);
    promiseObject = Backendless.Cache.put(key, value, timeToLive);

    resultObj = Backendless.Cache.expireInSync(key, seconds);
    resultObj = Backendless.Cache.expireInSync(key, date);
    promiseObject = Backendless.Cache.expireIn(key, seconds);
    promiseObject = Backendless.Cache.expireIn(key, date);

    resultObj = Backendless.Cache.expireAtSync(key, seconds);
    resultObj = Backendless.Cache.expireAtSync(key, date);
    promiseObject = Backendless.Cache.expireAt(key, seconds);
    promiseObject = Backendless.Cache.expireAt(key, date);

    resultObj = Backendless.Cache.containsSync(key);
    promiseObject = Backendless.Cache.contains(key);

    resultObj = Backendless.Cache.getSync(key);
    promiseObject = Backendless.Cache.get(key);

    resultObj = Backendless.Cache.removeSync(key);
    promiseObject = Backendless.Cache.remove(key);
}

function testCounters() {
    var value: number = 123;
    var counterName: string = 'str';
    var expected: number = 123;
    var updated: number = 123;
    var promiseObject: Promise<Object>;

    //'implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet'
    var resultNum: number = 123;

    resultNum = Backendless.Counters.getSync(counterName);
    promiseObject = Backendless.Counters.get(counterName);

    resultNum = Backendless.Counters.getAndIncrementSync(counterName);
    promiseObject = Backendless.Counters.getAndIncrement(counterName);

    resultNum = Backendless.Counters.incrementAndGetSync(counterName);
    promiseObject = Backendless.Counters.incrementAndGet(counterName);

    resultNum = Backendless.Counters.getAndDecrementSync(counterName);
    promiseObject = Backendless.Counters.getAndDecrement(counterName);

    resultNum = Backendless.Counters.decrementAndGetSync(counterName);
    promiseObject = Backendless.Counters.decrementAndGet(counterName);

    resultNum = Backendless.Counters.addAndGetSync(counterName, value);
    promiseObject = Backendless.Counters.addAndGet(counterName, value);

    resultNum = Backendless.Counters.getAndAddSync(counterName, value);
    promiseObject = Backendless.Counters.getAndAdd(counterName, value);

    resultNum = Backendless.Counters.compareAndSetSync(counterName, expected, updated);
    promiseObject = Backendless.Counters.compareAndSet(counterName, expected, updated);

    resultNum = Backendless.Counters.resetSync(counterName);
    promiseObject = Backendless.Counters.reset(counterName);

    var counter: Counter = Backendless.Counters.of(counterName);

    resultNum = counter.getSync();
    promiseObject = counter.get();

    resultNum = counter.getAndIncrementSync();
    promiseObject = counter.getAndIncrement();

    resultNum = counter.incrementAndGetSync();
    promiseObject = counter.incrementAndGet();

    resultNum = counter.getAndDecrementSync();
    promiseObject = counter.getAndDecrement();

    resultNum = counter.decrementAndGetSync();
    promiseObject = counter.decrementAndGet();

    resultNum = counter.addAndGetSync(value);
    promiseObject = counter.addAndGet(value);

    resultNum = counter.getAndAddSync(value);
    promiseObject = counter.getAndAdd(value);

    resultNum = counter.compareAndSetSync(expected, updated);
    promiseObject = counter.compareAndSet(expected, updated);

    resultNum = counter.resetSync();
    promiseObject = counter.reset();
}

function testCustomServices() {
    var serviceName: string = 'str';
    var serviceVersion: string = 'str';
    var method: string = 'str';
    var parameters: Object = {};

    var resultObj: any = Backendless.CustomServices.invokeSync(serviceName, method, parameters);
    var promiseAny: Promise<any> = Backendless.CustomServices.invoke(serviceName, method, parameters);
}

function testLogging() {
    var numOfMessagesValue: number = 123;
    var timeFrequencySecValue: number = 123;
    var loggerName: string = 'str';
    var logger: Backendless.Logger;
    var message: string = 'str';

    var restUrl: string = Backendless.Logging.restUrl;
    var loggers: Object = Backendless.Logging.loggers;
    var logInfo: Object[] = Backendless.Logging.logInfo;
    var messagesCount: number = Backendless.Logging.messagesCount;
    var numOfMessages: number = Backendless.Logging.numOfMessages;
    var timeFrequency: number = Backendless.Logging.timeFrequency;

    Backendless.Logging.setLogReportingPolicy(numOfMessagesValue, timeFrequencySecValue);

    logger = Backendless.Logging.getLogger(loggerName);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.fatal(message);
    logger.trace(message);
}
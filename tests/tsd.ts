/// <reference path="../libs/backendless.d.ts" />
/// <reference path="./es6-promise.d.ts" />

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
    dataStore.findFirst<Promise<Object>>().then().catch().then().then();

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

    Backendless.UserService.loginWithGooglePlusSdk();
    Backendless.UserService.loginWithGooglePlusSdk({}, true);
    Backendless.UserService.loginWithGooglePlusSdk({}, true, async);
    Backendless.UserService.loginWithGooglePlusSdk({}, null, async);
    Backendless.UserService.loginWithGooglePlusSdk(null, null, async);
    Backendless.UserService.loginWithGooglePlusSdk<Promise<void>>().then().catch().then().then();
    Backendless.UserService.loginWithGooglePlusSdk<Promise<void>>({}).then().catch().then().then();
    Backendless.UserService.loginWithGooglePlusSdk<Promise<void>>({}, true).then().catch().then().then();

    bol = Backendless.UserService.isValidLogin();
    resultXHR = Backendless.UserService.isValidLogin(async);
    Backendless.UserService.isValidLogin<Promise<boolean>>().then().catch().then().then();

    Backendless.UserService.resendEmailConfirmation('email');
    Backendless.UserService.resendEmailConfirmation('email', async);
    Backendless.UserService.resendEmailConfirmation<Promise<void>>('email').then().catch().then().then();

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
    Backendless.Geo.addPoint<Promise<Backendless.GeoPoint>>(newGeoPoint).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.find(baseGeoQuery);
    resultXHR = Backendless.Geo.find(baseGeoQuery, async);
    Backendless.Geo.find<Promise<Backendless.GeoCollectionResultI>>(baseGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.find(rectangleGeoQuery);
    resultXHR = Backendless.Geo.find(rectangleGeoQuery, async);
    Backendless.Geo.find<Promise<Backendless.GeoCollectionResultI>>(rectangleGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.find(circleGeoQuery);
    resultXHR = Backendless.Geo.find(circleGeoQuery, async);
    Backendless.Geo.find<Promise<Backendless.GeoCollectionResultI>>(circleGeoQuery).then().catch().then().then();

    errorStr = Backendless.Geo.deletePoint(categoryName);
    resultXHR = Backendless.Geo.deletePoint(categoryName, async);
    errorStr = Backendless.Geo.deletePoint(existPoint);
    resultXHR = Backendless.Geo.deletePoint(existPoint, async);
    Backendless.Geo.deletePoint<Promise<string>>(categoryName).then().catch().then().then();
    Backendless.Geo.deletePoint<Promise<string>>(existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.loadMetadata(existPoint);
    resultXHR = Backendless.Geo.loadMetadata(existPoint, async);
    resultObj = Backendless.Geo.loadMetadata(geoClaster);
    resultXHR = Backendless.Geo.loadMetadata(geoClaster, async);
    Backendless.Geo.loadMetadata<Promise<Object>>(existPoint).then().catch().then().then();
    Backendless.Geo.loadMetadata<Promise<Object>>(geoClaster).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.getClusterPoints(geoClaster);
    resultXHR = Backendless.Geo.getClusterPoints(geoClaster, async);
    Backendless.Geo.getClusterPoints<Promise<Backendless.GeoCollectionResultI>>(geoClaster).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.getFencePoints(fenceName, baseGeoQuery);
    resultXHR = Backendless.Geo.getFencePoints(fenceName, baseGeoQuery, async);
    Backendless.Geo.getFencePoints<Promise<Backendless.GeoCollectionResultI>>(fenceName, baseGeoQuery).then().catch().then().then();

    geoCollectionResult = Backendless.Geo.relativeFind(baseGeoQuery);
    resultXHR = Backendless.Geo.relativeFind(baseGeoQuery, async);
    Backendless.Geo.relativeFind<Promise<Backendless.GeoCollectionResultI>>(baseGeoQuery).then().catch().then().then();

    geoCategory = Backendless.Geo.addCategory(categoryName);
    resultXHR = Backendless.Geo.addCategory(categoryName, async);
    Backendless.Geo.addCategory<Promise<Backendless.GeoCategoryI>>(categoryName).then().catch().then().then();

    bool = Backendless.Geo.deleteCategory(categoryName);
    resultXHR = Backendless.Geo.deleteCategory(categoryName, async);
    Backendless.Geo.deleteCategory<Promise<boolean>>(categoryName).then().catch().then().then();

    geoCategories = Backendless.Geo.getCategories();
    resultXHR = Backendless.Geo.getCategories(async);
    Backendless.Geo.getCategories<Promise<Backendless.GeoCategoryI[]>>().then().catch().then().then();

    resultObj = Backendless.Geo.runOnStayAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnStayAction(fenceName, existPoint, async);
    Backendless.Geo.runOnStayAction<Promise<Object>>(fenceName, existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.runOnExitAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnExitAction(fenceName, existPoint, async);
    Backendless.Geo.runOnExitAction<Promise<Object>>(fenceName, existPoint).then().catch().then().then();

    resultObj = Backendless.Geo.runOnEnterAction(fenceName, existPoint);
    resultXHR = Backendless.Geo.runOnEnterAction(fenceName, existPoint, async);
    Backendless.Geo.runOnEnterAction<Promise<Object>>(fenceName, existPoint).then().catch().then().then();

    Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback);
    Backendless.Geo.startGeofenceMonitoringWithInAppCallback(fenceName, inAppCallback, async);
    Backendless.Geo.startGeofenceMonitoringWithInAppCallback<Promise<void>>(fenceName, inAppCallback).then().catch().then().then();

    Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint);
    Backendless.Geo.startGeofenceMonitoringWithRemoteCallback(fenceName, existPoint, async);
    //Backendless.Geo.startGeofenceMonitoringWithRemoteCallback<Promise<void>>(fenceName, existPoint).then().catch().then().then();

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
    Backendless.Messaging.subscribe<Promise<Backendless.SubscriptionI>>(channelName, subscriptionCallback, subscriptionOptions).then().catch().then().then();

    resultObj = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions);
    resultXHR = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions, async);
    Backendless.Messaging.publish<Promise<Object>>(channelName, message, publishOptions, deliveryOptions).then().catch().then().then();

    resultObj = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments);
    resultXHR = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments, async);
    Backendless.Messaging.sendEmail<Promise<Object>>(subject, bodyParts, recipients, attachments).then().catch().then().then();

    resultBool = Backendless.Messaging.cancel(messageId);
    resultXHR = Backendless.Messaging.cancel(messageId, async);
    Backendless.Messaging.cancel<Promise<boolean>>(messageId).then().catch().then().then();

    resultObj = Backendless.Messaging.registerDevice(channels, expiration);
    resultXHR = Backendless.Messaging.registerDevice(channels, expiration, async);
    Backendless.Messaging.registerDevice<Promise<Object>>(channels, expiration).then().catch().then().then();

    resultObj = Backendless.Messaging.getRegistrations();
    resultXHR = Backendless.Messaging.getRegistrations(async);
    Backendless.Messaging.getRegistrations<Promise<Object>>().then().catch().then().then();

    resultObj = Backendless.Messaging.unregisterDevice();
    resultXHR = Backendless.Messaging.unregisterDevice(async);
    Backendless.Messaging.unregisterDevice<Promise<Object>>().then().catch().then().then();

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

    Backendless.Files.saveFile<Promise<boolean>>(path, fileName, fileContent, overwrite).then().catch().then().then();
    Backendless.Files.saveFile<Promise<boolean>>(path, fileName, fileContent).then().catch().then().then();

    Backendless.Files.saveFile(path, fileName, fileContent, overwrite, async);
    Backendless.Files.saveFile(path, fileName, fileContent, async);

    Backendless.Files.upload(file, path, overwrite, async);
    Backendless.Files.upload(files, path, overwrite, async);
    Backendless.Files.upload(file, path, null, async);
    Backendless.Files.upload(files, path, null, async);

    Backendless.Files.upload<Promise<Object>>(file, path, overwrite).then().catch().then().then();
    Backendless.Files.upload<Promise<Object>>(files, path, overwrite).then().catch().then().then();
    Backendless.Files.upload<Promise<Object>>(file, path, null).then().catch().then().then();
    Backendless.Files.upload<Promise<Object>>(files, path, null).then().catch().then().then();

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

    Backendless.Files.listing<Promise<Object>>(path).then().catch().then().then();
    Backendless.Files.listing<Promise<Object>>(path, pattern).then().catch().then().then();
    Backendless.Files.listing<Promise<Object>>(path, pattern, recursively).then().catch().then().then();
    Backendless.Files.listing<Promise<Object>>(path, pattern, recursively, pageSize).then().catch().then().then();
    Backendless.Files.listing<Promise<Object>>(path, pattern, recursively, pageSize, offset).then().catch().then().then();

    resultObj = Backendless.Files.renameFile(oldPathName, newName);
    Backendless.Files.renameFile(oldPathName, newName, async);
    Backendless.Files.renameFile<Promise<Object>>(oldPathName, newName).then().catch().then().then();

    resultObj = Backendless.Files.moveFile(sourcePath, targetPath);
    Backendless.Files.moveFile(sourcePath, targetPath, async);
    Backendless.Files.moveFile<Promise<Object>>(sourcePath, targetPath).then().catch().then().then();

    resultObj = Backendless.Files.copyFile(sourcePath, targetPath);
    Backendless.Files.copyFile(sourcePath, targetPath, async);
    Backendless.Files.copyFile<Promise<Object>>(sourcePath, targetPath).then().catch().then().then();

    Backendless.Files.remove(fileURL);
    Backendless.Files.remove(fileURL, async);
    Backendless.Files.remove<Promise<void>>(fileURL).then().catch().then().then();

    resultObj = Backendless.Files.exists(path);
    resultXHR = Backendless.Files.exists(path, async);
    Backendless.Files.exists<Promise<Object>>(path).then().catch().then().then();

    Backendless.Files.removeDirectory(path);
    Backendless.Files.removeDirectory(path, async);
    Backendless.Files.removeDirectory<Promise<void>>(path).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.grantUser(userid, url, permissionType);
    resultXHR = Backendless.Files.Permissions.grantUser(userid, url, permissionType, async);
    Backendless.Files.Permissions.grantUser<Promise<Object>>(userid, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.grantRole(roleName, url, permissionType);
    resultXHR = Backendless.Files.Permissions.grantRole(roleName, url, permissionType, async);
    Backendless.Files.Permissions.grantRole<Promise<Object>>(roleName, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.denyUser(userid, url, permissionType);
    resultXHR = Backendless.Files.Permissions.denyUser(userid, url, permissionType, async);
    Backendless.Files.Permissions.denyUser<Promise<Object>>(userid, url, permissionType).then().catch().then().then();

    resultObj = Backendless.Files.Permissions.denyRole(roleName, url, permissionType);
    resultXHR = Backendless.Files.Permissions.denyRole(roleName, url, permissionType, async);
    Backendless.Files.Permissions.denyRole<Promise<Object>>(roleName, url, permissionType).then().catch().then().then();
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
    Backendless.Commerce.validatePlayPurchase<Promise<Object>>(packageName, productId, token).then().catch().then().then();

    resultObj = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token);
    resultXHR = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token, async);
    Backendless.Commerce.cancelPlaySubscription<Promise<Object>>(packageName, subscriptionId, token).then().catch().then().then();

    resultObj = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token);
    resultXHR = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token, async);
    Backendless.Commerce.getPlaySubscriptionStatus<Promise<Object>>(packageName, subscriptionId, token).then().catch().then().then();
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
    Backendless.Events.dispatch<Promise<Object>>(eventName, eventArgs).then().catch().then().then();
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
    Backendless.Cache.put<Promise<Object>>(key, value).then().catch().then().then();
    Backendless.Cache.put<Promise<Object>>(key, value, timeToLive).then().catch().then().then();

    resultObj = Backendless.Cache.expireIn(key, seconds);
    resultXHR = Backendless.Cache.expireIn(key, seconds, async);
    resultObj = Backendless.Cache.expireIn(key, date);
    resultXHR = Backendless.Cache.expireIn(key, date, async);
    Backendless.Cache.expireIn<Promise<Object>>(key, seconds).then().catch().then().then();
    Backendless.Cache.expireIn<Promise<Object>>(key, date).then().catch().then().then();

    resultObj = Backendless.Cache.expireAt(key, seconds);
    resultXHR = Backendless.Cache.expireAt(key, seconds, async);
    resultObj = Backendless.Cache.expireAt(key, date);
    resultXHR = Backendless.Cache.expireAt(key, date, async);
    Backendless.Cache.expireAt<Promise<Object>>(key, seconds).then().catch().then().then();
    Backendless.Cache.expireAt<Promise<Object>>(key, date).then().catch().then().then();

    resultObj = Backendless.Cache.contains(key);
    resultXHR = Backendless.Cache.contains(key, async);
    Backendless.Cache.contains<Promise<Object>>(key).then().catch().then().then();

    resultObj = Backendless.Cache.get(key);
    resultXHR = Backendless.Cache.get(key, async);
    Backendless.Cache.get<Promise<Object>>(key).then().catch().then().then();

    resultObj = Backendless.Cache.remove(key);
    resultXHR = Backendless.Cache.remove(key, async);
    Backendless.Cache.remove<Promise<Object>>(key).then().catch().then().then();
}

function testCounters() {
    var value:number = 123;
    var counterName:string = 'str';
    var expected:number = 123;
    var updated:number = 123;
    var async:Backendless.Async = new Backendless.Async(function (data:Object) {

    });
    //'implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet'
    var resultNum:number = 123;
    var resultXHR:XMLHttpRequest;

    resultNum = Backendless.Counters.get(counterName);
    resultXHR = Backendless.Counters.get(counterName, async);
    Backendless.Counters.get<Promise<number>>(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.getAndIncrement(counterName);
    resultXHR = Backendless.Counters.getAndIncrement(counterName, async);
    Backendless.Counters.getAndIncrement<Promise<number>>(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.incrementAndGet(counterName);
    resultXHR = Backendless.Counters.incrementAndGet(counterName, async);
    Backendless.Counters.incrementAndGet<Promise<number>>(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.getAndDecrement(counterName);
    resultXHR = Backendless.Counters.getAndDecrement(counterName, async);
    Backendless.Counters.getAndDecrement<Promise<number>>(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.decrementAndGet(counterName);
    resultXHR = Backendless.Counters.decrementAndGet(counterName, async);
    Backendless.Counters.decrementAndGet<Promise<number>>(counterName).then().catch().then().then();

    resultNum = Backendless.Counters.addAndGet(counterName, value);
    resultXHR = Backendless.Counters.addAndGet(counterName, value, async);
    Backendless.Counters.addAndGet<Promise<number>>(counterName, value).then().catch().then().then();

    resultNum = Backendless.Counters.getAndAdd(counterName, value);
    resultXHR = Backendless.Counters.getAndAdd(counterName, value, async);
    Backendless.Counters.getAndAdd<Promise<number>>(counterName, value).then().catch().then().then();

    resultNum = Backendless.Counters.compareAndSet(counterName, expected, updated);
    resultXHR = Backendless.Counters.compareAndSet(counterName, expected, updated, async);
    Backendless.Counters.compareAndSet<Promise<number>>(counterName, expected, updated).then().catch().then().then();

    resultNum = Backendless.Counters.reset(counterName);
    resultXHR = Backendless.Counters.reset(counterName, async);
    Backendless.Counters.reset<Promise<number>>(counterName).then().catch().then().then();

    var atomicInstance:Backendless.AtomicInstance = Backendless.Counters.of(counterName);

    resultNum = atomicInstance.get();
    resultXHR = atomicInstance.get(async);
    atomicInstance.get<Promise<number>>().then().catch().then().then();

    resultNum = atomicInstance.getAndIncrement();
    resultXHR = atomicInstance.getAndIncrement(async);
    atomicInstance.getAndIncrement<Promise<number>>().then().catch().then().then();

    resultNum = atomicInstance.incrementAndGet();
    resultXHR = atomicInstance.incrementAndGet(async);
    atomicInstance.incrementAndGet<Promise<number>>().then().catch().then().then();

    resultNum = atomicInstance.getAndDecrement();
    resultXHR = atomicInstance.getAndDecrement(async);
    atomicInstance.getAndDecrement<Promise<number>>().then().catch().then().then();

    resultNum = atomicInstance.decrementAndGet();
    resultXHR = atomicInstance.decrementAndGet(async);
    atomicInstance.decrementAndGet<Promise<number>>().then().catch().then().then();

    resultNum = atomicInstance.addAndGet(value);
    resultXHR = atomicInstance.addAndGet(value, async);
    atomicInstance.addAndGet<Promise<number>>(value).then().catch().then().then();

    resultNum = atomicInstance.getAndAdd(value);
    resultXHR = atomicInstance.getAndAdd(value, async);
    atomicInstance.getAndAdd<Promise<number>>(value).then().catch().then().then();

    resultNum = atomicInstance.compareAndSet(expected, updated);
    resultXHR = atomicInstance.compareAndSet(expected, updated, async);
    atomicInstance.compareAndSet<Promise<number>>(expected, updated).then().catch().then().then();

    resultNum = atomicInstance.reset();
    resultXHR = atomicInstance.reset(async);
    atomicInstance.reset<Promise<number>>().then().catch().then().then();
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
    Backendless.CustomServices.invoke<Promise<Object>>(serviceName, serviceVersion, method, parameters).then().catch().then().then();
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
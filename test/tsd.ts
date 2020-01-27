/// <reference path="../backendless.d.ts" />
/// <reference path="./es6-promise.d.ts" />

import Counter = Backendless.Counter;

function testMain() {
    const applicationId: string = Backendless.applicationId;
    const secretKey: string = Backendless.secretKey;
    const serverURL: string = Backendless.serverURL;
    const appPath: string = Backendless.appPath;
    const browser: { browser: string, version: string } = Backendless.browser;

    Backendless.initApp('APPLICATION_ID', 'JS_SECRET_KEY');
}

function testLocalCache() {
    const key: string = 'key';
    const str: string = 'string';
    const obj: Object = {};
    const arr: any[] = [];
    const num: number = 1234;
    const bol: boolean = true;
    const nul: any = null;

    const result: boolean = Backendless.LocalCache.enabled;
    const result1: boolean = Backendless.LocalCache.exists(key);
    const result2: boolean = Backendless.LocalCache.set(key);
    const result3: Object = Backendless.LocalCache.set(key, obj);
    const result4: any[] = Backendless.LocalCache.set(key, arr);
    const result5: number = Backendless.LocalCache.set(key, num);
    const result6: string = Backendless.LocalCache.set(key, str);
    const result7: any = Backendless.LocalCache.set(key, nul);
    const result8: boolean = Backendless.LocalCache.set(key, bol);
    const result9: any = Backendless.LocalCache.get(key);
    const result11: boolean = Backendless.LocalCache.remove(key);
    const result12: Object = Backendless.LocalCache.getAll();
    const result13: Object = Backendless.LocalCache.getCachePolicy(key);
    const result14: string = Backendless.LocalCache.serialize(obj);
    const result15: string = Backendless.LocalCache.serialize(arr);
    const result16: string = Backendless.LocalCache.serialize(num);
    const result17: string = Backendless.LocalCache.serialize(str);
    const result18: string = Backendless.LocalCache.serialize(bol);
    const result19: any = Backendless.LocalCache.deserialize(key);

    Backendless.LocalCache.clear();
    Backendless.LocalCache.flushExpired();
}

function testDataQueryClass() {
    const dataQuery: Backendless.DataQuery = new Backendless.DataQuery();
    const properties: string[] = dataQuery.properties;
    const condition: string = dataQuery.condition;
    const options: Object = dataQuery.options;
    const url: string = dataQuery.url;
    const str: string = 'str';

    dataQuery.addProperty(str);
}

function testDataQueryBuilderClass() {
    let dataQuery: Backendless.DataQueryBuilder = new Backendless.DataQueryBuilder();

    let str: string = 'str';
    let num: number = 123;
    let strs: string[] = ['abc', 'foo', 'bar']

    dataQuery = dataQuery.setPageSize(num);
    dataQuery = dataQuery.setOffset(num);
    dataQuery = dataQuery.prepareNextPage();
    dataQuery = dataQuery.preparePreviousPage();

    dataQuery = dataQuery.setWhereClause(str);
    str = dataQuery.getWhereClause();

    dataQuery = dataQuery.setProperties('abc');
    dataQuery = dataQuery.setProperties(['abc','abc','abc']);
    dataQuery = dataQuery.addProperty(str);
    dataQuery = dataQuery.addProperties(str, str, str, str);
    dataQuery = dataQuery.addProperties(['abc','abc','abc'], ['abc','abc','abc'], ['abc','abc','abc']);
    dataQuery = dataQuery.addProperties(['abc','abc','abc'], str, str);
    dataQuery = dataQuery.addProperties(str);
    dataQuery = dataQuery.addProperties(['abc','abc','abc']);

    strs = dataQuery.getProperties();

    dataQuery = dataQuery.setSortBy(str);
    dataQuery = dataQuery.setSortBy(strs);
    strs = dataQuery.getSortBy();

    dataQuery = dataQuery.setRelated(str);
    dataQuery = dataQuery.setRelated(strs);
    dataQuery = dataQuery.addRelated(str);
    dataQuery = dataQuery.addRelated(strs);
    strs = dataQuery.getRelated();

    dataQuery = dataQuery.setRelationsDepth(num);
    num = dataQuery.getRelationsDepth();
}

function testLoadRelationsQueryBuilder() {
    let loadRelationsQueryBuilder: Backendless.LoadRelationsQueryBuilder;
    loadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();

    loadRelationsQueryBuilder.setRelationName('relationColumn');
    loadRelationsQueryBuilder.setOffset(50);
    loadRelationsQueryBuilder.setPageSize(50);
    loadRelationsQueryBuilder.setSortBy('columnName');
    loadRelationsQueryBuilder.setSortBy(['columnName']);
    loadRelationsQueryBuilder.setProperties('columnName');
    loadRelationsQueryBuilder.setProperties(['columnName']);

    const properties: Array<string> = loadRelationsQueryBuilder.getProperties();
    const sortBy: Array<string> = loadRelationsQueryBuilder.getSortBy();
    const whereClause: string = loadRelationsQueryBuilder.getWhereClause();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.preparePreviousPage();
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.prepareNextPage();
}

function testDataQueryBuilderClass() {
    let strings: Array<string>;
    let str: string;
    let num: number;

    let dataQueryBuilder: Backendless.DataQueryBuilder = Backendless.DataQueryBuilder.create();

    dataQueryBuilder = dataQueryBuilder.setPageSize(123);
    dataQueryBuilder = dataQueryBuilder.setOffset(123);
    dataQueryBuilder = dataQueryBuilder.prepareNextPage();
    dataQueryBuilder = dataQueryBuilder.preparePreviousPage();

    strings = dataQueryBuilder.getProperties();

    dataQueryBuilder = dataQueryBuilder.setProperties('str');
    dataQueryBuilder = dataQueryBuilder.setProperties(strings);

    dataQueryBuilder = dataQueryBuilder.addProperty('str');

    str = dataQueryBuilder.getWhereClause();
    dataQueryBuilder = dataQueryBuilder.setWhereClause('str');

    strings = dataQueryBuilder.getSortBy();
    dataQueryBuilder = dataQueryBuilder.setSortBy('str');
    dataQueryBuilder = dataQueryBuilder.setSortBy(strings);

    strings = dataQueryBuilder.getRelated();
    dataQueryBuilder = dataQueryBuilder.setRelated('str');
    dataQueryBuilder = dataQueryBuilder.setRelated(strings);
    dataQueryBuilder = dataQueryBuilder.addRelated('str');
    dataQueryBuilder = dataQueryBuilder.addRelated(strings);

    num = dataQueryBuilder.getRelationsDepth();
    dataQueryBuilder = dataQueryBuilder.setRelationsDepth(num);

    num = dataQueryBuilder.getRelationsPageSize();
    dataQueryBuilder = dataQueryBuilder.setRelationsPageSize(num);

    const query: Backendless.DataQueryValueI = dataQueryBuilder.build();
}

function testDataStoreClass() {
    const item: Object = {};
    const dataStore: Backendless.DataStore = Backendless.Data.of('str');
    const dataStore2: Backendless.DataStore = Backendless.Data.of({});
    const dataStore3: Backendless.DataStore = Backendless.Data.of(function () {
    });

    const model: Function | Object = dataStore.model;
    const className: string = dataStore.className;
    const restUrl: string = dataStore.restUrl;

    const dataQueryBuilder: Backendless.DataQueryBuilder = Backendless.DataQueryBuilder.create();

    dataQueryBuilder.setWhereClause("objectId like '%00%'");

    const loadRelationsQueryBuilder: Backendless.LoadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();
    const parentTableName: string = 'Test';

    class Person {
        name: string;
    }

    const person = new Person()

    let resultObj: Object;
    let resultNum: number;
    let promisePerson: Promise<Person>;
    let promisePersons: Promise<Person[]>;
    let promiseObject: Promise<Object>;
    let promiseNum: Promise<number>;


    resultObj = dataStore.saveSync(item);
    promiseObject = dataStore.save(item);
    promisePerson = dataStore.save<Person>(person);

    resultObj = dataStore.removeSync('str');
    resultObj = dataStore.removeSync(item);
    promiseObject = dataStore.remove('str');
    promiseObject = dataStore.remove(item);

    resultObj = dataStore.findSync(dataQueryBuilder);
    resultObj = dataStore.findSync();
    promiseObject = dataStore.find(dataQueryBuilder);
    promiseObject = dataStore.find();
    promisePersons = dataStore.find<Person>();

    resultObj = dataStore.findByIdSync('myId');
    promiseObject = dataStore.findById('myId');
    promisePerson = dataStore.findById<Person>('myId');

    resultObj = dataStore.findFirstSync();
    promiseObject = dataStore.findFirst();
    promisePerson = dataStore.findFirst<Person>();

    resultObj = dataStore.findLastSync();
    promiseObject = dataStore.findLast();
    promisePerson = dataStore.findLast<Person>();

    dataStore.loadRelationsSync(parentTableName, loadRelationsQueryBuilder);
    promiseObject = dataStore.loadRelations(parentTableName, loadRelationsQueryBuilder);

    resultNum = dataStore.getObjectCountSync();
    resultNum = dataStore.getObjectCountSync(dataQueryBuilder);
    promiseNum = dataStore.getObjectCount();
    promiseNum = dataStore.getObjectCount(dataQueryBuilder);

}

function testPersistence() {
    let resultObj: Object;
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');
    let Model: Function;
    let promiseObject: Promise<Object>;

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

function testDataGeometry() {
    let geometry: Backendless.Data.Geometry;
    let srs: Backendless.Data.SpatialReferenceSystem.SpatialType;

    geometry = new Backendless.Data.Geometry(Backendless.Data.SpatialReferenceSystem.CARTESIAN);
    srs = geometry.getSRS();
    const geoJSON: object = geometry.asGeoJSON();
    const wktString: string = geometry.asWKT();

    geometry = Backendless.Data.Geometry.fromGeoJSON('{"type":"Point","coordinates":[10,20]}')
    geometry = Backendless.Data.Geometry.fromWKT('POINT(10 20)')
}

function testDataPoint() {
    let point: Backendless.Data.Point;
    let coordinate: Number;
    let srs: Backendless.Data.SpatialReferenceSystem.SpatialType;

    point = new Backendless.Data.Point();
    point = new Backendless.Data.Point(Backendless.Data.SpatialReferenceSystem.CARTESIAN);
    coordinate = point.getX();
    coordinate = point.getY();
    coordinate = point.getLongitude();
    coordinate = point.getLatitude();
    point = point.setX(coordinate);
    point = point.setY(coordinate);
    point = point.setLatitude(coordinate);
    point = point.setLongitude(coordinate);
    point = point.setSrs(srs);
    const geoJSON: string = point.getGeojsonType();
    const wktString: string = point.getWktType();
    const wktCoordinatePairs: string = point.wktCoordinatePairs();
    const jsonCoordinatePairs: string = point.jsonCoordinatePairs();
    const equals: boolean = point.equals(point);
}

function testDataLineString() {
    let lineString: Backendless.Data.LineString;
    let srs: Backendless.Data.SpatialReferenceSystem.SpatialType;
    let point1 = new Backendless.Data.Point();
    let point2 = new Backendless.Data.Point();
    let points = [point1, point2];

    lineString = new Backendless.Data.LineString(points);
    lineString = new Backendless.Data.LineString(points, srs);
    points = lineString.getPoints();
    lineString = lineString.setPoints(points);
    const geoJSON: string = lineString.getGeojsonType();
    const wktString: string = lineString.getWktType();
    const wktCoordinatePairs: string = lineString.wktCoordinatePairs();
    const jsonCoordinatePairs: string = lineString.jsonCoordinatePairs();
}

function testDataPolygon() {
    let polygon: Backendless.Data.Polygon;
    let lineStringType: Backendless.Data.LineString;
    let srs: Backendless.Data.SpatialReferenceSystem.SpatialType;
    let point1 = new Backendless.Data.Point();
    let point2 = new Backendless.Data.Point();
    let points = [point1, point2];
    let lineString = new Backendless.Data.LineString(points);
    let lineStringsArray = [lineString]

    polygon = new Backendless.Data.Polygon(lineString);
    polygon = new Backendless.Data.Polygon(lineString, lineStringsArray);
    polygon = new Backendless.Data.Polygon(lineString, lineStringsArray, srs);
    polygon = new Backendless.Data.Polygon(points);
    polygon = new Backendless.Data.Polygon(points, lineStringsArray);
    polygon = new Backendless.Data.Polygon(points, lineStringsArray, srs);
    polygon = polygon.setBoundary(lineString);
    lineStringsArray = polygon.getHoles();
    polygon = polygon.setHoles(lineStringsArray);
    lineStringType = polygon.getBoundary();
    const geoJSON: string = polygon.getGeojsonType();
    const wktString: string = polygon.getWktType();
    const wktCoordinatePairs: string = polygon.wktCoordinatePairs();
    const jsonCoordinatePairs: string = polygon.jsonCoordinatePairs();
}

function testData() {
    let resultObj: Object;
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');
    let Model: Function;
    let promiseObject: Promise<Object>;

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

function testBulkOperations() {
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');

    let resultPromiseListOfString: Promise<Array<string>>;
    let resultListOfString: Array<string>;

    let resultPromiseString: Promise<string>;
    let resultString: string;

    resultPromiseListOfString = dataStore.bulkCreate([{}, {}, {}]);
    resultListOfString = dataStore.bulkCreateSync([{}, {}, {}]);

    resultPromiseString = dataStore.bulkUpdate('where clause string', {foo: 'bar'});
    resultString = dataStore.bulkUpdateSync('where clause string', {foo: 'bar'});

    resultPromiseString = dataStore.bulkDelete('where clause string');
    resultPromiseString = dataStore.bulkDelete(['objectId1', 'objectId2', 'objectId3']);
    resultPromiseString = dataStore.bulkDelete([{objectId: 'objectId1'}]);
    resultPromiseString = dataStore.bulkDelete([{objectId: 'objectId1', foo: 'bar'}]);

    resultString = dataStore.bulkDeleteSync('where clause string');
    resultString = dataStore.bulkDeleteSync(['objectId1', 'objectId2', 'objectId3']);
    resultString = dataStore.bulkDeleteSync([{objectId: 'objectId1'}]);
    resultString = dataStore.bulkDeleteSync([{objectId: 'objectId1', foo: 'bar'}]);
}

function testDataPermissions() {
    const userId: string = 'userId';
    const roleName: string = 'myRole';
    const dataObj: Backendless.ExistDataItemI = {___class: 'myClass', objectId: 'myId'};
    let resultObj: Backendless.ExistDataItemI;
    let promiseObject: Promise<Object>;

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

    promiseObject = Backendless.Data.Permissions.FIND.grantForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.grantForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.grantForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.grantForAllRoles(dataObj);
    promiseObject = Backendless.Data.Permissions.FIND.denyForAllRoles(dataObj);

    promiseObject = Backendless.Data.Permissions.REMOVE.grantForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.grantForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.grantForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.grantForAllRoles(dataObj);
    promiseObject = Backendless.Data.Permissions.REMOVE.denyForAllRoles(dataObj);

    promiseObject = Backendless.Data.Permissions.UPDATE.grantForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyForUser(userId, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.grantForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyForRole(roleName, dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.grantForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyForAllUsers(dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.grantForAllRoles(dataObj);
    promiseObject = Backendless.Data.Permissions.UPDATE.denyForAllRoles(dataObj);

}

function testUser() {
    const newUser = new Backendless.User();

    const className: string = newUser.___class;
}

function testUserService() {
    const userName: string = 'userName';
    const identity: string = 'identity';
    const roleName: string = 'rolename';
    const password: string = 'password';
    const div: HTMLElement = document.createElement('div');
    let bol: boolean = true;
    let newUser: Backendless.User = new Backendless.User();
    let resultObj: Object;
    let resultVoid: void;
    let resultListOfString: string[];
    let resultListOfObjects: object[];
    let promiseObject: Promise<Object>;
    let promiseListOfString: Promise<Object>;
    let promiseListOfObject: Promise<Object>;
    let promiseVoid: Promise<void>;
    let promiseBLUser: Promise<Backendless.User>;

    class CustomUser {
    }

    let promiseCustomUser: Promise<CustomUser>;

    const restUrl: string = Backendless.UserService.restUrl;
    const loggedInUser: boolean = Backendless.UserService.loggedInUser();

    resultVoid = Backendless.UserService.restorePasswordSync('email');
    promiseVoid = Backendless.UserService.restorePassword('email');

    newUser = Backendless.UserService.registerSync(newUser);
    promiseObject = Backendless.UserService.register(newUser);

    resultListOfString = Backendless.UserService.getUserRolesSync();
    promiseListOfString = Backendless.UserService.getUserRoles();

    resultVoid = Backendless.UserService.assignRoleSync(identity, roleName);
    promiseVoid = Backendless.UserService.assignRole(identity, roleName);

    resultVoid = Backendless.UserService.unassignRoleSync(identity, roleName);
    promiseVoid = Backendless.UserService.unassignRole(identity, roleName);

    newUser = Backendless.UserService.loginSync(userName, password);
    newUser = Backendless.UserService.loginSync(userName, password, bol);
    promiseObject = Backendless.UserService.login(userName, password);
    promiseObject = Backendless.UserService.login(userName, password, bol);

    newUser = Backendless.UserService.loginAsGuestSync();
    newUser = Backendless.UserService.loginAsGuestSync(bol);
    promiseObject = Backendless.UserService.loginAsGuest();
    promiseObject = Backendless.UserService.loginAsGuest(bol);

    resultListOfObjects = Backendless.UserService.describeUserClassSync();
    promiseListOfObject = Backendless.UserService.describeUserClass();

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

    promiseBLUser = Backendless.UserService.loginWithFacebookSdk({});
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk({}, true);

    promiseBLUser = Backendless.UserService.loginWithFacebookSdk('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk('accessToken', {}, true);
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk<Backendless.User>('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk<Backendless.User>('accessToken', {}, true);
    promiseCustomUser = Backendless.UserService.loginWithFacebookSdk<CustomUser>('accessToken', {});
    promiseCustomUser = Backendless.UserService.loginWithFacebookSdk<CustomUser>('accessToken', {}, true);

    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk({});
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk({}, true);

    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk('accessToken', {}, true);
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk<Backendless.User>('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk<Backendless.User>('accessToken', {}, true);
    promiseCustomUser = Backendless.UserService.loginWithGooglePlusSdk<CustomUser>('accessToken', {});
    promiseCustomUser = Backendless.UserService.loginWithGooglePlusSdk<CustomUser>('accessToken', {}, true);

    bol = Backendless.UserService.isValidLoginSync();
    promiseObject = Backendless.UserService.isValidLogin();

    Backendless.UserService.resendEmailConfirmationSync('email');
    promiseVoid = Backendless.UserService.resendEmailConfirmation('email');

}

function testGoeService() {
    const newGeoPoint: Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;
    newGeoPoint.categories = ["c"];
    newGeoPoint.metadata = {"owner": "XXX"};

    let existPoint: Backendless.GeoPoint = new Backendless.GeoPoint();
    newGeoPoint.___class = 'c';
    newGeoPoint.objectId = 'id';
    newGeoPoint.latitude = 20;
    newGeoPoint.longitude = 30;

    const geoClaster: Backendless.GeoCluster = new Backendless.GeoCluster();

    geoClaster.___class = 'geo';
    geoClaster.objectId = 'id';
    geoClaster.latitude = 20;
    geoClaster.longitude = 30;
    geoClaster.totalPoints = 10;
    geoClaster.geoQuery = new Backendless.GeoQuery();

    let bool: boolean = true;
    let errorStr: string = 'str';
    const fenceName: string = 'str';
    const categoryName: string = 'str';
    const restUrl: string = Backendless.Geo.restUrl;
    const EARTH_RADIUS: number = Backendless.Geo.EARTH_RADIUS;
    let geoCollectionResult: Array<Object>;
    let geoCategory: Backendless.GeoCategoryI;
    let geoCategories: Backendless.GeoCategoryI[];
    let resultObj: Object;

    const baseGeoQuery: Backendless.GeoQueryI = new Backendless.GeoQuery();
    const rectangleGeoQuery: Backendless.RectangleGeoQueryI = {searchRectangle: [1, 2, 3, 4]};
    const circleGeoQuery: Backendless.CircleGeoQueryI = {latitude: 1, longitude: 1, radius: 1, units: 'm'};
    const categories: string | string[] = baseGeoQuery.categories;
    const includeMetadata: boolean = baseGeoQuery.includeMetadata;
    const metadata: Object = baseGeoQuery.metadata;
    const condition: string = baseGeoQuery.condition;
    const relativeFindMetadata: Object = baseGeoQuery.relativeFindMetadata;
    const relativeFindPercentThreshold: number = baseGeoQuery.relativeFindPercentThreshold;
    const pageSize: number = baseGeoQuery.pageSize;

    const searchRectangle: number[] = rectangleGeoQuery.searchRectangle;

    const latitude: number = circleGeoQuery.latitude;
    const longitude: number = circleGeoQuery.longitude;
    const radius: number = circleGeoQuery.radius;
    const units: string = circleGeoQuery.units;
    let promiseObject: Promise<Object>;
    let promiseVoid: Promise<void>;
    let promiseNum: Promise<number>;
    let resultNum: number;

    const inAppCallback: Backendless.GeofenceMonitoringCallbacksI = {
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

function testEmailEnvelope() {
    let addresses: string[];
    let query: string;
    let address: string = 'foo@foo.com';
    const data: object = {};
    let envelopeObject = new Backendless.EmailEnvelope();

    envelopeObject = Backendless.EmailEnvelope.create(data);
    envelopeObject = envelopeObject.setTo(address);
    addresses = envelopeObject.getTo();
    envelopeObject = envelopeObject.addTo(address);
    addresses = envelopeObject.getTo();
    envelopeObject = envelopeObject.setCc(address);
    addresses = envelopeObject.getCc();
    envelopeObject = envelopeObject.addCc(address);
    addresses = envelopeObject.getCc();
    envelopeObject = envelopeObject.setBcc(address);
    addresses = envelopeObject.getBcc();
    envelopeObject = envelopeObject.addBcc(address);
    addresses = envelopeObject.getBcc();
    envelopeObject = envelopeObject.setQuery('query');
    query = envelopeObject.getQuery();
}

function testMessaging() {
    const restUrl: string = Backendless.Messaging.restUrl;
    const channelProperties: Object = Backendless.Messaging.channelProperties;
    const channelName: string = 'str';
    const deviceToken: string = 'str';
    const subject: string = 'str';
    const messageId: string = 'str';
    const message: string | Object = 'str';
    let resultObj: Object;
    let resultString: String;
    let resultBool: boolean = true;
    let promiseObject: Promise<Object>;
    let PromiseString: Promise<String>;
    const bodyParts: Backendless.Bodyparts = new Backendless.Bodyparts();
    const envelopeObject: Backendless.EmailEnvelope = new Backendless.EmailEnvelope();
    const templateValues: Object | Backendless.EmailEnvelope = {};
    const templateName: string = 'str';
    const recipients: string[] = ['str'];
    const attachments: string[] = ['str'];
    const channels: string[] = ['str'];
    const expiration: number | Date = 123;
    const publishOptions: Backendless.PublishOptions = new Backendless.PublishOptions();
    const deliveryOptions: Backendless.DeliveryOptions = new Backendless.DeliveryOptions();

    let channel: Backendless.ChannelClass;
    const subscriptionOptions: Backendless.SubscriptionOptions = new Backendless.SubscriptionOptions();
    const subscriptionCallback = function (data: Object): void {
        const messagesArray: Array<String> = data["messages"];
    };

    channel = Backendless.Messaging.subscribe(channelName);

    resultObj = Backendless.Messaging.publishSync(channelName, message, publishOptions, deliveryOptions);
    promiseObject = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions);

    resultString = Backendless.Messaging.sendEmailSync(subject, bodyParts, recipients, attachments);
    PromiseString = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments);

    resultObj = Backendless.Messaging.sendEmailFromTemplateSync(templateName, envelopeObject, templateValues);
    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject, templateValues);

    resultObj = Backendless.Messaging.sendEmailFromTemplateSync(templateName, envelopeObject);
    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject);

    resultBool = Backendless.Messaging.cancelSync(messageId);
    promiseObject = Backendless.Messaging.cancel(messageId);

    resultObj = Backendless.Messaging.registerDeviceSync(deviceToken, channels, expiration);
    promiseObject = Backendless.Messaging.registerDevice(deviceToken, channels, expiration);

    resultObj = Backendless.Messaging.getRegistrationsSync();
    promiseObject = Backendless.Messaging.getRegistrations();

    resultObj = Backendless.Messaging.unregisterDeviceSync();
    promiseObject = Backendless.Messaging.unregisterDevice();

    promiseObject = Backendless.Messaging.getPushTemplates('ios');

    promiseObject = Backendless.Messaging.pushWithTemplate('templateName');

}

function testFilesService() {
    const path: string = 'str';
    const fileName: string = 'str';
    const fileContent: Blob = new Blob();
    const pattern: string = 'str';
    const recursively: boolean = true;
    const pageSize: number = 123;
    const offset: number = 123;
    const overwrite: boolean = true;
    let file: File;
    const files: File[] = [file];
    const oldPathName: string = 'str';
    const newName: string = 'str';
    const sourcePath: string = 'str';
    const targetPath: string = 'str';
    const fileURL: string = 'str';
    const userid: string = 'str';
    const url: string = 'str';
    const permissionType: string = 'str';
    const roleName: string = 'str';

    let resultStr: string;
    let resultBool: boolean;
    let resultObj: Object;
    let resultNumber: number;
    let promiseObject: Promise<Object>;
    let promiseVoid: Promise<void>;
    let promiseNumber: Promise<number>;

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

    resultNumber = Backendless.Files.removeSync(fileURL);
    promiseNumber = Backendless.Files.remove(fileURL);

    resultObj = Backendless.Files.existsSync(path);
    promiseObject = Backendless.Files.exists(path);

    resultNumber = Backendless.Files.removeDirectorySync(path);
    promiseNumber = Backendless.Files.removeDirectory(path);

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

    promiseObject = Backendless.Files.Permissions.READ.grantForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.READ.denyForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.READ.grantForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.READ.denyForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.READ.grantForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.READ.denyForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.READ.grantForAllRoles(url);
    promiseObject = Backendless.Files.Permissions.READ.denyForAllRoles(url);

    promiseObject = Backendless.Files.Permissions.DELETE.grantForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.DELETE.grantForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.DELETE.grantForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.DELETE.grantForAllRoles(url);
    promiseObject = Backendless.Files.Permissions.DELETE.denyForAllRoles(url);

    promiseObject = Backendless.Files.Permissions.WRITE.grantForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyForUser(userid, url);
    promiseObject = Backendless.Files.Permissions.WRITE.grantForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyForRole(roleName, url);
    promiseObject = Backendless.Files.Permissions.WRITE.grantForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyForAllUsers(url);
    promiseObject = Backendless.Files.Permissions.WRITE.grantForAllRoles(url);
    promiseObject = Backendless.Files.Permissions.WRITE.denyForAllRoles(url);

}

function testCommerce() {
    const packageName: string = 'str';
    const productId: string = 'str';
    const token: string = 'str';
    const subscriptionId: string = 'str';

    let resultStr: string;
    let resultObj: Object;
    let promiseObject: Promise<Object>;

    resultStr = Backendless.Commerce.restUrl;

    resultObj = Backendless.Commerce.validatePlayPurchaseSync(packageName, productId, token);
    promiseObject = Backendless.Commerce.validatePlayPurchase(packageName, productId, token);

    resultObj = Backendless.Commerce.cancelPlaySubscriptionSync(packageName, subscriptionId, token);
    promiseObject = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token);

    resultObj = Backendless.Commerce.getPlaySubscriptionStatusSync(packageName, subscriptionId, token);
    promiseObject = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token);
}

function testEvents() {
    const eventName: string = 'str';
    const eventArgs: Object = {};

    let resultStr: string;
    let resultObj: Object;
    let promiseObject: Promise<Object>;

    resultStr = Backendless.Events.restUrl;

    resultObj = Backendless.Events.dispatchSync(eventName, eventArgs);
    promiseObject = Backendless.Events.dispatch(eventName, eventArgs);
    promiseObject = Backendless.Events.dispatch(eventName, eventArgs, Backendless.BL.ExecutionTypes.SYNC);
    promiseObject = Backendless.Events.dispatch(eventName, eventArgs, Backendless.BL.ExecutionTypes.ASYNC);
    promiseObject = Backendless.Events.dispatch(eventName, eventArgs, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
    promiseObject = Backendless.Events.dispatch(eventName, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
}

function testCache() {
    const key: string = 'str';
    const value: any = [{}, 1, 2];
    const timeToLive: number = 123;
    const seconds: number = 123;
    const date: Date = new Date();

    let resultObj: Object;
    let promiseObject: Promise<Object>;

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
    const value: number = 123;
    const counterName: string = 'str';
    const expected: number = 123;
    const updated: number = 123;
    let promiseObject: Promise<Object>;

    //'implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet'
    let resultNum: number = 123;

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

    const counter: Counter = Backendless.Counters.of(counterName);

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
    const serviceName: string = 'str';
    const method: string = 'str';
    const parameters: Object = {};
    let resultObj: any
    let promiseAny: Promise<any>

    resultObj = Backendless.CustomServices.invokeSync(serviceName, method, parameters);

    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.SYNC);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
}

function testLogging() {
    const numOfMessagesValue: number = 123;
    const timeFrequencySecValue: number = 123;
    const loggerName: string = 'str';
    let logger: Backendless.Logger;
    const message: string = 'str';

    const restUrl: string = Backendless.Logging.restUrl;
    const loggers: Object = Backendless.Logging.loggers;
    const logInfo: Object[] = Backendless.Logging.logInfo;
    const messagesCount: number = Backendless.Logging.messagesCount;
    const numOfMessages: number = Backendless.Logging.numOfMessages;
    const timeFrequency: number = Backendless.Logging.timeFrequency;

    Backendless.Logging.setLogReportingPolicy(numOfMessagesValue, timeFrequencySecValue);

    logger = Backendless.Logging.getLogger(loggerName);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.error(message);
    logger.fatal(message);
    logger.trace(message);
}

////// ------ RT ------- ///////

function RTClient() {
    Backendless.RT.addConnectEventListener(() => undefined)
    Backendless.RT.removeConnectEventListener(() => undefined)

    Backendless.RT.addConnectErrorEventListener((error: string) => undefined)
    Backendless.RT.addConnectErrorEventListener(() => undefined)
    Backendless.RT.removeConnectErrorEventListener((error: string) => undefined)
    Backendless.RT.removeConnectErrorEventListener(() => undefined)

    Backendless.RT.addDisconnectEventListener(() => undefined)
    Backendless.RT.removeDisconnectEventListener(() => undefined)

    Backendless.RT.addReconnectAttemptEventListener((attempt: number, timeout: number) => undefined)
    Backendless.RT.addReconnectAttemptEventListener((attempt: number) => undefined)
    Backendless.RT.addReconnectAttemptEventListener(() => undefined)
    Backendless.RT.removeReconnectAttemptEventListener((attempt: number, timeout: number) => undefined)
    Backendless.RT.removeReconnectAttemptEventListener((attempt: number) => undefined)
    Backendless.RT.removeReconnectAttemptEventListener(() => undefined)

    Backendless.RT.removeConnectionListeners()
}

function RTData() {
    const eventHandler: Backendless.EventHandler = Backendless.Data.of('Person').rt()

    class Person {
        foo?: string = 'bar'
    }

    eventHandler
        .addCreateListener('whereClause', (obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener('whereClause', (obj: Object) => undefined)
        .addCreateListener((obj: Object) => undefined)
        .addCreateListener((obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener('whereClause', (obj: { bar: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener('whereClause', (obj: { bar: string }) => undefined)
        .addCreateListener((obj: { bar: string }) => undefined)
        .addCreateListener((obj: { bar: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener<Person>('whereClause', (obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener<Person>('whereClause', (obj: Person) => undefined)
        .addCreateListener<Person>((obj: Person) => undefined)
        .addCreateListener<Person>((obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener<Person>('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener<Person>('whereClause', (obj: { foo: string }) => undefined)
        .addCreateListener<Person>((obj: { foo: string }) => undefined)
        .addCreateListener<Person>((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)

    eventHandler
        .removeCreateListeners('whereClause')
        .removeCreateListeners()
        .removeCreateListener<Person>((obj: Person) => undefined)
        .removeCreateListener<Person>((obj: { foo: string }) => undefined)

    eventHandler
        .addUpdateListener('whereClause', (obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener('whereClause', (obj: Object) => undefined)
        .addUpdateListener((obj: Object) => undefined)
        .addUpdateListener((obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener('whereClause', (obj: { foo: string }) => undefined)
        .addUpdateListener((obj: { foo: string }) => undefined)
        .addUpdateListener((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener<Person>('whereClause', (obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener<Person>('whereClause', (obj: Person) => undefined)
        .addUpdateListener<Person>((obj: Person) => undefined)
        .addUpdateListener<Person>((obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener<Person>('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener<Person>('whereClause', (obj: { foo: string }) => undefined)
        .addUpdateListener<Person>((obj: { foo: string }) => undefined)
        .addUpdateListener<Person>((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)

    eventHandler
        .removeUpdateListeners('whereClause')
        .removeUpdateListeners()
        .removeUpdateListener<Person>((obj: Person) => undefined)

    eventHandler
        .addDeleteListener('whereClause', (obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener('whereClause', (obj: Object) => undefined)
        .addDeleteListener((obj: Object) => undefined)
        .addDeleteListener((obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener('whereClause', (obj: { foo: string }) => undefined)
        .addDeleteListener((obj: { foo: string }) => undefined)
        .addDeleteListener((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener<Person>('whereClause', (obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener<Person>('whereClause', (obj: Person) => undefined)
        .addDeleteListener<Person>((obj: Person) => undefined)
        .addDeleteListener<Person>((obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener<Person>('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener<Person>('whereClause', (obj: { foo: string }) => undefined)
        .addDeleteListener<Person>((obj: { foo: string }) => undefined)
        .addDeleteListener<Person>((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)

    eventHandler
        .removeDeleteListeners('whereClause')
        .removeDeleteListeners()
        .removeDeleteListener<Person>((obj: Person) => undefined)

    eventHandler
        .addBulkCreateListener((list: string[]) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkCreateListener((list: string[]) => undefined)

    eventHandler
        .removeBulkCreateListener((list: string[]) => undefined)
        .removeBulkCreateListeners()

    eventHandler
        .addBulkUpdateListener('whereClause', (obj: Backendless.RTBulkChangesSubscriptionResult) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkUpdateListener('whereClause', (obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)
        .addBulkUpdateListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkUpdateListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)

    eventHandler
        .removeBulkUpdateListeners('whereClause')
        .removeBulkUpdateListeners()
        .removeBulkUpdateListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)

    eventHandler
        .addBulkDeleteListener('whereClause', (obj: Backendless.RTBulkChangesSubscriptionResult) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkDeleteListener('whereClause', (obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)
        .addBulkDeleteListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkDeleteListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)

    eventHandler
        .removeBulkDeleteListeners('whereClause')
        .removeBulkDeleteListeners()
        .removeBulkDeleteListener((obj: Backendless.RTBulkChangesSubscriptionResult) => undefined)

    eventHandler
        .removeAllListeners()
        .addDeleteListener('whereClause', (obj: Object) => undefined)
}

function RTChannel() {
    const channel: Backendless.ChannelClass = Backendless.Messaging.subscribe('channelName')

    let voidResult: void;
    let boolResult: boolean;

    voidResult = channel.join()
    voidResult = channel.leave()
    boolResult = channel.isJoined()

    channel
        .addConnectListener(() => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addConnectListener(() => undefined)
        .removeConnectListeners(() => undefined)
        .removeConnectListeners()
        .addMessageListener('selector', () => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addMessageListener('selector', () => undefined)
        .addMessageListener(() => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addMessageListener(() => undefined)
        .removeMessageListener('selector', () => undefined)
        .removeMessageListener(() => undefined)
        .removeMessageListeners('selector')
        .removeAllMessageListeners()
        .addCommandListener(() => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCommandListener(() => undefined)
        .removeCommandListener(() => undefined)
        .removeCommandListeners()
        .addUserStatusListener(() => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUserStatusListener(() => undefined)
        .removeUserStatusListener(() => undefined)
        .removeUserStatusListeners()
        .removeAllListeners()

    const promiseSend: Promise<void> = channel.send('MY_COMMAND', {foo: 'string', bar: []})

}

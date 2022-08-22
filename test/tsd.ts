/// <reference path="../backendless.d.ts" />

import Counter = Backendless.Counter;

function testMain() {
    const appId: string = Backendless.appId;
    const apiKey: string = Backendless.apiKey;
    const applicationId: string = Backendless.applicationId;
    const secretKey: string = Backendless.secretKey;
    const serverURL: string = Backendless.serverURL;
    const appPath: string = Backendless.appPath;
    const domain: string = Backendless.domain;
    const apiURI: string = Backendless.apiURI;
    const browser: { browser: string, version: string } = Backendless.browser;

    Backendless.domain = domain;
    Backendless.apiURI = apiURI;

    Backendless.initApp('APPLICATION_ID', 'JS_SECRET_KEY');
    Backendless.initApp({appId: 'APPLICATION_ID', apiKey: 'JS_SECRET_KEY'});
    Backendless.initApp({
        appId: 'APPLICATION_ID',
        apiKey: 'JS_SECRET_KEY',
        standalone: true,
        debugMode: true,
        useTableClassesFromGlobalScope: false,
        serverURL: 'serverURL'
    });

    Backendless.initApp('https://my-custom-domain.com')
    Backendless.initApp({domain: 'https://my-custom-domain.com', standalone: true})
}

function testLocalCache() {
    const key: string = 'key';
    const str: string = 'string';
    const obj: object = {};
    const arr: any[] = [];
    const num: number = 1234;
    const bol: boolean = true;
    const nul: any = null;

    const result2: void = Backendless.LocalCache.set(key);
    const result3: void = Backendless.LocalCache.set(key, obj);
    const result4: void = Backendless.LocalCache.set(key, arr);
    const result5: void = Backendless.LocalCache.set(key, num);
    const result6: void = Backendless.LocalCache.set(key, str);
    const result7: void = Backendless.LocalCache.set(key, nul);
    const result8: void = Backendless.LocalCache.set(key, bol);
    const result9: void = Backendless.LocalCache.remove(key);
    const result10: any = Backendless.LocalCache.get(key);
    const result11: string = Backendless.LocalCache.get<string>(key);
    const result12: boolean = Backendless.LocalCache.get<boolean>(key);
    const result13: number = Backendless.LocalCache.get<number>(key);
    const result14: object = Backendless.LocalCache.get<object>(key);
    const result15: string[] = Backendless.LocalCache.get<string[]>(key);
}

function testDataQueryBuilderClass() {
    let dataQuery: Backendless.DataQueryBuilder = new Backendless.DataQueryBuilder();
    dataQuery = Backendless.DataQueryBuilder.create();

    let str: string = 'str';
    let num: number = 123;
    let strs: string[] = ['abc', 'foo', 'bar']

    dataQuery = dataQuery.setPageSize(num);
    num = dataQuery.getPageSize();

    dataQuery = dataQuery.setOffset(num);
    num = dataQuery.getOffset();

    dataQuery = dataQuery.prepareNextPage();
    dataQuery = dataQuery.preparePreviousPage();

    dataQuery = dataQuery.setWhereClause(str);
    str = dataQuery.getWhereClause();

    dataQuery = dataQuery.setHavingClause(str);
    str = dataQuery.getHavingClause();

    dataQuery = dataQuery.setProperties('abc');
    dataQuery = dataQuery.setProperties(['abc', 'abc', 'abc']);
    dataQuery = dataQuery.addProperty(str);
    dataQuery = dataQuery.addProperties(str, str, str, str);
    dataQuery = dataQuery.addProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    dataQuery = dataQuery.addProperties(['abc', 'abc', 'abc'], str, str);
    dataQuery = dataQuery.addProperties(str);
    dataQuery = dataQuery.addProperties(['abc', 'abc', 'abc']);

    strs = dataQuery.getProperties();

    dataQuery = dataQuery.addAllProperties();

    dataQuery = dataQuery.excludeProperty(str);
    dataQuery = dataQuery.excludeProperties('abc');
    dataQuery = dataQuery.excludeProperties(['abc', 'abc', 'abc']);
    dataQuery = dataQuery.excludeProperties(str, str, str, str);
    dataQuery = dataQuery.excludeProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    dataQuery = dataQuery.excludeProperties(['abc', 'abc', 'abc'], str, str);
    dataQuery = dataQuery.excludeProperties(str);
    dataQuery = dataQuery.excludeProperties(['abc', 'abc', 'abc']);

    dataQuery = dataQuery.setSortBy(str);
    dataQuery = dataQuery.setSortBy(strs);
    strs = dataQuery.getSortBy();

    dataQuery = dataQuery.setGroupBy(str);
    dataQuery = dataQuery.setGroupBy(strs);
    strs = dataQuery.getGroupBy();

    dataQuery = dataQuery.setRelated(str);
    dataQuery = dataQuery.setRelated(strs);
    dataQuery = dataQuery.addRelated(str);
    dataQuery = dataQuery.addRelated(strs);
    strs = dataQuery.getRelated();

    dataQuery = dataQuery.setRelationsDepth(num);
    num = dataQuery.getRelationsDepth();

    dataQuery = dataQuery.setRelationsPageSize(num);
    num = dataQuery.getRelationsPageSize();

    dataQuery = dataQuery.setFileReferencePrefix(str);
    str = dataQuery.getFileReferencePrefix();

    const query: Backendless.DataQueryValueI = dataQuery.build();
}


function testDataJSONUpdateBuilder() {
    const JSONUpdateBuilder = Backendless.JSONUpdateBuilder

    let baseBuilder: Backendless.JSONUpdateBuilder
    let removeBuilder: Backendless.JSONRemoveBuilder

    class Person {
    }

    const prop: string = 'prop'
    const person: Person = new Person()
    const date: Date = new Date()

    let obj: object

    baseBuilder = JSONUpdateBuilder.SET()
        .addArgument(prop, 'str')
        .addArgument(prop, 123)
        .addArgument(prop, null)
        .addArgument(prop, true)
        .addArgument(prop, false)
        .addArgument(prop, {})
        .addArgument(prop, [])
        .addArgument(prop, person)
        .addArgument(prop, date)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()

    baseBuilder = JSONUpdateBuilder.INSERT()
        .addArgument(prop, 'str')
        .addArgument(prop, 123)
        .addArgument(prop, null)
        .addArgument(prop, true)
        .addArgument(prop, false)
        .addArgument(prop, {})
        .addArgument(prop, [])
        .addArgument(prop, person)
        .addArgument(prop, date)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()

    baseBuilder = JSONUpdateBuilder.REPLACE()
        .addArgument(prop, 'str')
        .addArgument(prop, 123)
        .addArgument(prop, null)
        .addArgument(prop, true)
        .addArgument(prop, false)
        .addArgument(prop, {})
        .addArgument(prop, [])
        .addArgument(prop, person)
        .addArgument(prop, date)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()

    removeBuilder = JSONUpdateBuilder.REMOVE()
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)
        .addArgument(prop)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()

    baseBuilder = removeBuilder

    baseBuilder = JSONUpdateBuilder.ARRAY_APPEND()
        .addArgument(prop, 'str')
        .addArgument(prop, 123)
        .addArgument(prop, null)
        .addArgument(prop, true)
        .addArgument(prop, false)
        .addArgument(prop, {})
        .addArgument(prop, [])
        .addArgument(prop, person)
        .addArgument(prop, date)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()

    baseBuilder = JSONUpdateBuilder.ARRAY_INSERT()
        .addArgument(prop, 'str')
        .addArgument(prop, 123)
        .addArgument(prop, null)
        .addArgument(prop, true)
        .addArgument(prop, false)
        .addArgument(prop, {})
        .addArgument(prop, [])
        .addArgument(prop, person)
        .addArgument(prop, date)

    obj = baseBuilder.toJSON()
    obj = baseBuilder.create()
}

function testLoadRelationsQueryBuilder() {
    let str: string = 'str';
    let num: number = 123;
    let strs: string[] = ['abc', 'foo', 'bar']

    let loadRelationsQueryBuilder: Backendless.LoadRelationsQueryBuilder;
    loadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setPageSize(num);
    num = loadRelationsQueryBuilder.getPageSize();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setOffset(num);
    num = loadRelationsQueryBuilder.getOffset();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.prepareNextPage();
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.preparePreviousPage();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setWhereClause(str);
    str = loadRelationsQueryBuilder.getWhereClause();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setHavingClause(str);
    str = loadRelationsQueryBuilder.getHavingClause();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setProperties('abc');
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setProperties(['abc', 'abc', 'abc']);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperty(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperties(str, str, str, str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperties(['abc', 'abc', 'abc'], str, str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperties(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addProperties(['abc', 'abc', 'abc']);

    strs = loadRelationsQueryBuilder.getProperties();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addAllProperties();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperty(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties('abc');
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(['abc', 'abc', 'abc']);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(str, str, str, str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(['abc', 'abc', 'abc'], str, str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.excludeProperties(['abc', 'abc', 'abc']);

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setSortBy(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setSortBy(strs);
    strs = loadRelationsQueryBuilder.getSortBy();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setGroupBy(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setGroupBy(strs);
    strs = loadRelationsQueryBuilder.getGroupBy();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setRelated(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setRelated(strs);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addRelated(str);
    loadRelationsQueryBuilder = loadRelationsQueryBuilder.addRelated(strs);
    strs = loadRelationsQueryBuilder.getRelated();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setRelationsDepth(num);
    num = loadRelationsQueryBuilder.getRelationsDepth();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setRelationsPageSize(num);
    num = loadRelationsQueryBuilder.getRelationsPageSize();

    loadRelationsQueryBuilder = loadRelationsQueryBuilder.setFileReferencePrefix(str);
    str = loadRelationsQueryBuilder.getFileReferencePrefix();

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

function testGroupQueryBuilder() {
    let str: string = 'str';
    let num: number = 123;
    let strs: string[] = ['abc', 'foo', 'bar']
    let obj: object = {}
    let objs: object[] = [{}, {}, {}]

    let groupQueryBuilder: Backendless.GroupQueryBuilder;
    groupQueryBuilder = Backendless.GroupQueryBuilder.create();

    groupQueryBuilder = groupQueryBuilder.setPageSize(num);
    num = groupQueryBuilder.getPageSize();

    groupQueryBuilder = groupQueryBuilder.setOffset(num);
    num = groupQueryBuilder.getOffset();

    groupQueryBuilder = groupQueryBuilder.prepareNextPage();
    groupQueryBuilder = groupQueryBuilder.preparePreviousPage();

    groupQueryBuilder = groupQueryBuilder.setWhereClause(str);
    str = groupQueryBuilder.getWhereClause();

    groupQueryBuilder = groupQueryBuilder.setProperties('abc');
    groupQueryBuilder = groupQueryBuilder.setProperties(['abc', 'abc', 'abc']);
    groupQueryBuilder = groupQueryBuilder.addProperty(str);
    groupQueryBuilder = groupQueryBuilder.addProperties(str, str, str, str);
    groupQueryBuilder = groupQueryBuilder.addProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    groupQueryBuilder = groupQueryBuilder.addProperties(['abc', 'abc', 'abc'], str, str);
    groupQueryBuilder = groupQueryBuilder.addProperties(str);
    groupQueryBuilder = groupQueryBuilder.addProperties(['abc', 'abc', 'abc']);

    strs = groupQueryBuilder.getProperties();

    groupQueryBuilder = groupQueryBuilder.addAllProperties();

    groupQueryBuilder = groupQueryBuilder.excludeProperty(str);
    groupQueryBuilder = groupQueryBuilder.excludeProperties('abc');
    groupQueryBuilder = groupQueryBuilder.excludeProperties(['abc', 'abc', 'abc']);
    groupQueryBuilder = groupQueryBuilder.excludeProperties(str, str, str, str);
    groupQueryBuilder = groupQueryBuilder.excludeProperties(['abc', 'abc', 'abc'], ['abc', 'abc', 'abc'], ['abc', 'abc', 'abc']);
    groupQueryBuilder = groupQueryBuilder.excludeProperties(['abc', 'abc', 'abc'], str, str);
    groupQueryBuilder = groupQueryBuilder.excludeProperties(str);
    groupQueryBuilder = groupQueryBuilder.excludeProperties(['abc', 'abc', 'abc']);

    groupQueryBuilder = groupQueryBuilder.setSortBy(str);
    groupQueryBuilder = groupQueryBuilder.setSortBy(strs);
    strs = groupQueryBuilder.getSortBy();

    groupQueryBuilder = groupQueryBuilder.setGroupBy(str);
    groupQueryBuilder = groupQueryBuilder.setGroupBy(strs);
    strs = groupQueryBuilder.getGroupBy();

    groupQueryBuilder = groupQueryBuilder.setRelated(str);
    groupQueryBuilder = groupQueryBuilder.setRelated(strs);
    groupQueryBuilder = groupQueryBuilder.addRelated(str);
    groupQueryBuilder = groupQueryBuilder.addRelated(strs);
    strs = groupQueryBuilder.getRelated();

    groupQueryBuilder = groupQueryBuilder.setRelationsDepth(num);
    num = groupQueryBuilder.getRelationsDepth();

    groupQueryBuilder = groupQueryBuilder.setRelationsPageSize(num);
    num = groupQueryBuilder.getRelationsPageSize();

    groupQueryBuilder = groupQueryBuilder.setGroupPageSize(num)
    num = groupQueryBuilder.getGroupPageSize()

    groupQueryBuilder = groupQueryBuilder.setRecordsPageSize(num)
    num = groupQueryBuilder.getRecordsPageSize()

    groupQueryBuilder = groupQueryBuilder.setGroupDepth(num)
    num = groupQueryBuilder.getGroupDepth()

    groupQueryBuilder = groupQueryBuilder.setGroupPath(obj)
    groupQueryBuilder = groupQueryBuilder.setGroupPath(objs)
    objs = groupQueryBuilder.getGroupPath()

    groupQueryBuilder = groupQueryBuilder.setFileReferencePrefix(str);
    str = groupQueryBuilder.getFileReferencePrefix();

    groupQueryBuilder.setRelated('relationColumn');
    groupQueryBuilder.setOffset(50);
    groupQueryBuilder.setPageSize(50);
    groupQueryBuilder.setSortBy('columnName');
    groupQueryBuilder.setSortBy(['columnName']);
    groupQueryBuilder.setProperties('columnName');
    groupQueryBuilder.setProperties(['columnName']);

    const properties: Array<string> = groupQueryBuilder.getProperties();
    const sortBy: Array<string> = groupQueryBuilder.getSortBy();
    const whereClause: string = groupQueryBuilder.getWhereClause();

    groupQueryBuilder = groupQueryBuilder.preparePreviousPage();
    groupQueryBuilder = groupQueryBuilder.prepareNextPage();
}

function testDataStoreClass() {
    const item: object = {};
    const dataStore: Backendless.DataStore = Backendless.Data.of('str');
    const dataStore2: Backendless.DataStore = Backendless.Data.of({});
    const dataStore3: Backendless.DataStore = Backendless.Data.of(function () {
    });

    const model: Function | object = dataStore.model;
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

    let resultObj: object;
    let resultNum: number;
    let promisePerson: Promise<Person>;
    let promisePersons: Promise<Person[]>;
    let promiseObject: Promise<object>;
    let promiseNum: Promise<number>;

    const dataQueryObject = {
        pageSize: 123,
        offset: 123,
        properties: ['p1', 'p2'],
        excludeProps: ['p1', 'p2'],
        where: 'foo=1',
        having: 'foo=1',
        sortBy: ['s1'],
        groupBy: ['s1'],
        relations: ['r1'],
        relationsDepth: 123,
        relationsPageSize: 123,
        fileReferencePrefix: '/',
    }

    const relationsDataQueryObject = {
        ...dataQueryObject,
        relationName: 'rel-name',
        relationModel: Person,
    }

    promiseObject = dataStore.save(item);
    promiseObject = dataStore.save(item, true);
    promiseObject = dataStore.save(item, false);
    promisePerson = dataStore.save<Person>(person);
    promisePerson = dataStore.save<Person>(person, true);
    promisePerson = dataStore.save<Person>(person, false);

    promiseObject = dataStore.deepSave(item);
    promisePerson = dataStore.deepSave<Person>(person);

    promiseObject = dataStore.remove('str');
    promiseObject = dataStore.remove(item);

    promiseObject = dataStore.find();
    promiseObject = dataStore.find(dataQueryBuilder);
    promiseObject = dataStore.find(dataQueryObject);
    promiseObject = dataStore.find({pageSize: 123, offset: 0});

    promisePersons = dataStore.find<Person>();
    promisePersons = dataStore.find<Person>(dataQueryBuilder);
    promisePersons = dataStore.find<Person>(dataQueryObject);
    promisePersons = dataStore.find<Person>({pageSize: 123, offset: 0});

    promiseObject = dataStore.findById('myId');
    promiseObject = dataStore.findById('myId', dataQueryBuilder);
    promiseObject = dataStore.findById('myId', dataQueryObject);
    promiseObject = dataStore.findById('myId', {properties: ['foo']});
    promiseObject = dataStore.findById({foo: 'myId'});
    promiseObject = dataStore.findById({foo: 'myId'}, dataQueryBuilder);
    promiseObject = dataStore.findById({foo: 'myId'}, {properties: ['foo']});

    promisePerson = dataStore.findById<Person>('myId');
    promisePerson = dataStore.findById<Person>('myId', dataQueryBuilder);
    promisePerson = dataStore.findById<Person>('myId', dataQueryObject);
    promisePerson = dataStore.findById<Person>('myId', {properties: ['foo']});
    promisePerson = dataStore.findById<Person>({foo: 'myId'});
    promisePerson = dataStore.findById<Person>({foo: 'myId'}, dataQueryBuilder);
    promisePerson = dataStore.findById<Person>({foo: 'myId'}, dataQueryBuilder);
    promisePerson = dataStore.findById<Person>({foo: 'myId'}, {properties: ['foo']});

    promiseObject = dataStore.findFirst();
    promiseObject = dataStore.findFirst(dataQueryBuilder);
    promiseObject = dataStore.findFirst(dataQueryObject);
    promiseObject = dataStore.findFirst({pageSize: 123});

    promisePerson = dataStore.findFirst<Person>();
    promisePerson = dataStore.findFirst<Person>(dataQueryBuilder);
    promisePerson = dataStore.findFirst<Person>(dataQueryObject);
    promisePerson = dataStore.findFirst<Person>({pageSize: 123});

    promiseObject = dataStore.findLast();
    promiseObject = dataStore.findLast(dataQueryBuilder);
    promiseObject = dataStore.findLast(dataQueryObject);
    promiseObject = dataStore.findLast({pageSize: 123});

    promisePerson = dataStore.findLast<Person>();
    promisePerson = dataStore.findLast<Person>(dataQueryBuilder);
    promisePerson = dataStore.findLast<Person>(dataQueryObject);
    promisePerson = dataStore.findLast<Person>({pageSize: 123});

    promiseObject = dataStore.loadRelations(parentTableName, loadRelationsQueryBuilder);
    promiseObject = dataStore.loadRelations(parentTableName, relationsDataQueryObject);
    promiseObject = dataStore.loadRelations(parentTableName, {relationName: 'rel1'});
    promiseObject = dataStore.loadRelations(parentTableName, {relationName: 'rel1', relationModel: Person});

    promisePersons = dataStore.loadRelations<Person>(parentTableName, loadRelationsQueryBuilder);
    promisePersons = dataStore.loadRelations<Person>(parentTableName, relationsDataQueryObject);
    promisePersons = dataStore.loadRelations<Person>(parentTableName, {relationName: 'rel1'});
    promisePersons = dataStore.loadRelations<Person>(parentTableName, {relationName: 'rel1', relationModel: Person});

    promiseNum = dataStore.getObjectCount();
    promiseNum = dataStore.getObjectCount('foo=123');
    promiseNum = dataStore.getObjectCount(dataQueryBuilder);

}

function testPersistence() {
    let resultObj: object;
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');
    let Model: Function;
    let promiseObject: Promise<object>;
    let promiseString: Promise<string>;

    promiseObject = Backendless.Data.save('model', {});
    promiseObject = Backendless.Data.save(dataStore, {});

    promiseObject = Backendless.Data.deepSave('model', {});
    promiseObject = Backendless.Data.deepSave(dataStore, {});

    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123, 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause');
    promiseObject = Backendless.Data.getView('viewName');

    dataStore = Backendless.Data.of(Model);
    dataStore = Backendless.Data.of('str');
    dataStore = Backendless.Data.of({});

    promiseObject = Backendless.Data.describe(Model);
    promiseObject = Backendless.Data.describe('str');
    promiseObject = Backendless.Data.describe({});

    promiseString = Backendless.Data.getTableNameById('str');

    Backendless.Data.mapTableToClass(Model);
    Backendless.Data.mapTableToClass('ClassName', Model);
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
    let resultObj: object;
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');
    let Model: Function;
    let promiseObject: Promise<object>;

    promiseObject = Backendless.Data.save('model', {});
    promiseObject = Backendless.Data.save(dataStore, {});

    promiseObject = Backendless.Data.deepSave('model', {});
    promiseObject = Backendless.Data.deepSave(dataStore, {});

    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123, 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause', 123);
    promiseObject = Backendless.Data.getView('viewName', 'whereClause');
    promiseObject = Backendless.Data.getView('viewName');

    dataStore = Backendless.Data.of(Model);
    dataStore = Backendless.Data.of('str');
    dataStore = Backendless.Data.of({});

    promiseObject = Backendless.Data.describe(Model);
    promiseObject = Backendless.Data.describe('str');
    promiseObject = Backendless.Data.describe({});
}

function testHive() {
    let dataHive: Backendless.Hive.DataHive = Backendless.Hive('hiveName');
    let baseStore: Backendless.Hive.hiveStore;
    let keyValueStore: Backendless.Hive.keyValueStore;
    let listStore: Backendless.Hive.listStore;
    let mapStore: Backendless.Hive.mapStore;
    let setStore: Backendless.Hive.setStore;
    let sortedSetStore: Backendless.Hive.sortedSetStore;
    let promiseVoid: Promise<void>;
    let promiseNumber: Promise<number>;

    let hiveNames: Array<string> = Backendless.Hive.getNames();

    promiseVoid = dataHive.create()
    promiseVoid = dataHive.rename('newHiveName')
    promiseNumber = dataHive.delete()

    baseStore = dataHive.KeyValueStore('storeName')
    keyValueStore = dataHive.KeyValueStore('storeName')

    baseStore = dataHive.ListStore('storeName')
    listStore = dataHive.ListStore('storeName')

    baseStore = dataHive.MapStore('storeName')
    mapStore = dataHive.MapStore('storeName')

    baseStore = dataHive.SetStore('storeName')
    setStore = dataHive.SetStore('storeName')

    baseStore = dataHive.SortedSetStore('storeName')
    sortedSetStore = dataHive.SortedSetStore('storeName')
}

function testHiveStores() {
    const str: string = 'str';
    const num: number = 123;
    const bool: boolean = false;
    const strArr: Array<string> = ['str1', 'str2'];
    const obj: object = {x: 1, y: 2};

    let promiseVoid: Promise<void>;
    let promiseObject: Promise<object>;
    let promiseNumber: Promise<number>;
    let promiseString: Promise<string>;
    let promiseBoolean: Promise<boolean>;

    let promiseListOfString: Promise<string[]>;
    let promiseListOfStringOrNull: Promise<string[] | null>;

    let promiseStringOrNull: Promise<string | null>;

    let storeKeysOptions: Backendless.Hive.StoreKeysOptionsI;
    let promiseStoreKeysResult: Promise<Backendless.Hive.StoreKeysResultI>;

    function testKeyValueStore() {
        function testGeneralStatic() {
            promiseStoreKeysResult = Backendless.Hive(str).KeyValueStore.keys();
            promiseStoreKeysResult = Backendless.Hive(str).KeyValueStore.keys(storeKeysOptions);

            promiseNumber = Backendless.Hive(str).KeyValueStore.delete(strArr);
            promiseNumber = Backendless.Hive(str).KeyValueStore.exists(strArr);
            promiseNumber = Backendless.Hive(str).KeyValueStore.touch(strArr);
        }

        function testGeneralInstance() {
            promiseNumber = Backendless.Hive(str).KeyValueStore(str).delete();

            promiseBoolean = Backendless.Hive(str).KeyValueStore(str).exists();

            promiseString = Backendless.Hive(str).KeyValueStore(str).rename(str);
            promiseBoolean = Backendless.Hive(str).KeyValueStore(str).renameIfNotExists(str);

            promiseBoolean = Backendless.Hive(str).KeyValueStore(str).expireAfter(num);
            promiseBoolean = Backendless.Hive(str).KeyValueStore(str).expireAt(num);

            promiseNumber = Backendless.Hive(str).KeyValueStore(str).getExpiration();
            promiseBoolean = Backendless.Hive(str).KeyValueStore(str).removeExpiration();

            promiseVoid = Backendless.Hive(str).KeyValueStore(str).touch();
        }

        function testStatic() {
            let setKeyOptions: Backendless.Hive.KeyValueSetKeyOptionsI;

            promiseObject = Backendless.Hive(str).KeyValueStore.get(strArr);

            promiseString = Backendless.Hive(str).KeyValueStore.set(obj);
            promiseString = Backendless.Hive(str).KeyValueStore.set(str, str);
            promiseString = Backendless.Hive(str).KeyValueStore.set(str, str, setKeyOptions);
        }

        function testInstance() {
            promiseStringOrNull = Backendless.Hive(str).KeyValueStore(str).get();

            promiseString = Backendless.Hive(str).KeyValueStore(str).set(str);

            promiseNumber = Backendless.Hive(str).KeyValueStore(str).increment(num);
            promiseNumber = Backendless.Hive(str).KeyValueStore(str).decrement(num);
        }
    }

    function testListStore() {
        function testGeneralStatic() {
            promiseStoreKeysResult = Backendless.Hive(str).ListStore.keys();
            promiseStoreKeysResult = Backendless.Hive(str).ListStore.keys(storeKeysOptions);

            promiseNumber = Backendless.Hive(str).ListStore.delete(strArr);
            promiseNumber = Backendless.Hive(str).ListStore.exists(strArr);
            promiseNumber = Backendless.Hive(str).ListStore.touch(strArr);
        }

        function testGeneralInstance() {
            promiseNumber = Backendless.Hive(str).ListStore(str).delete();

            promiseBoolean = Backendless.Hive(str).ListStore(str).exists();

            promiseString = Backendless.Hive(str).ListStore(str).rename(str);
            promiseBoolean = Backendless.Hive(str).ListStore(str).renameIfNotExists(str);

            promiseBoolean = Backendless.Hive(str).ListStore(str).expireAfter(num);
            promiseBoolean = Backendless.Hive(str).ListStore(str).expireAt(num);

            promiseNumber = Backendless.Hive(str).ListStore(str).getExpiration();
            promiseBoolean = Backendless.Hive(str).ListStore(str).removeExpiration();

            promiseVoid = Backendless.Hive(str).ListStore(str).touch();
        }

        function testInstance() {
            promiseListOfString = Backendless.Hive(str).ListStore(str).get();
            promiseStringOrNull = Backendless.Hive(str).ListStore(str).get(num);
            promiseListOfString = Backendless.Hive(str).ListStore(str).get(num, num);

            promiseNumber = Backendless.Hive(str).ListStore(str).set([str, str]);
            promiseString = Backendless.Hive(str).ListStore(str).set(str, num);

            promiseNumber = Backendless.Hive(str).ListStore(str).insert(str, str);
            promiseNumber = Backendless.Hive(str).ListStore(str).insert(str, str, bool);

            promiseNumber = Backendless.Hive(str).ListStore(str).addFirst(str);
            promiseNumber = Backendless.Hive(str).ListStore(str).addFirst(strArr);

            promiseNumber = Backendless.Hive(str).ListStore(str).addLast(str);
            promiseNumber = Backendless.Hive(str).ListStore(str).addLast(strArr);

            promiseStringOrNull = Backendless.Hive(str).ListStore(str).removeFirst();
            promiseListOfStringOrNull = Backendless.Hive(str).ListStore(str).removeFirst(num);

            promiseStringOrNull = Backendless.Hive(str).ListStore(str).removeLast();
            promiseListOfStringOrNull = Backendless.Hive(str).ListStore(str).removeLast(num);

            promiseNumber = Backendless.Hive(str).ListStore(str).removeValue(str);
            promiseNumber = Backendless.Hive(str).ListStore(str).removeValue(str, num);
        }
    }

    function testMapStore() {
        function testGeneralStatic() {
            promiseStoreKeysResult = Backendless.Hive(str).MapStore.keys();
            promiseStoreKeysResult = Backendless.Hive(str).MapStore.keys(storeKeysOptions);

            promiseNumber = Backendless.Hive(str).MapStore.delete(strArr);
            promiseNumber = Backendless.Hive(str).MapStore.exists(strArr);
            promiseNumber = Backendless.Hive(str).MapStore.touch(strArr);
        }

        function testGeneralInstance() {
            promiseNumber = Backendless.Hive(str).MapStore(str).delete();

            promiseBoolean = Backendless.Hive(str).MapStore(str).exists();

            promiseString = Backendless.Hive(str).MapStore(str).rename(str);
            promiseBoolean = Backendless.Hive(str).MapStore(str).renameIfNotExists(str);

            promiseBoolean = Backendless.Hive(str).MapStore(str).expireAfter(num);
            promiseBoolean = Backendless.Hive(str).MapStore(str).expireAt(num);

            promiseNumber = Backendless.Hive(str).MapStore(str).getExpiration();
            promiseBoolean = Backendless.Hive(str).MapStore(str).removeExpiration();

            promiseVoid = Backendless.Hive(str).MapStore(str).touch();
        }

        function testInstance() {
            promiseObject = Backendless.Hive(str).MapStore(str).get();
            promiseObject = Backendless.Hive(str).MapStore(str).get(str);
            promiseObject = Backendless.Hive(str).MapStore(str).get(strArr);

            promiseStringOrNull = Backendless.Hive(str).MapStore(str).getValue(str);

            promiseBoolean = Backendless.Hive(str).MapStore(str).keyExists(str);

            promiseNumber = Backendless.Hive(str).MapStore(str).length();

            promiseListOfString = Backendless.Hive(str).MapStore(str).keys();
            promiseListOfString = Backendless.Hive(str).MapStore(str).values();

            promiseNumber = Backendless.Hive(str).MapStore(str).set(obj);

            promiseNumber = Backendless.Hive(str).MapStore(str).add(obj);

            promiseBoolean = Backendless.Hive(str).MapStore(str).setValue(str, str);
            promiseBoolean = Backendless.Hive(str).MapStore(str).setValue(str, str, bool);

            promiseNumber = Backendless.Hive(str).MapStore(str).increment(str);
            promiseNumber = Backendless.Hive(str).MapStore(str).increment(str, num);

            promiseNumber = Backendless.Hive(str).MapStore(str).deleteKeys(str);
            promiseNumber = Backendless.Hive(str).MapStore(str).deleteKeys(strArr);
        }
    }

    function testSetStore() {
        function testGeneralStatic() {
            promiseStoreKeysResult = Backendless.Hive(str).SetStore.keys();
            promiseStoreKeysResult = Backendless.Hive(str).SetStore.keys(storeKeysOptions);

            promiseNumber = Backendless.Hive(str).SetStore.delete(strArr);
            promiseNumber = Backendless.Hive(str).SetStore.exists(strArr);
            promiseNumber = Backendless.Hive(str).SetStore.touch(strArr);
        }

        function testGeneralInstance() {
            promiseNumber = Backendless.Hive(str).SetStore(str).delete();

            promiseBoolean = Backendless.Hive(str).SetStore(str).exists();

            promiseString = Backendless.Hive(str).SetStore(str).rename(str);
            promiseBoolean = Backendless.Hive(str).SetStore(str).renameIfNotExists(str);

            promiseBoolean = Backendless.Hive(str).SetStore(str).expireAfter(num);
            promiseBoolean = Backendless.Hive(str).SetStore(str).expireAt(num);

            promiseNumber = Backendless.Hive(str).SetStore(str).getExpiration();
            promiseBoolean = Backendless.Hive(str).SetStore(str).removeExpiration();

            promiseVoid = Backendless.Hive(str).SetStore(str).touch();
        }

        function testStatic() {
            promiseListOfString = Backendless.Hive(str).SetStore.difference(strArr);
            promiseListOfString = Backendless.Hive(str).SetStore.intersection(strArr);
            promiseListOfString = Backendless.Hive(str).SetStore.union(strArr);
        }

        function testInstance() {
            promiseListOfString = Backendless.Hive(str).SetStore(str).get();

            promiseListOfString = Backendless.Hive(str).SetStore(str).getRandom();
            promiseListOfString = Backendless.Hive(str).SetStore(str).getRandom(num);

            promiseListOfString = Backendless.Hive(str).SetStore(str).getRandomAndDelete();
            promiseListOfString = Backendless.Hive(str).SetStore(str).getRandomAndDelete(num);

            promiseNumber = Backendless.Hive(str).SetStore(str).set(str);
            promiseNumber = Backendless.Hive(str).SetStore(str).set(strArr);

            promiseNumber = Backendless.Hive(str).SetStore(str).add(str);
            promiseNumber = Backendless.Hive(str).SetStore(str).add(strArr);

            promiseNumber = Backendless.Hive(str).SetStore(str).removeValues(str);
            promiseNumber = Backendless.Hive(str).SetStore(str).removeValues(strArr);

            promiseBoolean = Backendless.Hive(str).SetStore(str).isMember(str);
        }
    }

    function testSortedSetStore() {
        function testGeneralStatic() {
            promiseStoreKeysResult = Backendless.Hive(str).SortedSetStore.keys();
            promiseStoreKeysResult = Backendless.Hive(str).SortedSetStore.keys(storeKeysOptions);

            promiseNumber = Backendless.Hive(str).SortedSetStore.delete(strArr);
            promiseNumber = Backendless.Hive(str).SortedSetStore.exists(strArr);
            promiseNumber = Backendless.Hive(str).SortedSetStore.touch(strArr);
        }

        function testGeneralInstance() {
            promiseNumber = Backendless.Hive(str).SortedSetStore(str).delete();

            promiseBoolean = Backendless.Hive(str).SortedSetStore(str).exists();

            promiseString = Backendless.Hive(str).SortedSetStore(str).rename(str);
            promiseBoolean = Backendless.Hive(str).SortedSetStore(str).renameIfNotExists(str);

            promiseBoolean = Backendless.Hive(str).SortedSetStore(str).expireAfter(num);
            promiseBoolean = Backendless.Hive(str).SortedSetStore(str).expireAt(num);

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).getExpiration();
            promiseBoolean = Backendless.Hive(str).SortedSetStore(str).removeExpiration();

            promiseVoid = Backendless.Hive(str).SortedSetStore(str).touch();
        }

        function testStatic() {
            promiseListOfString = Backendless.Hive(str).SortedSetStore.difference(strArr);
            promiseListOfString = Backendless.Hive(str).SortedSetStore.intersection(strArr);
            promiseListOfString = Backendless.Hive(str).SortedSetStore.union(strArr);
        }

        function testInstance() {
            let itemOptions: Backendless.Hive.SortedSetItemOptionsI;
            let itemsList: [Backendless.Hive.SortedSetItem]
            let promiseItemsList: Promise<Array<Backendless.Hive.SortedSetItem>>
            let bound: Backendless.Hive.SortedSetBound

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).add(itemsList)
            promiseNumber = Backendless.Hive(str).SortedSetStore(str).add(itemsList, itemOptions)

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).set(itemsList)
            promiseNumber = Backendless.Hive(str).SortedSetStore(str).set(itemsList, itemOptions)

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).incrementScore(str, num)

            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getAndRemoveMaxScore()
            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getAndRemoveMaxScore(num)

            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getAndRemoveMinScore()
            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getAndRemoveMinScore(num)

            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRandom()
            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRandom({count: num, withScores: bool})
            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRandom({withScores: false})
            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getRandom({withScores: true})

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).getScore(str)

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).getRank(str)
            promiseNumber = Backendless.Hive(str).SortedSetStore(str).getRank(str, true)

            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRangeByRank(num, num)
            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRangeByRank(num, num, {
                withScores: bool,
                reverse: bool
            })
            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRangeByRank(num, num, {
                withScores: false,
            })
            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getRangeByRank(num, num, {
                withScores: true,
            })

            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRangeByScore({
                minScore: num,
                maxScore: num,
                minBound: bound,
                maxBound: bound,
                offset: num,
                count: num,
                reverse: bool,
                withScores: bool
            })
            promiseItemsList = Backendless.Hive(str).SortedSetStore(str).getRangeByScore({
                withScores: true
            })
            promiseListOfString = Backendless.Hive(str).SortedSetStore(str).getRangeByScore({
                withScores: false
            })

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).removeValues(str)
            promiseNumber = Backendless.Hive(str).SortedSetStore(str).removeValues(strArr)

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).removeValuesByRank(num, num)

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).removeValuesByScore({
                minScore: num,
                maxScore: num,
                minBound: bound,
                maxBound: bound
            })

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).length()

            promiseNumber = Backendless.Hive(str).SortedSetStore(str).countBetweenScores({
                minScore: num,
                maxScore: num,
                minBound: bound,
                maxBound: bound
            })
        }
    }
}

function testBulkOperations() {
    let dataStore: Backendless.DataStore = Backendless.Data.of('str');

    let resultPromiseListOfString: Promise<Array<string>>;
    let resultListOfString: Array<string>;

    let resultPromiseString: Promise<string>;
    let resultString: string;

    resultPromiseListOfString = dataStore.bulkCreate([{}, {}, {}]);

    resultPromiseListOfString = dataStore.bulkUpsert([{}, {}, {}]);

    resultPromiseString = dataStore.bulkUpdate('where clause string', {foo: 'bar'});

    resultPromiseString = dataStore.bulkDelete('where clause string');
    resultPromiseString = dataStore.bulkDelete(['objectId1', 'objectId2', 'objectId3']);
    resultPromiseString = dataStore.bulkDelete([{objectId: 'objectId1'}]);
    resultPromiseString = dataStore.bulkDelete([{objectId: 'objectId1', foo: 'bar'}]);
}

function testDataPermissions() {
    const userId: string = 'userId';
    const roleName: string = 'myRole';
    const dataObj: Backendless.ExistDataItemI = {___class: 'myClass', objectId: 'myId'};
    let resultObj: Backendless.ExistDataItemI;
    let promiseObject: Promise<object>;

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
    const userId: string = 'userId';
    const stayLoggedIn: boolean = true;
    const reload: boolean = true;
    const div: HTMLElement = document.createElement('div');
    let newUser: Backendless.User = new Backendless.User();
    let guestUser: Backendless.User = new Backendless.User();
    let resultStr: string;
    let resultObj: object;
    let resultVoid: void;
    let resultNull: null;
    let resultUndefined: null;
    let resultListOfString: string[];
    let resultListOfObjects: object[];
    let promiseObject: Promise<object>;
    let promiseBool: Promise<boolean>;
    let promiseListOfString: Promise<string[]>;
    let promiseListOfObject: Promise<object[]>;
    let promiseVoid: Promise<void>;
    let promiseString: Promise<string>
    let promiseBLUser: Promise<Backendless.User>;

    class CustomUser {
    }

    let promiseUsersList: Promise<Backendless.User[]>
    let promiseCustomUsersList: Promise<CustomUser[]>

    const dataQueryBuilder: Backendless.DataQueryBuilder = Backendless.DataQueryBuilder.create();

    let customUser = new CustomUser()
    let promiseCustomUser: Promise<CustomUser>;

    const restUrl: string = Backendless.UserService.restUrl;
    const loggedInUser: boolean = Backendless.UserService.loggedInUser();

    newUser = Backendless.UserService.currentUser
    customUser = Backendless.UserService.currentUser
    guestUser = Backendless.UserService.currentUser

    promiseVoid = Backendless.UserService.restorePassword('email');

    resultStr = Backendless.UserService.Utils.getClientUserLocale();

    promiseObject = Backendless.UserService.register(newUser);

    promiseListOfString = Backendless.UserService.getUserRoles();
    promiseListOfString = Backendless.UserService.getUserRoles('test-user-id');

    promiseVoid = Backendless.UserService.assignRole(identity, roleName);

    promiseVoid = Backendless.UserService.unassignRole(identity, roleName);

    promiseObject = Backendless.UserService.login(userId);
    promiseObject = Backendless.UserService.login(userId, stayLoggedIn);

    promiseObject = Backendless.UserService.login(userName, password);
    promiseObject = Backendless.UserService.login(userName, password, stayLoggedIn);

    promiseObject = Backendless.UserService.loginAsGuest();
    promiseObject = Backendless.UserService.loginAsGuest(stayLoggedIn);

    promiseListOfObject = Backendless.UserService.describeUserClass();

    promiseVoid = Backendless.UserService.logout();

    promiseObject = Backendless.UserService.getCurrentUser();
    promiseObject = Backendless.UserService.getCurrentUser(reload);
    promiseCustomUser = Backendless.UserService.getCurrentUser<CustomUser>();
    promiseCustomUser = Backendless.UserService.getCurrentUser<CustomUser>(reload);

    newUser = Backendless.UserService.setCurrentUser({});
    newUser = Backendless.UserService.setCurrentUser(customUser);
    newUser = Backendless.UserService.setCurrentUser(newUser);
    newUser = Backendless.UserService.setCurrentUser(newUser, stayLoggedIn);

    customUser = Backendless.UserService.setCurrentUser<CustomUser>({});
    customUser = Backendless.UserService.setCurrentUser<CustomUser>(customUser);
    customUser = Backendless.UserService.setCurrentUser<CustomUser>(newUser);
    customUser = Backendless.UserService.setCurrentUser<CustomUser>(newUser, stayLoggedIn);

    promiseObject = Backendless.UserService.update(newUser);

    promiseVoid = Backendless.UserService.loginWithFacebook();
    promiseVoid = Backendless.UserService.loginWithFacebook({});
    promiseVoid = Backendless.UserService.loginWithFacebook({}, {});
    promiseVoid = Backendless.UserService.loginWithFacebook({}, {}, stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithFacebook({}, null, stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithFacebook(null, null, stayLoggedIn);

    promiseVoid = Backendless.UserService.loginWithGooglePlus();
    promiseVoid = Backendless.UserService.loginWithGooglePlus({});
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {});
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div'));
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, document.createElement('div'), stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, {}, null, stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithGooglePlus({}, null, null, stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithGooglePlus(null, null, null, stayLoggedIn);

    promiseVoid = Backendless.UserService.loginWithTwitter();
    promiseVoid = Backendless.UserService.loginWithTwitter({});
    promiseVoid = Backendless.UserService.loginWithTwitter({}, stayLoggedIn);
    promiseVoid = Backendless.UserService.loginWithTwitter(null, stayLoggedIn);

    promiseBLUser = Backendless.UserService.loginWithFacebookSdk('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk('accessToken', {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk<Backendless.User>('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithFacebookSdk<Backendless.User>('accessToken', {}, stayLoggedIn);
    promiseCustomUser = Backendless.UserService.loginWithFacebookSdk<CustomUser>('accessToken', {});
    promiseCustomUser = Backendless.UserService.loginWithFacebookSdk<CustomUser>('accessToken', {}, stayLoggedIn);

    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk('accessToken', {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk<Backendless.User>('accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithGooglePlusSdk<Backendless.User>('accessToken', {}, stayLoggedIn);
    promiseCustomUser = Backendless.UserService.loginWithGooglePlusSdk<CustomUser>('accessToken', {});
    promiseCustomUser = Backendless.UserService.loginWithGooglePlusSdk<CustomUser>('accessToken', {}, stayLoggedIn);

    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken');
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', {});
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', guestUser);
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', guestUser, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', guestUser, {});
    promiseBLUser = Backendless.UserService.loginWithOauth2('facebook', 'accessToken', guestUser, {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth2<Backendless.User>('facebook', 'accessToken', guestUser, {});
    promiseBLUser = Backendless.UserService.loginWithOauth2<Backendless.User>('facebook', 'accessToken', guestUser, {}, stayLoggedIn);
    promiseCustomUser = Backendless.UserService.loginWithOauth2<CustomUser>('facebook', 'accessToken', guestUser, {});
    promiseCustomUser = Backendless.UserService.loginWithOauth2<CustomUser>('facebook', 'accessToken', guestUser, {}, stayLoggedIn);

    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret');
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', {});
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', guestUser);
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', guestUser, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', guestUser, {});
    promiseBLUser = Backendless.UserService.loginWithOauth1('twitter', 'accessToken', 'accessTokenSecret', guestUser, {}, stayLoggedIn);
    promiseBLUser = Backendless.UserService.loginWithOauth1<Backendless.User>('twitter', 'accessToken', 'accessTokenSecret', guestUser, {});
    promiseBLUser = Backendless.UserService.loginWithOauth1<Backendless.User>('twitter', 'accessToken', 'accessTokenSecret', guestUser, {}, stayLoggedIn);
    promiseCustomUser = Backendless.UserService.loginWithOauth1<CustomUser>('twitter', 'accessToken', 'accessTokenSecret', guestUser, {});
    promiseCustomUser = Backendless.UserService.loginWithOauth1<CustomUser>('twitter', 'accessToken', 'accessTokenSecret', guestUser, {}, stayLoggedIn);

    promiseBool = Backendless.UserService.isValidLogin();

    promiseBool = Backendless.UserService.verifyPassword('valid-password');

    promiseVoid = Backendless.UserService.resendEmailConfirmation('email');
    promiseVoid = Backendless.UserService.resendEmailConfirmation(1234);

    promiseObject = Backendless.UserService.createEmailConfirmationURL('email');
    promiseObject = Backendless.UserService.createEmailConfirmationURL(1234);

    promiseVoid = Backendless.UserService.enableUser(userId);

    promiseVoid = Backendless.UserService.disableUser(userId);

    promiseString = Backendless.UserService.getAuthorizationUrlLink('google', {email: 'userEmail'}, 'email;photo', false, 'https://foo', 'foo.bar');
    promiseString = Backendless.UserService.getAuthorizationUrlLink('google', {email: 'userEmail'}, 'email;photo', false);
    promiseString = Backendless.UserService.getAuthorizationUrlLink('google', null, null, true);
    promiseString = Backendless.UserService.getAuthorizationUrlLink('google');
    promiseString = Backendless.UserService.getAuthorizationUrlLink('google', null, null, false, 'url');
    promiseString = Backendless.UserService.getAuthorizationUrlLink('google', null, null, false, null, 'foo.bar');

    promiseUsersList = Backendless.UserService.findByRole(roleName);
    promiseUsersList = Backendless.UserService.findByRole(roleName, true);
    promiseUsersList = Backendless.UserService.findByRole(roleName, true, {});
    promiseUsersList = Backendless.UserService.findByRole(roleName, true, dataQueryBuilder);
    promiseUsersList = Backendless.UserService.findByRole(roleName, true, {pageSize: 123, offset: 0});
    promiseUsersList = Backendless.UserService.findByRole(roleName, null, {});
    promiseUsersList = Backendless.UserService.findByRole(roleName, null, dataQueryBuilder);
    promiseUsersList = Backendless.UserService.findByRole(roleName, null, {pageSize: 123, offset: 0});

    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName);
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, true);
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, true, {});
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, true, dataQueryBuilder);
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, true, {pageSize: 123, offset: 0});
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, null, {});
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, null, dataQueryBuilder);
    promiseUsersList = Backendless.UserService.findByRole<Backendless.User>(roleName, null, {pageSize: 123, offset: 0});

    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName);
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, true);
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, true, {});
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, true, dataQueryBuilder);
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, true, {pageSize: 123, offset: 0});
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, null, {});
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, null, dataQueryBuilder);
    promiseCustomUsersList = Backendless.UserService.findByRole<CustomUser>(roleName, null, {pageSize: 123, offset: 0});
}

function testEmailEnvelope() {
    let addresses: string[];
    let query: string;
    let uniqueEmails: boolean;
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
    envelopeObject = envelopeObject.setUniqueEmails(true);
    uniqueEmails = envelopeObject.getUniqueEmails();
}

function testMessaging() {
    const channelName: string = 'str';
    const deviceToken: string = 'str';
    const subject: string = 'str';
    const messageId: string = 'str';
    const message: string | object = 'str';
    let promiseObject: Promise<object>;
    let promiseBoolean: Promise<boolean>;
    const bodyParts: Backendless.Bodyparts = new Backendless.Bodyparts();
    const envelopeObject: Backendless.EmailEnvelope = new Backendless.EmailEnvelope();
    const templateValues: object | Backendless.EmailEnvelope = {};
    const templateName: string = 'str';
    const recipients: string[] = ['str'];
    const attachments: string[] = ['str'];
    const channels: string[] = ['str'];
    const expiration: number | Date = 123;
    const publishOptions: Backendless.PublishOptions = new Backendless.PublishOptions();
    const deliveryOptions: Backendless.DeliveryOptions = new Backendless.DeliveryOptions();

    let channel: Backendless.ChannelClass;
    const subscriptionCallback = function (data: object): void {
        const messagesArray: Array<String> = data["messages"];
    };

    channel = Backendless.Messaging.subscribe(channelName);

    promiseObject = Backendless.Messaging.publish(channelName, message, publishOptions, deliveryOptions);

    promiseObject = Backendless.Messaging.sendEmail(subject, bodyParts, recipients, attachments);

    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject, templateValues, attachments);

    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject, templateValues);

    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject, attachments);

    promiseObject = Backendless.Messaging.sendEmailFromTemplate(templateName, envelopeObject);

    promiseBoolean = Backendless.Messaging.cancel(messageId);

    promiseObject = Backendless.Messaging.registerDevice(deviceToken, channels, expiration);

    promiseObject = Backendless.Messaging.getRegistrations();

    promiseObject = Backendless.Messaging.unregisterDevice();

    promiseObject = Backendless.Messaging.getPushTemplates('ios');

    promiseObject = Backendless.Messaging.pushWithTemplate('templateName');
    promiseObject = Backendless.Messaging.pushWithTemplate('templateName', {foo: 'bar'});
}

async function testFilesService() {
    const fs = require('fs')

    const path: string = 'str';
    const dirPath: string = 'str';
    const filePath: string = 'str';
    const fileName: string = 'str';
    const fileBlobContent: Blob = new Blob();
    const fileBufferContent: Buffer = Buffer.from('text');
    const fileTextContent: string = 'str';
    const pattern: string = 'str';
    const sub: boolean = true;
    const pageSize: number = 123;
    const offset: number = 123;
    const overwrite: boolean = true;
    let file: File;
    const oldPathName: string = 'str';
    const newName: string = 'str';
    const sourcePath: string = 'str';
    const targetPath: string = 'str';
    const fileURL: string = 'str';
    const sourceFileURL: string = 'str';
    const userid: string = 'str';
    const url: string = 'str';
    const permissionType: string = 'str';
    const roleName: string = 'str';
    const countDirectories: boolean = true;
    const readStream = fs.createReadStream('./test');

    let resultStr: string;
    let resultBool: boolean;
    let resultObj: object;
    let resultNumber: number;
    let promiseString: Promise<string>;
    let promiseObject: Promise<object>;
    let promiseBoolean: Promise<boolean>;
    let promiseNumber: Promise<number>;

    interface IFileUploadResult {
        fileURL: string
    }

    let promiseIFileUploadResult: Promise<IFileUploadResult>;

    resultStr = Backendless.Files.restUrl;

    promiseString = Backendless.Files.saveFile(path, fileName, fileBlobContent, overwrite);
    promiseString = Backendless.Files.saveFile(path, fileName, fileBufferContent, overwrite);
    promiseString = Backendless.Files.saveFile(path, fileName, fileBlobContent);
    promiseString = Backendless.Files.saveFile(path, fileName, fileBufferContent);
    promiseString = Backendless.Files.saveFile(path, fileName, fileTextContent);
    promiseString = Backendless.Files.saveFile(path, fileName, fileTextContent, overwrite);

    const {fileURL: string} = await Backendless.Files.upload(file, path);

    promiseIFileUploadResult = Backendless.Files.upload(file, path);
    promiseIFileUploadResult = Backendless.Files.upload(file, path, overwrite);
    promiseIFileUploadResult = Backendless.Files.upload(file, path, null);

    promiseIFileUploadResult = Backendless.Files.upload(readStream, path);
    promiseIFileUploadResult = Backendless.Files.upload(readStream, path, overwrite);
    promiseIFileUploadResult = Backendless.Files.upload(readStream, path, null);

    promiseIFileUploadResult = Backendless.Files.upload(sourceFileURL, path);
    promiseIFileUploadResult = Backendless.Files.upload(sourceFileURL, path, overwrite);
    promiseIFileUploadResult = Backendless.Files.upload(sourceFileURL, path, null);

    promiseString = Backendless.Files.append(dirPath, fileName, sourceFileURL);
    promiseString = Backendless.Files.append(dirPath, fileName, readStream);
    promiseString = Backendless.Files.append(dirPath, fileName, fileBlobContent);
    promiseString = Backendless.Files.append(dirPath, fileName, fileBufferContent);
    promiseString = Backendless.Files.append(dirPath, fileName, new ArrayBuffer(8));
    promiseString = Backendless.Files.append(dirPath, fileName, new Int32Array(new ArrayBuffer(8)));
    promiseString = Backendless.Files.append(dirPath, fileName, [1, 2, 3]);

    promiseString = Backendless.Files.append(filePath, sourceFileURL);
    promiseString = Backendless.Files.append(filePath, readStream);
    promiseString = Backendless.Files.append(filePath, fileBlobContent);
    promiseString = Backendless.Files.append(filePath, fileBufferContent);
    promiseString = Backendless.Files.append(filePath, new ArrayBuffer(8));
    promiseString = Backendless.Files.append(filePath, new Int32Array(new ArrayBuffer(8)));
    promiseString = Backendless.Files.append(filePath, [1, 2, 3]);

    promiseString = Backendless.Files.appendText(dirPath, fileName, fileTextContent);
    promiseString = Backendless.Files.appendText(filePath, fileTextContent);

    promiseObject = Backendless.Files.listing(path);
    promiseObject = Backendless.Files.listing(path, pattern);
    promiseObject = Backendless.Files.listing(path, pattern, sub);
    promiseObject = Backendless.Files.listing(path, pattern, sub, pageSize);
    promiseObject = Backendless.Files.listing(path, pattern, sub, pageSize, offset);

    promiseNumber = Backendless.Files.getFileCount(path);
    promiseNumber = Backendless.Files.getFileCount(path, pattern);
    promiseNumber = Backendless.Files.getFileCount(path, pattern, sub);
    promiseNumber = Backendless.Files.getFileCount(path, pattern, sub, countDirectories);

    promiseObject = Backendless.Files.renameFile(oldPathName, newName);

    promiseObject = Backendless.Files.moveFile(sourcePath, targetPath);

    promiseObject = Backendless.Files.copyFile(sourcePath, targetPath);

    promiseNumber = Backendless.Files.remove(fileURL);

    promiseObject = Backendless.Files.exists(path);

    promiseNumber = Backendless.Files.removeDirectory(path);

    promiseBoolean = Backendless.Files.Permissions.READ.grantUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.READ.grantRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyRole(roleName, url);

    promiseBoolean = Backendless.Files.Permissions.DELETE.grantUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.grantRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyRole(roleName, url);

    promiseBoolean = Backendless.Files.Permissions.WRITE.grantUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.grantRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyRole(roleName, url);

    promiseBoolean = Backendless.Files.Permissions.READ.grantForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.READ.grantForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.READ.grantForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.READ.grantForAllRoles(url);
    promiseBoolean = Backendless.Files.Permissions.READ.denyForAllRoles(url);

    promiseBoolean = Backendless.Files.Permissions.DELETE.grantForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.grantForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.grantForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.grantForAllRoles(url);
    promiseBoolean = Backendless.Files.Permissions.DELETE.denyForAllRoles(url);

    promiseBoolean = Backendless.Files.Permissions.WRITE.grantForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyForUser(userid, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.grantForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyForRole(roleName, url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.grantForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyForAllUsers(url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.grantForAllRoles(url);
    promiseBoolean = Backendless.Files.Permissions.WRITE.denyForAllRoles(url);

}

function testCommerce() {
    const packageName: string = 'str';
    const productId: string = 'str';
    const token: string = 'str';
    const subscriptionId: string = 'str';

    let resultStr: string;
    let resultObj: object;
    let promiseObject: Promise<object>;

    resultStr = Backendless.Commerce.restUrl;

    promiseObject = Backendless.Commerce.validatePlayPurchase(packageName, productId, token);

    promiseObject = Backendless.Commerce.cancelPlaySubscription(packageName, subscriptionId, token);

    promiseObject = Backendless.Commerce.getPlaySubscriptionStatus(packageName, subscriptionId, token);
}

function testEvents() {
    const eventName: string = 'str';
    const eventArgs: object = {};

    let resultStr: string;
    let resultObj: object;
    let promiseObject: Promise<object>;

    resultStr = Backendless.Events.restUrl;

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

    let resultObj: object;
    let promiseObject: Promise<object>;

    promiseObject = Backendless.Cache.put(key, value);
    promiseObject = Backendless.Cache.put(key, value, timeToLive);

    promiseObject = Backendless.Cache.expireIn(key, seconds);
    promiseObject = Backendless.Cache.expireIn(key, date);

    promiseObject = Backendless.Cache.expireAt(key, seconds);
    promiseObject = Backendless.Cache.expireAt(key, date);

    promiseObject = Backendless.Cache.contains(key);

    promiseObject = Backendless.Cache.get(key);

    promiseObject = Backendless.Cache.remove(key);
}

function testCounters() {
    const value: number = 123;
    const counterName: string = 'str';
    const expected: number = 123;
    const updated: number = 123;
    let promiseObject: Promise<object>;
    let promiseNumber: Promise<number>;
    let promiseStrings: Promise<string[]>;

    //'implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet'
    let resultNum: number = 123;

    promiseStrings = Backendless.Counters.list();
    promiseStrings = Backendless.Counters.list('*');

    promiseNumber = Backendless.Counters.get(counterName);

    promiseNumber = Backendless.Counters.getAndIncrement(counterName);

    promiseNumber = Backendless.Counters.incrementAndGet(counterName);

    promiseNumber = Backendless.Counters.getAndDecrement(counterName);

    promiseNumber = Backendless.Counters.decrementAndGet(counterName);

    promiseNumber = Backendless.Counters.addAndGet(counterName, value);

    promiseNumber = Backendless.Counters.getAndAdd(counterName, value);

    promiseNumber = Backendless.Counters.compareAndSet(counterName, expected, updated);

    promiseNumber = Backendless.Counters.reset(counterName);

    const counter: Counter = Backendless.Counters.of(counterName);

    promiseNumber = counter.get();

    promiseNumber = counter.getAndIncrement();

    promiseNumber = counter.incrementAndGet();

    promiseNumber = counter.getAndDecrement();

    promiseNumber = counter.decrementAndGet();

    promiseNumber = counter.addAndGet(value);

    promiseNumber = counter.getAndAdd(value);

    promiseNumber = counter.compareAndSet(expected, updated);

    promiseNumber = counter.reset();
}

function testCustomServices() {
    const serviceName: string = 'str';
    const method: string = 'str';
    const parameters: object = {};
    let resultObj: any
    let promiseAny: Promise<any>
    let executionType: string = Backendless.BL.ExecutionTypes.SYNC
    let httpRequestHeaders: object = {'custom-header': 'value'}
    let options1: object = {}
    let options2: object = {httpRequestHeaders}
    let options3: object = {executionType}
    let options4: object = {executionType, httpRequestHeaders}

    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.SYNC);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
    promiseAny = Backendless.CustomServices.invoke(serviceName, method, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);

    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.SYNC);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, Backendless.BL.ExecutionTypes.ASYNC_LOW_PRIORITY);

    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, options1);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, options2);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, options3);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, parameters, options4);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, null, options1);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, null, options2);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, null, options3);
    promiseAny = Backendless.APIServices.invoke(serviceName, method, null, options4);
}

function testLogging() {
    const numOfMessagesValue: number = 123;
    const timeFrequencySecValue: number = 123;
    const loggerName: string = 'str';
    let logger: Backendless.Logger;
    const message: string = 'str';
    const exception: string = 'str';

    const restUrl: string = Backendless.Logging.restUrl;
    const loggers: object = Backendless.Logging.loggers;
    const logInfo: object[] = Backendless.Logging.logInfo;
    const messagesCount: number = Backendless.Logging.messagesCount;
    const numOfMessages: number = Backendless.Logging.numOfMessages;
    const timeFrequency: number = Backendless.Logging.timeFrequency;

    Backendless.Logging.setLogReportingPolicy(numOfMessagesValue, timeFrequencySecValue);

    logger = Backendless.Logging.getLogger(loggerName);
    logger.debug(message);
    logger.info(message);
    logger.warn(message);
    logger.warn(message, exception);
    logger.error(message);
    logger.error(message, exception);
    logger.fatal(message);
    logger.fatal(message, exception);
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
        .addUpsertListener('whereClause', (obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener('whereClause', (obj: Object) => undefined)
        .addUpsertListener((obj: Object) => undefined)
        .addUpsertListener((obj: Object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener('whereClause', (obj: { bar: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener('whereClause', (obj: { bar: string }) => undefined)
        .addUpsertListener((obj: { bar: string }) => undefined)
        .addUpsertListener((obj: { bar: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener<Person>('whereClause', (obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener<Person>('whereClause', (obj: Person) => undefined)
        .addUpsertListener<Person>((obj: Person) => undefined)
        .addUpsertListener<Person>((obj: Person) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener<Person>('whereClause', (obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpsertListener<Person>('whereClause', (obj: { foo: string }) => undefined)
        .addUpsertListener<Person>((obj: { foo: string }) => undefined)
        .addUpsertListener<Person>((obj: { foo: string }) => undefined, (error: Backendless.RTSubscriptionError) => undefined)

    eventHandler
        .removeUpsertListeners('whereClause')
        .removeUpsertListeners()
        .removeUpsertListener<Person>((obj: Person) => undefined)
        .removeUpsertListener<Person>((obj: { foo: string }) => undefined)


    eventHandler
        .addCreateListener('whereClause', (obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addCreateListener('whereClause', (obj: object) => undefined)
        .addCreateListener((obj: object) => undefined)
        .addCreateListener((obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
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
        .addUpdateListener('whereClause', (obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addUpdateListener('whereClause', (obj: object) => undefined)
        .addUpdateListener((obj: object) => undefined)
        .addUpdateListener((obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
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
        .addDeleteListener('whereClause', (obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteListener('whereClause', (obj: object) => undefined)
        .addDeleteListener((obj: object) => undefined)
        .addDeleteListener((obj: object) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
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
        .addBulkUpsertListener((list: string[]) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addBulkUpsertListener((list: string[]) => undefined)

    eventHandler
        .removeBulkUpsertListener((list: string[]) => undefined)
        .removeBulkUpsertListeners()

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
        .addSetRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addSetRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addSetRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addSetRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addSetRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addSetRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined)

    eventHandler
        .addAddRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addAddRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addAddRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addAddRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addAddRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addAddRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined)

    eventHandler
        .addDeleteRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addDeleteRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined)
        .addDeleteRelationListener('relationColumnName', ['parentObjectIds', 'parentObjectIds', 'parentObjectIds'], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteRelationListener('relationColumnName', [{objectId: '1'}, {objectId: '2'}, {
            objectId: '3',
            foo: 123
        }], (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined, (error: Backendless.RTSubscriptionError) => undefined)
        .addDeleteRelationListener('relationColumnName', (data: Backendless.RTChangeRelationStatus) => undefined)

    eventHandler
        .removeSetRelationListener((data: Backendless.RTChangeRelationStatus) => undefined)
        .removeSetRelationListeners('relationColumnName')
        .removeSetRelationListeners()

    eventHandler
        .removeAddRelationListener((data: Backendless.RTChangeRelationStatus) => undefined)
        .removeAddRelationListeners('relationColumnName')
        .removeAddRelationListeners()

    eventHandler
        .removeDeleteRelationListener((data: Backendless.RTChangeRelationStatus) => undefined)
        .removeDeleteRelationListeners('relationColumnName')
        .removeDeleteRelationListeners()

    eventHandler
        .removeAllListeners()
        .addDeleteListener('whereClause', (obj: object) => undefined)
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

async function testBaseTransactions() {
    class Person {
        foo?: string = 'bar'
    }

    const personInst: Person = new Person()
    const personObj: object = {foo: 'bar'}
    const personClassName: string = 'Persons'
    const personObjectId: string = 'PersonId'
    const propertyName: string = 'propName'
    const columnName: string = 'columnName'
    const whereClause: string = 'whereClause';

    const dataQueryBuilder: Backendless.DataQueryBuilder = Backendless.DataQueryBuilder.create();

    const uow: Backendless.UnitOfWork = new Backendless.UnitOfWork()

    let opResult: Backendless.OpResult;
    let opResultValueReference: Backendless.OpResultValueReference;
    let promiseResult: Promise<Backendless.UnitOfWorkResult>;
    let unitOfWorkResult: Backendless.UnitOfWorkResult;
    let changesObj: object;
    let propertyValueObj: object;
    let opResultId: string;
    let tableName: string;
    let isSuccess: boolean;
    let results: object
    let bool: boolean
    let transactionOperationError: Backendless.TransactionOperationError;

    bool = changesObj instanceof Backendless.UnitOfWork.OpResult
    bool = changesObj instanceof Backendless.UnitOfWork.OpResultValueReference

    opResultId = opResult.getOpResultId()
    opResult = opResult.setOpResultId(opResultId)

    tableName = opResult.getTableName()

    opResultValueReference = opResult.resolveTo(1)
    opResultValueReference = opResult.resolveTo(1, 'propName')
    opResultValueReference = opResult.resolveTo('propName')

    promiseResult = uow.execute()
    unitOfWorkResult = await uow.execute()

    isSuccess = unitOfWorkResult.isSuccess()
    transactionOperationError = unitOfWorkResult.getError()
    results = unitOfWorkResult.getResults()

    unitOfWorkResult = unitOfWorkResult.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_UNCOMMITTED)
    unitOfWorkResult = unitOfWorkResult.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.READ_COMMITTED)
    unitOfWorkResult = unitOfWorkResult.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.REPEATABLE_READ)
    unitOfWorkResult = unitOfWorkResult.setIsolationLevel(Backendless.UnitOfWork.IsolationLevelEnum.SERIALIZABLE)

    ///
    opResult = uow.create(personInst);
    opResult = uow.create(personClassName, personObj);
    ///
    opResult = uow.upsert(personInst);
    opResult = uow.upsert(personClassName, personObj);
    ///
    opResult = uow.update(personInst);
    opResult = uow.update(personClassName, personObj);
    opResult = uow.update(opResult, personObj);
    opResult = uow.update(opResult, propertyName, propertyValueObj);
    opResult = uow.update(opResultValueReference, changesObj);
    opResult = uow.update(opResultValueReference, propertyName, opResultValueReference);
    opResult = uow.update(opResultValueReference, propertyName, 123);
    opResult = uow.update(opResultValueReference, propertyName, 'str');
    opResult = uow.update(opResultValueReference, propertyName, true);
    ///
    opResult = uow.delete(opResult);
    opResult = uow.delete(opResultValueReference);
    opResult = uow.delete(personInst);
    opResult = uow.delete(personClassName, personObjectId);
    ///
    opResult = uow.bulkCreate(personClassName, [personObj, personObj, personObj]);
    opResult = uow.bulkCreate([personInst, personInst, personInst]);
    ///
    opResult = uow.bulkUpsert(personClassName, [personObj, personObj, personObj]);
    opResult = uow.bulkUpsert([personInst, personInst, personInst]);
    ///
    opResult = uow.bulkUpdate(personClassName, whereClause, changesObj);
    opResult = uow.bulkUpdate(personClassName, [personObjectId, personObjectId, personObjectId], changesObj);
    opResult = uow.bulkUpdate(personClassName, [personObj, personObj, personObj], changesObj);
    opResult = uow.bulkUpdate(personClassName, [personInst, personInst, personInst], changesObj);
    opResult = uow.bulkUpdate(opResult, changesObj);
    ///
    opResult = uow.bulkDelete(personClassName, [changesObj, changesObj, changesObj]);
    opResult = uow.bulkDelete([personInst, personInst, personInst]);
    opResult = uow.bulkDelete(personClassName, [personObjectId, personObjectId, personObjectId]);
    opResult = uow.bulkDelete(opResult);
    opResult = uow.bulkDelete(personClassName, whereClause);
    ///
    opResult = uow.find(personClassName, dataQueryBuilder);
    ///
    opResult = uow.addToRelation(opResult, columnName, whereClause);
    opResult = uow.addToRelation(opResult, columnName, personInst);
    opResult = uow.addToRelation(opResult, columnName, personObj);
    opResult = uow.addToRelation(opResult, columnName, opResult);
    opResult = uow.addToRelation(opResult, columnName, opResultValueReference);
    opResult = uow.addToRelation(opResult, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(opResult, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(opResult, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(opResult, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(opResult, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.addToRelation(opResultValueReference, columnName, whereClause);
    opResult = uow.addToRelation(opResultValueReference, columnName, personInst);
    opResult = uow.addToRelation(opResultValueReference, columnName, personObj);
    opResult = uow.addToRelation(opResultValueReference, columnName, opResult);
    opResult = uow.addToRelation(opResultValueReference, columnName, opResultValueReference);
    opResult = uow.addToRelation(opResultValueReference, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(opResultValueReference, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(opResultValueReference, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(opResultValueReference, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(opResultValueReference, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.addToRelation(personInst, columnName, whereClause);
    opResult = uow.addToRelation(personInst, columnName, personInst);
    opResult = uow.addToRelation(personInst, columnName, personObj);
    opResult = uow.addToRelation(personInst, columnName, opResult);
    opResult = uow.addToRelation(personInst, columnName, opResultValueReference);
    opResult = uow.addToRelation(personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.addToRelation(personClassName, personInst, columnName, whereClause);
    opResult = uow.addToRelation(personClassName, personInst, columnName, personInst);
    opResult = uow.addToRelation(personClassName, personInst, columnName, personObj);
    opResult = uow.addToRelation(personClassName, personInst, columnName, opResult);
    opResult = uow.addToRelation(personClassName, personInst, columnName, opResultValueReference);
    opResult = uow.addToRelation(personClassName, personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(personClassName, personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(personClassName, personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(personClassName, personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(personClassName, personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.addToRelation(personClassName, personObj, columnName, whereClause);
    opResult = uow.addToRelation(personClassName, personObj, columnName, personInst);
    opResult = uow.addToRelation(personClassName, personObj, columnName, personObj);
    opResult = uow.addToRelation(personClassName, personObj, columnName, opResult);
    opResult = uow.addToRelation(personClassName, personObj, columnName, opResultValueReference);
    opResult = uow.addToRelation(personClassName, personObj, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(personClassName, personObj, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(personClassName, personObj, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(personClassName, personObj, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(personClassName, personObj, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.addToRelation(personClassName, personObjectId, columnName, whereClause);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, personInst);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, personObj);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, opResult);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, opResultValueReference);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, [opResult, opResult, opResult]);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, [personInst, personInst, personInst]);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, [personObj, personObj, personObj]);
    opResult = uow.addToRelation(personClassName, personObjectId, columnName, [personObjectId, personObjectId, personObjectId]);
    ///

    ///
    opResult = uow.setRelation(opResult, columnName, whereClause);
    opResult = uow.setRelation(opResult, columnName, personInst);
    opResult = uow.setRelation(opResult, columnName, personObj);
    opResult = uow.setRelation(opResult, columnName, opResult);
    opResult = uow.setRelation(opResult, columnName, opResultValueReference);
    opResult = uow.setRelation(opResult, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(opResult, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(opResult, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(opResult, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(opResult, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.setRelation(opResultValueReference, columnName, whereClause);
    opResult = uow.setRelation(opResultValueReference, columnName, personInst);
    opResult = uow.setRelation(opResultValueReference, columnName, personObj);
    opResult = uow.setRelation(opResultValueReference, columnName, opResult);
    opResult = uow.setRelation(opResultValueReference, columnName, opResultValueReference);
    opResult = uow.setRelation(opResultValueReference, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(opResultValueReference, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(opResultValueReference, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(opResultValueReference, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(opResultValueReference, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.setRelation(personInst, columnName, whereClause);
    opResult = uow.setRelation(personInst, columnName, personInst);
    opResult = uow.setRelation(personInst, columnName, personObj);
    opResult = uow.setRelation(personInst, columnName, opResult);
    opResult = uow.setRelation(personInst, columnName, opResultValueReference);
    opResult = uow.setRelation(personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.setRelation(personClassName, personInst, columnName, whereClause);
    opResult = uow.setRelation(personClassName, personInst, columnName, personInst);
    opResult = uow.setRelation(personClassName, personInst, columnName, personObj);
    opResult = uow.setRelation(personClassName, personInst, columnName, opResult);
    opResult = uow.setRelation(personClassName, personInst, columnName, opResultValueReference);
    opResult = uow.setRelation(personClassName, personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(personClassName, personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(personClassName, personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(personClassName, personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(personClassName, personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.setRelation(personClassName, personObj, columnName, whereClause);
    opResult = uow.setRelation(personClassName, personObj, columnName, personInst);
    opResult = uow.setRelation(personClassName, personObj, columnName, personObj);
    opResult = uow.setRelation(personClassName, personObj, columnName, opResult);
    opResult = uow.setRelation(personClassName, personObj, columnName, opResultValueReference);
    opResult = uow.setRelation(personClassName, personObj, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(personClassName, personObj, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(personClassName, personObj, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(personClassName, personObj, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(personClassName, personObj, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.setRelation(personClassName, personObjectId, columnName, whereClause);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, personInst);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, personObj);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, opResult);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, opResultValueReference);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, [opResult, opResult, opResult]);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, [personInst, personInst, personInst]);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, [personObj, personObj, personObj]);
    opResult = uow.setRelation(personClassName, personObjectId, columnName, [personObjectId, personObjectId, personObjectId]);
    ///

    ///
    opResult = uow.deleteRelation(opResult, columnName, whereClause);
    opResult = uow.deleteRelation(opResult, columnName, personInst);
    opResult = uow.deleteRelation(opResult, columnName, personObj);
    opResult = uow.deleteRelation(opResult, columnName, opResult);
    opResult = uow.deleteRelation(opResult, columnName, opResultValueReference);
    opResult = uow.deleteRelation(opResult, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(opResult, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(opResult, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(opResult, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(opResult, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.deleteRelation(opResultValueReference, columnName, whereClause);
    opResult = uow.deleteRelation(opResultValueReference, columnName, personInst);
    opResult = uow.deleteRelation(opResultValueReference, columnName, personObj);
    opResult = uow.deleteRelation(opResultValueReference, columnName, opResult);
    opResult = uow.deleteRelation(opResultValueReference, columnName, opResultValueReference);
    opResult = uow.deleteRelation(opResultValueReference, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(opResultValueReference, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(opResultValueReference, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(opResultValueReference, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(opResultValueReference, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.deleteRelation(personInst, columnName, whereClause);
    opResult = uow.deleteRelation(personInst, columnName, personInst);
    opResult = uow.deleteRelation(personInst, columnName, personObj);
    opResult = uow.deleteRelation(personInst, columnName, opResult);
    opResult = uow.deleteRelation(personInst, columnName, opResultValueReference);
    opResult = uow.deleteRelation(personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.deleteRelation(personClassName, personInst, columnName, whereClause);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, personInst);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, personObj);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, opResult);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, opResultValueReference);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(personClassName, personInst, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.deleteRelation(personClassName, personObj, columnName, whereClause);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, personInst);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, personObj);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, opResult);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, opResultValueReference);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(personClassName, personObj, columnName, [personObjectId, personObjectId, personObjectId]);

    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, whereClause);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, personInst);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, personObj);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, opResult);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, opResultValueReference);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, [opResult, opResult, opResult]);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, [opResultValueReference, opResultValueReference, opResultValueReference]);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, [personInst, personInst, personInst]);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, [personObj, personObj, personObj]);
    opResult = uow.deleteRelation(personClassName, personObjectId, columnName, [personObjectId, personObjectId, personObjectId]);
    ///
}

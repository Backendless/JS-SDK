declare module Backendless {
    var VERSION:string;
    var serverURL:string;
    var applicationId:string;
    var secretKey:string;
    var appVersion:string;
    var appPath:string;

    var browser:{
        browser:string;
        version:string;
    };

    /**
     * @public
     * @type: Function
     **/
    function initApp(applicationId:string, jsSecretKey:string, applicationVersion:string):void;

    /**
     * @public
     * @type: Function
     **/
    function setUIState(state:string):void;

    /**
     * @namespace Backendless.Utils
     **/
    var Utils:BackendlessUtils;

    /**
     * @namespace Backendless.LocalCache
     **/
    var LocalCache:BackendlessLocalCache;

    /**
     * @namespace Backendless.Persistence
     **/
    var Persistence:BackendlessPersistence;

    /**
     * @namespace Backendless.Data
     * @deprecated
     *
     * use {@link Backendless.Persistence}
     **/
    var Data:BackendlessPersistence;

    /**
     * @namespace Backendless.UserService
     **/
    var UserService:BackendlessUserService;

    /**
     * @namespace Backendless.Geo
     **/
    var Geo:BackendlessGeo;

    /**
     * @namespace Backendless.Messaging
     **/
    var Messaging:BackendlessMessaging;

    /**
     * @namespace Backendless.Files
     **/
    var Files:BackendlessFiles;

    /**
     * @namespace Backendless.Commerce
     **/
    var Commerce:BackendlessCommerce;

    /**
     * @namespace Backendless.Events
     **/
    var Events:BackendlessEvents;

    /**
     * @namespace Backendless.Cache
     **/
    var Cache:BackendlessCache;

    /**
     * @namespace Backendless.Counters
     **/
    var Counters:BackendlessCounters;

    /**
     * @namespace Backendless.CustomServices
     **/
    var CustomServices:BackendlessCustomServices;

    /**
     * @namespace Backendless.Logging
     **/
    var Logging:BackendlessLogging;

    /**
     * @class Backendless.Async
     * @constructor
     */
    class Async {
        constructor(onSuccess:(data?:Object) => void, onError?:((data:Object) => void) | Object, context?:Object);

        success(data:Object):void;

        fault(data:Object):void;
    }

    /**
     * @class Backendless.User
     * @constructor
     */
    class User {
        ___class:string;
    }

    /**
     * @class Backendless.DataQuery
     * @constructor
     */
    class DataQuery implements BackendlessDataQueryValue {
        properties:string[];
        condition:string;
        options:Object;
        url:string;

        addProperty(prop:string):void;
    }
}

/**
 * @public
 * @class GeoPoint
 */
declare class GeoPoint {
    ___class:string;
    objectId:string;
    latitude:number;
    longitude:number;
    categories:string|string[];
    metadata:Object;
}

/**
 * @public
 * @class GeoCluster
 * @extends GeoPoint
 */
declare class GeoCluster extends GeoPoint {
    totalPoints:number;
    geoQuery:BackendlessGeoQuery |BackendlessRectangleGeoQueryI| BackendlessCircleGeoQueryI;
}

/**
 * @public
 * @class BackendlessGeoQuery
 */
declare class BackendlessGeoQuery implements BackendlessGeoQueryI {
    categories:string|string[];
    includeMetadata:boolean;
    metadata:Object;
    condition:string;
    relativeFindMetadata:Object;
    relativeFindPercentThreshold:number;
    pageSize:number;
    offset:number;
}

/**
 * @public
 * @dictionary
 */
declare var PublishOptionsHeaders:{ [key: string]: string; };

/**
 * @public
 * @class PublishOptions
 * @constructor
 */
declare class PublishOptions {
    publisherId:string;
    headers:Object;
    subtopic:string;

    constructor(args?:Object);
}

/**
 * @public
 * @class DeliveryOptions
 * @constructor
 */
declare class DeliveryOptions {
    pushPolicy:string;
    pushBroadcast:number;
    pushSinglecast:string[];
    publishAt:number;
    repeatEvery:number;
    repeatExpiresAt:number;

    constructor(args?:Object);
}

/**
 * @public
 * @class Bodyparts
 * @constructor
 */
declare class Bodyparts {
    textmessage:string;
    htmlmessage:string;

    constructor(args?:Object);
}

/**
 * @public
 * @class SubscriptionOptions
 * @constructor
 */
declare class SubscriptionOptions {
    subscriberId:string;
    subtopic:string;
    selector:string;

    constructor(args?:Object);
}

/**
 * @private
 * @class BackendlessLogger
 */
class BackendlessLogger {
    debug(message:string):void;

    info(message:string):void;

    warn(message:string):void;

    error(message:string):void;

    fatal(message:string):void;

    trace(message:string):void;
}

/**
 * @private
 * @class BackendlessProxy
 */
class BackendlessProxy {
    eventHandlers:Object;

    on(eventName:string, handler:(data:any)=>any):void;

    fireEvent(eventName:string, data:any):void;
}

/**
 * @private
 * @class BackendlessPollingProxy
 */
class BackendlessPollingProxy extends BackendlessProxy {
    restUrl:string;
    timer:number;
    timeout:number;
    interval:number;
    xhr:XMLHttpRequest;
    needReconnect:boolean;
    responder:Backendless.Async;

    onMessage(data:any):void;

    poll():void;

    close():void;

    onTimeout():void;

    onError():void;
}

/**
 * @private
 * @class BackendlessSocketProxy
 */
class BackendlessSocketProxy extends BackendlessProxy {
    reconnectWithPolling:boolean;
    socket:WebSocket;

    onMessage():void;

    onSocketClose(data):void;

    close():void;
}

/**
 * @private
 * @class BackendlessLogger
 */
class BackendlessDataStore {
    model:Function|Object;
    className:string;
    restUrl:string;

    constructor(name:string|Object|Function);

    save(obj:Object, async:Backendless.Async):XMLHttpRequest;
    save(obj:Object):Object;

    remove(id:Object|string, async:Backendless.Async):XMLHttpRequest;
    remove(obj:Object|string):Object;

    find():Object;
    find(async:Backendless.Async):XMLHttpRequest;
    find(obj:Backendless.DataQuery|BackendlessDataQueryValue|string):Object;
    find(id:Backendless.DataQuery|BackendlessDataQueryValue|string, async:Backendless.Async):XMLHttpRequest;
    find(id:Backendless.DataQuery|BackendlessDataQueryValue|string, async:Backendless.Async):XMLHttpRequest;

    findById(query:Backendless.DataQuery|BackendlessDataQueryValue|string):Object;
    findById(query:Backendless.DataQuery|BackendlessDataQueryValue|string, async:Backendless.Async):XMLHttpRequest;

    findFirst():Object;
    findFirst(async:Backendless.Async):XMLHttpRequest;
    findFirst(query:Backendless.DataQuery|BackendlessDataQueryValue):Object;
    findFirst(query:Backendless.DataQuery|BackendlessDataQueryValue, async:Backendless.Async):XMLHttpRequest;

    findLast():Object;
    findLast(async:Backendless.Async):XMLHttpRequest;
    findLast(query:Backendless.DataQuery|BackendlessDataQueryValue):Object;
    findLast(query:Backendless.DataQuery|BackendlessDataQueryValue, async:Backendless.Async):XMLHttpRequest;

    loadRelations(query:Backendless.DataQuery|BackendlessDataQueryValue|string):void;
    loadRelations(query:Backendless.DataQuery|BackendlessDataQueryValue|string, relation:Array<string>):void;
}

/**
 * @private
 * @class BackendlessAtomicInstance
 */
class BackendlessAtomicInstance {

    constructor(counterName:string);

    get():number;
    get(async:Backendless.Async):XMLHttpRequest;

    getAndIncrement():number;
    getAndIncrement(async:Backendless.Async):XMLHttpRequest;

    incrementAndGet():number;
    incrementAndGet(async:Backendless.Async):XMLHttpRequest;

    getAndDecrement():number;
    getAndDecrement(async:Backendless.Async):XMLHttpRequest;

    decrementAndGet():number;
    decrementAndGet(async:Backendless.Async):XMLHttpRequest;

    addAndGet(value:number):number;
    addAndGet(value:number, async:Backendless.Async):XMLHttpRequest;

    getAndAdd(value:number):number;
    getAndAdd(value:number, async:Backendless.Async):XMLHttpRequest;

    compareAndSet(expected:number, updated:number):number;
    compareAndSet(expected:number, updated:number, async:Backendless.Async):XMLHttpRequest;

    reset():number;
    reset(async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessPersistence
 * @refers {@link Backendless.Persistence}
 */
class BackendlessPersistence {

    /**
     * @namespace Backendless.Persistence.Permissions
     **/
    Permissions:BackendlessPersistencePermissions;

    of(model:string|Object|Function):BackendlessDataStore;

    save(model:BackendlessDataStore|string, data:Object):Object;
    save(model:BackendlessDataStore|string, data:Object, async:Backendless.Async):XMLHttpRequest;

    getView(viewName:string):Object;
    getView(viewName:string, async:Object):XMLHttpRequest;
    getView(viewName:string, whereClause:string):Object;
    getView(viewName:string, whereClause:string, async:Object):XMLHttpRequest;
    getView(viewName:string, whereClause:string, pageSize:number):Object;
    getView(viewName:string, whereClause:string, pageSize:number, async:Object):XMLHttpRequest;
    getView(viewName:string, whereClause:string, pageSize:number, offset:number):Object;
    getView(viewName:string, whereClause:string, pageSize:number, offset:number, async:Object):XMLHttpRequest;

    describe(model:string|Object|Function, async):XMLHttpRequest;
    describe(model:string|Object|Function):Object;

    callStoredProcedure(spName:string, argumentValues:Object|string, async:Backendless.Async):XMLHttpRequest;
    callStoredProcedure(spName:string, argumentValues:Object|string):Object;
}

/**
 * @private
 * @class BackendlessPersistencePermissions
 * @refers {@link Backendless.Persistence.Permissions}
 */
class BackendlessPersistencePermissions {
    restUrl:string;

    getRestUrl(obj:BackendlessDataItem, type:string):string;

    FIND:{
        grantUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grantRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grant(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grant(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        deny(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        deny(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;
    };

    REMOVE:{
        grantUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grantRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grant(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grant(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        deny(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        deny(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;
    };

    UPDATE:{
        grantUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grantRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grantRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        grant(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        grant(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyUser(userId:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyUser(userId:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        denyRole(roleName:string, dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        denyRole(roleName:string, dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;

        deny(dataItem:BackendlessExistDataItem):BackendlessExistDataItem;
        deny(dataItem:BackendlessExistDataItem, async:Backendless.Async):XMLHttpRequest;
    };
}

/**
 * @private
 * @class BackendlessGeo
 * @refers {@link Backendless.Geo}
 */
class BackendlessGeo {
    restUrl:string;

    UNITS:Object;
    EARTH_RADIUS:number;

    addPoint(point:GeoPoint):GeoPoint;
    addPoint(point:GeoPoint, async:Backendless.Async):XMLHttpRequest;

    find(query:BackendlessGeoQuery):BackendlessGeoCollectionResult;
    find(query:BackendlessGeoQuery, async:Backendless.Async):XMLHttpRequest;

    deletePoint(pointId:string):string;
    deletePoint(point:GeoPoint):string;
    deletePoint(pointId:string, async:Backendless.Async):XMLHttpRequest;
    deletePoint(point:GeoPoint, async:Backendless.Async):XMLHttpRequest;

    loadMetadata(point:GeoPoint|GeoCluster):Object;
    loadMetadata(point:GeoPoint|GeoCluster, async:Backendless.Async):XMLHttpRequest;

    getClusterPoints(cluster:GeoCluster):BackendlessGeoCollectionResult;
    getClusterPoints(cluster:GeoCluster, async:Backendless.Async):XMLHttpRequest;

    getFencePoints(fenceName:string, query:BackendlessGeoQuery):BackendlessGeoCollectionResult;
    getFencePoints(fenceName:string, query:BackendlessGeoQuery, async:Backendless.Async):XMLHttpRequest;

    relativeFind(query:BackendlessGeoQuery):BackendlessGeoCollectionResult;
    relativeFind(query:BackendlessGeoQuery, async:Backendless.Async):XMLHttpRequest;

    addCategory(name:string):BackendlessGeoCategory;
    addCategory(name:string, async:Backendless.Async):XMLHttpRequest;

    deleteCategory(name:string):boolean;
    deleteCategory(name:string, async:Backendless.Async):XMLHttpRequest;

    getCategories():BackendlessGeoCategory[];
    getCategories(async:Backendless.Async):XMLHttpRequest;

    runOnStayAction(fenceName:string, point:GeoPoint):Object;
    runOnStayAction(fenceName:string, point:GeoPoint, async:Backendless.Async):XMLHttpRequest;

    runOnExitAction(fenceName:string, point:GeoPoint):Object;
    runOnExitAction(fenceName:string, point:GeoPoint, async:Backendless.Async):XMLHttpRequest;

    runOnEnterAction(fenceName:string, point:GeoPoint):Object;
    runOnEnterAction(fenceName:string, point:GeoPoint, async:Backendless.Async):XMLHttpRequest;

    startGeofenceMonitoringWithInAppCallback(fenceName:string, inAppCallback:BackendlessGeofenceMonitoringCallbacks, async?:Backendless.Async):void;

    startGeofenceMonitoringWithRemoteCallback(fenceName:string, point:GeoPoint, async?:Backendless.Async):void;

    stopGeofenceMonitoring(fenceName:string):void;
}

/**
 * @private
 * @class BackendlessMessaging
 * @refers {@link Backendless.Messaging}
 */
class BackendlessMessaging {
    restUrl:string;
    channelProperties:Object;

    subscribe(channelName:string, subscriptionCallback:()=>void, subscriptionOptions:SubscriptionOptions):BackendlessSubscription;
    subscribe(channelName:string, subscriptionCallback:()=>void, subscriptionOptions:SubscriptionOptions, async:Backendless.Async):XMLHttpRequest;

    publish(channelName:string, message:string|Object, publishOptions:PublishOptions, deliveryOptions:DeliveryOptions):Object;
    publish(channelName:string, message:string|Object, publishOptions:PublishOptions, deliveryOptions:DeliveryOptions, async:Backendless.Async):XMLHttpRequest;

    sendEmail(subject:string, bodyParts:Bodyparts, recipients:string[], attachments:string[]):Object;
    sendEmail(subject:string, bodyParts:Bodyparts, recipients:string[], attachments:string[], async:Backendless.Async):XMLHttpRequest;

    cancel(messageId:string):boolean;
    cancel(messageId:string, async:Backendless.Async):XMLHttpRequest;

    registerDevice(channels:string[], expiration:number|Date):Object;
    registerDevice(channels:string[], expiration:number|Date, async:Backendless.Async):XMLHttpRequest;

    getRegistrations():Object;
    getRegistrations(async:Backendless.Async):XMLHttpRequest;

    unregisterDevice():Object;
    unregisterDevice(async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessFiles
 * @refers {@link Backendless.Files}
 */
class BackendlessFiles {
    /**
     * @namespace Backendless.Files.Permissions
     **/
    Permissions:BackendlessFilesPermissions;

    restUrl:string;

    saveFile(path:string, fileName:string, fileContent:Blob):boolean;
    saveFile(path:string, fileName:string, fileContent:Blob, async:Backendless.Async):void;
    saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean):boolean;
    saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean, async:Backendless.Async):void;

    upload(files:File|File[], path:string, overwrite:boolean, async:Backendless.Async):void;

    listing(path:string):Object;
    listing(path:string, async:Backendless.Async):XMLHttpRequest;
    listing(path:string, pattern:string):Object;
    listing(path:string, pattern:string, async:Backendless.Async):XMLHttpRequest;
    listing(path:string, pattern:string, recursively:boolean):Object;
    listing(path:string, pattern:string, recursively:boolean, async:Backendless.Async):XMLHttpRequest;
    listing(path:string, pattern:string, recursively:boolean, pageSize:number):Object;
    listing(path:string, pattern:string, recursively:boolean, pageSize:number, async:Backendless.Async):XMLHttpRequest;
    listing(path:string, pattern:string, recursively:boolean, pageSize:number, offset:number):Object;
    listing(path:string, pattern:string, recursively:boolean, pageSize:number, offset:number, async:Backendless.Async):XMLHttpRequest;

    renameFile(oldPathName:string, newName:string):Object;
    renameFile(oldPathName:string, newName:string, async:Backendless.Async):void;

    moveFile(sourcePath:string, targetPath:string):Object;
    moveFile(sourcePath:string, targetPath:string, async:Backendless.Async):void;

    copyFile(sourcePath:string, targetPath:string):Object;
    copyFile(sourcePath:string, targetPath:string, async:Backendless.Async):void;

    remove(fileURL:string):void;
    remove(fileURL:string, async:Backendless.Async):void;

    exists(path:string):Object;
    exists(path:string, async:Backendless.Async):XMLHttpRequest;

    removeDirectory(path:string):void;
    removeDirectory(path:string, async:Backendless.Async):void;
}

/**
 * @private
 * @class BackendlessFilesPermissions
 * @refers {@link Backendless.Files.Permissions}
 */
class BackendlessFilesPermissions {
    restUrl:string;

    grantUser(userId:string, url:string, permissionType:string):Object;
    grantUser(userId:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;

    grantRole(roleName:string, url:string, permissionType:string):Object;
    grantRole(roleName:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;

    denyUser(userId:string, url:string, permissionType:string):Object;
    denyUser(userId:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;

    denyRole(roleName:string, url:string, permissionType:string):Object;
    denyRole(roleName:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessCommerce
 * @refers {@link Backendless.Commerce}
 */
class BackendlessCommerce {
    restUrl:string;

    validatePlayPurchase(packageName:string, productId:string, token:string):Object;
    validatePlayPurchase(packageName:string, productId:string, token:string, async:Backendless.Async):XMLHttpRequest;

    cancelPlaySubscription(packageName:string, subscriptionId:string, token:string):Object;
    cancelPlaySubscription(packageName:string, subscriptionId:string, token:string, async:Backendless.Async):XMLHttpRequest;

    getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string):Object;
    getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessEvents
 * @refers {@link Backendless.Events}
 */
class BackendlessEvents {
    restUrl:string;

    dispatch(eventName:string, eventArgs:Object):Object;
    dispatch(eventName:string, eventArgs:Object, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessCache
 * @refers {@link Backendless.Cache}
 */
class BackendlessCache {
    put(key:string, value:any):Object;
    put(key:string, value:any, timeToLive:number):Object;
    put(key:string, value:any, async:Backendless.Async):XMLHttpRequest;
    put(key:string, value:any, timeToLive:number):Object;
    put(key:string, value:any, timeToLive:number, async:Backendless.Async):XMLHttpRequest;

    expireIn(key:string, time:number|Date):Object;
    expireIn(key:string, time:number|Date, async:Backendless.Async):XMLHttpRequest;

    expireAt(key:string, time:number|Date):Object;
    expireAt(key:string, time:number|Date, async:Backendless.Async):XMLHttpRequest;

    contains(key:string):Object;
    contains(key:string, async:Backendless.Async):XMLHttpRequest;

    get(key:string):Object;
    get(key:string, async:Backendless.Async):XMLHttpRequest;

    remove(key:string):Object;
    remove(key:string, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessCounters
 * @refers {@link Backendless.Counters}
 */
class BackendlessCounters {
    of(counterName:string):BackendlessAtomicInstance;

    get(counterName:string):number;
    get(counterName:string, async:Backendless.Async):XMLHttpRequest;

    getAndIncrement(counterName:string):number;
    getAndIncrement(counterName:string, async:Backendless.Async):XMLHttpRequest;

    incrementAndGet(counterName:string):number;
    incrementAndGet(counterName:string, async:Backendless.Async):XMLHttpRequest;

    getAndDecrement(counterName:string):number;
    getAndDecrement(counterName:string, async:Backendless.Async):XMLHttpRequest;

    decrementAndGet(counterName:string):number;
    decrementAndGet(counterName:string, async:Backendless.Async):XMLHttpRequest;

    addAndGet(counterName:string, value:number):number;
    addAndGet(counterName:string, value:number, async:Backendless.Async):XMLHttpRequest;

    getAndAdd(counterName:string, value:number):number;
    getAndAdd(counterName:string, value:number, async:Backendless.Async):XMLHttpRequest;

    compareAndSet(counterName:string, expected:number, updated:number):number;
    compareAndSet(counterName:string, expected:number, updated:number, async:Backendless.Async):XMLHttpRequest;

    reset(counterName:string):number;
    reset(counterName:string, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessCustomServices
 * @refers {@link Backendless.CustomServices}
 */
class BackendlessCustomServices {
    invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object):Object;
    invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object, async:Backendless.Async):XMLHttpRequest;
}

/**
 * @private
 * @class BackendlessUserService
 * @refers {@link Backendless.UserService}
 */
class BackendlessUserService {
    restUrl:string;

    register(user:Backendless.User):Backendless.User ;
    register(user:Backendless.User, async:Backendless.Async):XMLHttpRequest;

    getUserRoles():Backendless.User ;
    getUserRoles(async:Backendless.Async):XMLHttpRequest;

    describeUserClass():Backendless.User ;
    describeUserClass(async:Backendless.Async):XMLHttpRequest;

    restorePassword(email:string):Backendless.User ;
    restorePassword(email:string, async:Backendless.Async):XMLHttpRequest;

    assignRole(userName:string, roleName:string):Backendless.User ;
    assignRole(userName:string, roleName:string, async:Backendless.Async):XMLHttpRequest;

    unassignRole(userName:string, roleName:string):Backendless.User ;
    unassignRole(userName:string, roleName:string, async:Backendless.Async):XMLHttpRequest;

    login(userName:string, password:string):Backendless.User ;
    login(userName:string, password:string, stayLoggedIn:boolean):Backendless.User ;
    login(userName:string, password:string, stayLoggedIn:boolean, async:Backendless.Async):XMLHttpRequest;

    loggedInUser():boolean;

    logout():void;
    logout(async:Backendless.Async):XMLHttpRequest;

    getCurrentUser():Backendless.User ;

    update(user:Backendless.User):Backendless.User ;
    update(user:Backendless.User, async:Backendless.Async):XMLHttpRequest;

    loginWithFacebook(fields?:Object, permissions?:Object, async?:Backendless.Async, container?:HTMLElement):void;

    loginWithGooglePlus(fields?:Object, permissions?:Object, async?:Backendless.Async, container?:HTMLElement):void;

    loginWithTwitter(fields?:Object, async?:Backendless.Async):void;

    loginWithFacebookSdk(fields?:Object, async?:Backendless.Async):void;

    loginWithGooglePlusSdk(fields?:Object, async?:Backendless.Async):void;

    isValidLogin():boolean;
    isValidLogin(async:Backendless.Async):XMLHttpRequest;
}

/**
 * @interface
 * @refers {@link Backendless.Utils}
 */
interface BackendlessUtils {
    isObject(value:any):boolean;

    isString(value:any):boolean;

    isNumber(value:any):boolean;

    isFunction(value:any):boolean;

    isBoolean(value:any):boolean;

    isDate(value:any):boolean;

    isArray(value:any):boolean;

    isEmpty(value:any):boolean;

    addEvent(eventName:string, domElement:HTMLElement, callback:(ev:Event) => any):void;

    removeEvent(eventName:string, domElement:HTMLElement):void;

    forEach(object:Object, iterator:(value:any, key:any, obj:Object) => any, context:Object):void;
}

interface BackendlessLogging {
    restUrl:string;
    loggers:Object;
    logInfo:Object[];
    messagesCount:number;
    numOfMessages:number;
    timeFrequency:number;

    setLogReportingPolicy(numOfMessages:number, timeFrequencySec:number):void;

    getLogger(name):BackendlessLogger;
}

interface BackendlessDataQueryValue {
    properties?:string[];
    condition?:string;
    options?:Object;
    url?:string;
}

interface BackendlessLocalCache {
    enabled:boolean;

    exists(key:string):boolean;

    set(key:string):boolean;
    set<T>(key:string, val:T):T;

    remove(key:string):boolean;

    get(key:string):any;

    getAll():Object;

    getCachePolicy(key:string):Object;

    serialize(value:any):string;

    deserialize(value:string):any;

    clear(key:string):void;

    flushExpired():void;
}

interface BackendlessGeoCategory {
    objectId:string;
    size:number;
    name:string;
}

interface BackendlessGeofenceMonitoringCallback {
    (geoFenceName:string, geoFenceId:string, latitude:number, longitude:number):void;
}

interface BackendlessGeofenceMonitoringCallbacks {
    onenter?:BackendlessGeofenceMonitoringCallback;
    onstay?:BackendlessGeofenceMonitoringCallback;
    onexit?:BackendlessGeofenceMonitoringCallback;
}

interface BackendlessDataItem {
    ___class:string;
    objectId?:string;
}

interface BackendlessExistDataItem extends BackendlessDataItem {
    objectId:string;
}

interface BackendlessSubscription {
    channelName:string;
    options:Object;
    channelProperties:string;
    subscriptionId:string;
    restUrl:string;
    proxy:BackendlessProxy;
    cancelSubscription():void;
}

interface BackendlessGeoQueryI {
    categories?:string|string[];
    includeMetadata?:boolean;
    metadata?:Object;
    condition?:string;
    relativeFindMetadata?:Object;
    relativeFindPercentThreshold?:number;
    pageSize?:number;
    offset?:number;
}

interface BackendlessRectangleGeoQueryI extends BackendlessGeoQueryI {
    searchRectangle:number[];
}

interface BackendlessCircleGeoQueryI extends BackendlessGeoQueryI {
    latitude:number;
    longitude:number;
    radius:number;
    units:string;
}

interface BackendlessCollectionResult {
    offset: number;
    totalObjects: number;
    getPage : (offset:number, pageSize:number, async:Backendless.Async)=>any;
    nextPage: (async:Backendless.Async)=>any;
}

interface BackendlessGeoCollectionResult extends BackendlessCollectionResult {
    data:Array<GeoPoint|GeoCluster>;
}

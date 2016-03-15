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

    var Utils:Utils;
    var LocalCache:LocalCache;
    var Persistence:Persistence;
    var Data:Persistence;
    var UserService:UserService;
    var Geo:Geo;
    var Messaging:Messaging;
    var Files:Files;
    var Commerce:Commerce;
    var Events:Events;
    var Cache:Cache;
    var Counters:Counters;
    var CustomServices:CustomServices;

    var Logging:{
        restUrl:string;
        loggers:Object;
        logInfo:Object[];
        messagesCount:number;
        numOfMessages:number;
        timeFrequency:number;

        setLogReportingPolicy(numOfMessages:number, timeFrequencySec:number):void;

        getLogger(name):Logging;
    };

    function initApp(applicationId:string, jsSecretKey:string, applicationVersion:string):void;

    function setUIState(state:string):void;

    interface DataQueryValue {
        properties?:Array<string>;
        condition?:string;
        options?:Object;
        url?:string;
    }

    interface Utils {
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

    interface LocalCache {
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

    interface GeoCategory {
        objectId:string;
        size:number;
        name:string;
    }

    interface GeoCategories extends Array<GeoCategory> {

    }

    interface GeofenceMonitoringCallback {
        (geoFenceName:string, geoFenceId:string, latitude:number, longitude:number):void;
    }

    interface GeofenceMonitoringCallbacks {
        onenter?:GeofenceMonitoringCallback;
        onstay?:GeofenceMonitoringCallback;
        onexit?:GeofenceMonitoringCallback;
    }

    interface DataItem {
        ___class:string;
        objectId?:string;
    }

    interface ExistDataItem extends DataItem {
        objectId:string;
    }

    interface Subscription {
        channelName:string;
        options:Object;
        channelProperties:string;
        subscriptionId:string;
        restUrl:string;
        proxy:Proxy;
        cancelSubscription():void;
    }

    interface Proxy {
        eventHandlers?:Object;

        on(eventName:string, handler:(data:any)=>any):void;
        fireEvent(eventName:string, data:any):void;
    }

    interface PollingProxy extends Proxy {
        restUrl:string;
        timer:number;
        timeout:number;
        interval:number;
        xhr:XMLHttpRequest;
        needReconnect:boolean;
        responder:Async;

        onMessage(data:any):void;
        poll():void;
        close():void;
        onTimeout():void;
        onError():void;
    }

    interface SocketProxy extends Proxy {
        reconnectWithPolling:boolean;
        socket:WebSocket;

        onMessage():void;
        onSocketClose(data):void;
        close():void;
    }

    class Async {
        constructor(onSuccess:(data:Object) => void, onError?:((data:Object) => void) | Object, context?:Object);

        success(data:Object):void;

        fault(data:Object):void;
    }

    class DataQuery implements DataQueryValue {
        properties:Array<string>;
        condition:string;
        options:Object;
        url:string;

        addProperty(prop:string):void;
    }

    class DataStore {
        model:Function|Object;
        className:string;
        restUrl:string;

        constructor(name:string|Object|Function);

        save(obj:Object, async:Async):XMLHttpRequest;
        save(obj:Object):Object;

        remove(id:Object|string, async:Async):XMLHttpRequest;
        remove(obj:Object|string):Object;

        find():Object;
        find(async:Async):XMLHttpRequest;
        find(obj:DataQuery|DataQueryValue|string):Object;
        find(id:DataQuery|DataQueryValue|string, async:Async):XMLHttpRequest;
        find(id:DataQuery|DataQueryValue|string, async:Async):XMLHttpRequest;

        findById(query:DataQuery|DataQueryValue|string):Object;
        findById(query:DataQuery|DataQueryValue|string, async:Async):XMLHttpRequest;

        findFirst():Object;
        findFirst(async:Async):XMLHttpRequest;
        findFirst(query:DataQuery|DataQueryValue):Object;
        findFirst(query:DataQuery|DataQueryValue, async:Async):XMLHttpRequest;

        findLast():Object;
        findLast(async:Async):XMLHttpRequest;
        findLast(query:DataQuery|DataQueryValue):Object;
        findLast(query:DataQuery|DataQueryValue, async:Async):XMLHttpRequest;

        loadRelations(query:DataQuery|DataQueryValue|string):void;
        loadRelations(query:DataQuery|DataQueryValue|string, relation:Array<string>):void;
    }

    class Persistence {
        Permissions:DataPermissions;

        of(model:string|Object|Function):DataStore;

        save(model:DataStore|string, data:Object):Object;
        save(model:DataStore|string, data:Object, async:Async):XMLHttpRequest;

        getView(viewName:string, whereClause:string, pageSize:number, offset:number, async:Object):XMLHttpRequest;

        getView(viewName:string, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause?:string, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause?:string, pageSize?:number, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause?:string, pageSize?:number, offset?:number, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause?:string, pageSize?:number, offset?:number):Object;

        describe(model:string|Object|Function, async):XMLHttpRequest;
        describe(model:string|Object|Function):Object;

        callStoredProcedure(spName:string, argumentValues:Object|string, async:Async):XMLHttpRequest;
        callStoredProcedure(spName:string, argumentValues:Object|string):Object;
    }

    class DataPermissions {
        restUrl:string;

        getRestUrl(obj:DataItem, type:string):string;

        FIND:{
            grantUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            grantUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grantRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            grantRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grant(dataItem:ExistDataItem):ExistDataItem;
            grant(dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            denyUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            denyRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            deny(dataItem:ExistDataItem):ExistDataItem;
            deny(dataItem:ExistDataItem, async:Async):XMLHttpRequest;
        };

        REMOVE:{
            grantUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            grantUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grantRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            grantRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grant(dataItem:ExistDataItem):ExistDataItem;
            grant(dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            denyUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            denyRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            deny(dataItem:ExistDataItem):ExistDataItem;
            deny(dataItem:ExistDataItem, async:Async):XMLHttpRequest;
        };

        UPDATE:{
            grantUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            grantUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grantRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            grantRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            grant(dataItem:ExistDataItem):ExistDataItem;
            grant(dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyUser(userId:string, dataItem:ExistDataItem):ExistDataItem;
            denyUser(userId:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            denyRole(roleName:string, dataItem:ExistDataItem):ExistDataItem;
            denyRole(roleName:string, dataItem:ExistDataItem, async:Async):XMLHttpRequest;

            deny(dataItem:ExistDataItem):ExistDataItem;
            deny(dataItem:ExistDataItem, async:Async):XMLHttpRequest;
        };
    }

    class Geo {
        restUrl:string;

        UNITS:Object;
        EARTH_RADIUS:number;

        addPoint(point:GeoPoint):GeoPoint;
        addPoint(point:GeoPoint, async:Async):XMLHttpRequest;

        find(query:BackendlessGeoQuery):GeoCollectionResult;
        find(query:BackendlessGeoQuery, async:Async):XMLHttpRequest;

        deletePoint(pointId:string):string;
        deletePoint(point:GeoPoint):string;
        deletePoint(pointId:string, async:Async):XMLHttpRequest;
        deletePoint(point:GeoPoint, async:Async):XMLHttpRequest;

        loadMetadata(point:GeoPoint|GeoCluster):Object;
        loadMetadata(point:GeoPoint|GeoCluster, async:Async):XMLHttpRequest;

        getClusterPoints(cluster:GeoCluster):GeoCollectionResult;
        getClusterPoints(cluster:GeoCluster, async:Async):XMLHttpRequest;

        getFencePoints(fenceName:string, query:BackendlessGeoQuery):GeoCollectionResult;
        getFencePoints(fenceName:string, query:BackendlessGeoQuery, async:Async):XMLHttpRequest;

        relativeFind(query:BackendlessGeoQuery):GeoCollectionResult;
        relativeFind(query:BackendlessGeoQuery, async:Async):XMLHttpRequest;

        addCategory(name:string):GeoCategory;
        addCategory(name:string, async:Async):XMLHttpRequest;

        deleteCategory(name:string):boolean;
        deleteCategory(name:string, async:Async):XMLHttpRequest;

        getCategories():GeoCategories;
        getCategories(async:Async):XMLHttpRequest;

        runOnStayAction(fenceName:string, point:GeoPoint):Object;
        runOnStayAction(fenceName:string, point:GeoPoint, async:Async):XMLHttpRequest;

        runOnExitAction(fenceName:string, point:GeoPoint):Object;
        runOnExitAction(fenceName:string, point:GeoPoint, async:Async):XMLHttpRequest;

        runOnEnterAction(fenceName:string, point:GeoPoint):Object;
        runOnEnterAction(fenceName:string, point:GeoPoint, async:Async):XMLHttpRequest;

        startGeofenceMonitoringWithInAppCallback(fenceName:string, inAppCallback:GeofenceMonitoringCallbacks, async?:Async):void;

        startGeofenceMonitoringWithRemoteCallback(fenceName:string, point:GeoPoint, async?:Async):void;

        stopGeofenceMonitoring(fenceName:string):void;
    }

    class UserService {
        restUrl:string;

        register(user:User):User;
        register(user:User, async:Async):XMLHttpRequest;

        getUserRoles():User;
        getUserRoles(async:Async):XMLHttpRequest;

        describeUserClass():User;
        describeUserClass(async:Async):XMLHttpRequest;

        restorePassword(email:string):User;
        restorePassword(email:string, async:Async):XMLHttpRequest;

        assignRole(userName:string, roleName:string):User;
        assignRole(userName:string, roleName:string, async:Async):XMLHttpRequest;

        unassignRole(userName:string, roleName:string):User;
        unassignRole(userName:string, roleName:string, async:Async):XMLHttpRequest;

        login(userName:string, password:string, stayLoggedIn?:boolean):User;
        login(userName:string, password:string, stayLoggedIn?:boolean, async:Async):XMLHttpRequest;

        loggedInUser():boolean;

        logout():void;
        logout(async:Async):XMLHttpRequest;

        getCurrentUser():User;

        update(user:User):User;
        update(user:User, async:Async):XMLHttpRequest;

        loginWithFacebook(fields?:Object, permissions?:Object, async?:Async, container?:HTMLElement):void;

        loginWithGooglePlus(fields?:Object, permissions?:Object, async?:Async, container?:HTMLElement):void;

        loginWithTwitter(fields?:Object, async?:Async):void;

        loginWithFacebookSdk(fields?:Object, async?:Async):void;

        loginWithGooglePlusSdk(fields?:Object, async?:Async):void;

        isValidLogin():boolean;
        isValidLogin(async:Async):XMLHttpRequest;
    }

    class User {
        ___class:string;
    }

    class Messaging {
        restUrl:string;
        channelProperties:Object;

        subscribe(channelName:string, subscriptionCallback:()=>void, subscriptionOptions:SubscriptionOptions):Subscription;
        subscribe(channelName:string, subscriptionCallback:()=>void, subscriptionOptions:SubscriptionOptions, async:Async):XMLHttpRequest;

        publish(channelName:string, message:string|Object, publishOptions:PublishOptions, deliveryOptions:DeliveryOptions):Object;
        publish(channelName:string, message:string|Object, publishOptions:PublishOptions, deliveryOptions:DeliveryOptions, async:Async):XMLHttpRequest;

        sendEmail(subject:string, bodyParts:Bodyparts, recipients:string[], attachments:string[]):Object;
        sendEmail(subject:string, bodyParts:Bodyparts, recipients:string[], attachments:string[], async:Async):XMLHttpRequest;

        cancel(messageId:string):boolean;
        cancel(messageId:string, async:Async):XMLHttpRequest;

        registerDevice(channels:string[], expiration:number|Date):Object;
        registerDevice(channels:string[], expiration:number|Date, async:Async):XMLHttpRequest;

        getRegistrations():Object;
        getRegistrations(async:Async):XMLHttpRequest;

        unregisterDevice():Object;
        unregisterDevice(async:Async):XMLHttpRequest;
    }

    class Files {
        restUrl:string;
        Permissions:FilePermissions;

        saveFile(path:string, fileName:string, fileContent:Blob):boolean;
        saveFile(path:string, fileName:string, fileContent:Blob, async:Async):void;
        saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean):boolean;
        saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean, async:Async):void;

        upload(files:File|File[], path:string, overwrite:boolean, async:Async):void;

        listing(path:string):Object;
        listing(path:string, async:Async):XMLHttpRequest;
        listing(path:string, pattern:string):Object;
        listing(path:string, pattern:string, async:Async):XMLHttpRequest;
        listing(path:string, pattern:string, recursively:boolean):Object;
        listing(path:string, pattern:string, recursively:boolean, async:Async):XMLHttpRequest;
        listing(path:string, pattern:string, recursively:boolean, pageSize:number):Object;
        listing(path:string, pattern:string, recursively:boolean, pageSize:number, async:Async):XMLHttpRequest;
        listing(path:string, pattern:string, recursively:boolean, pageSize:number, offset:number):Object;
        listing(path:string, pattern:string, recursively:boolean, pageSize:number, offset:number, async:Async):XMLHttpRequest;

        renameFile(oldPathName:string, newName:string):Object;
        renameFile(oldPathName:string, newName:string, async:Async):void;

        moveFile(sourcePath:string, targetPath:string):Object;
        moveFile(sourcePath:string, targetPath:string, async:Async):void;

        copyFile(sourcePath:string, targetPath:string):Object;
        copyFile(sourcePath:string, targetPath:string, async:Async):void;

        remove(fileURL:string):void;
        remove(fileURL:string, async:Async):void;

        exists(path:string):Object;
        exists(path:string, async:Async):XMLHttpRequest;

        removeDirectory(path:string):void;
        removeDirectory(path:string, async:Async):void;
    }

    class FilePermissions {
        restUrl:string;

        grantUser(userId:string, url:string, permissionType:string):Object;
        grantUser(userId:string, url:string, permissionType:string, async:Async):XMLHttpRequest;

        grantRole(roleName:string, url:string, permissionType:string):Object;
        grantRole(roleName:string, url:string, permissionType:string, async:Async):XMLHttpRequest;

        denyUser(userId:string, url:string, permissionType:string):Object;
        denyUser(userId:string, url:string, permissionType:string, async:Async):XMLHttpRequest;

        denyRole(roleName:string, url:string, permissionType:string):Object;
        denyRole(roleName:string, url:string, permissionType:string, async:Async):XMLHttpRequest;
    }

    class Commerce {
        restUrl:string;

        validatePlayPurchase(packageName:string, productId:string, token:string):Object;
        validatePlayPurchase(packageName:string, productId:string, token:string, async:Async):XMLHttpRequest;

        cancelPlaySubscription(packageName:string, subscriptionId:string, token:string):Object;
        cancelPlaySubscription(packageName:string, subscriptionId:string, token:string, async:Async):XMLHttpRequest;

        getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string):Object;
        getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string, async:Async):XMLHttpRequest;
    }

    class Events {
        restUrl:string;

        dispatch(eventName:string, eventArgs:Object):Object;
        dispatch(eventName:string, eventArgs:Object, async:Async):XMLHttpRequest;
    }

    class Cache {
        put(key:string, value:any):Object;
        put(key:string, value:any, timeToLive:number):Object;
        put(key:string, value:any, async:Async):XMLHttpRequest;
        put(key:string, value:any, timeToLive:number):Object;
        put(key:string, value:any, timeToLive:number, async:Async):XMLHttpRequest;

        expireIn(key:string, time:number|Date):Object;
        expireIn(key:string, time:number|Date, async:Async):XMLHttpRequest;

        expireAt(key:string, time:number|Date):Object;
        expireAt(key:string, time:number|Date, async:Async):XMLHttpRequest;

        contains(key:string):Object;
        contains(key:string, async:Async):XMLHttpRequest;

        get(key:string):Object;
        get(key:string, async:Async):XMLHttpRequest;

        remove(key:string):Object;
        remove(key:string, async:Async):XMLHttpRequest;
    }

    class Counters {
        of(counterName:string):AtomicInstance;

        get(counterName:string):number;
        get(counterName:string, async:Async):XMLHttpRequest;

        getAndIncrement(counterName:string):number;
        getAndIncrement(counterName:string, async:Async):XMLHttpRequest;

        incrementAndGet(counterName:string):number;
        incrementAndGet(counterName:string, async:Async):XMLHttpRequest;

        getAndDecrement(counterName:string):number;
        getAndDecrement(counterName:string, async:Async):XMLHttpRequest;

        decrementAndGet(counterName:string):number;
        decrementAndGet(counterName:string, async:Async):XMLHttpRequest;

        addAndGet(counterName:string, value:number):number;
        addAndGet(counterName:string, value:number, async:Async):XMLHttpRequest;

        getAndAdd(counterName:string, value:number):number;
        getAndAdd(counterName:string, value:number, async:Async):XMLHttpRequest;

        compareAndSet(counterName:string, expected:number, updated:number):number;
        compareAndSet(counterName:string, expected:number, updated:number, async:Async):XMLHttpRequest;

        reset(counterName:string):number;
        reset(counterName:string, async:Async):XMLHttpRequest;
    }

    class AtomicInstance {
        get():number;
        get(async:Async):XMLHttpRequest;

        getAndIncrement():number;
        getAndIncrement(async:Async):XMLHttpRequest;

        incrementAndGet():number;
        incrementAndGet(async:Async):XMLHttpRequest;

        getAndDecrement():number;
        getAndDecrement(async:Async):XMLHttpRequest;

        decrementAndGet():number;
        decrementAndGet(async:Async):XMLHttpRequest;

        addAndGet(value:number):number;
        addAndGet(value:number, async:Async):XMLHttpRequest;

        getAndAdd(value:number):number;
        getAndAdd(value:number, async:Async):XMLHttpRequest;

        compareAndSet(expected:number, updated:number):number;
        compareAndSet(expected:number, updated:number, async:Async):XMLHttpRequest;

        reset():number;
        reset(async:Async):XMLHttpRequest;
    }

    class CustomServices {
        invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object):Object;
        invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object, async:Async):XMLHttpRequest;
    }

    class Logging {
        debug(message:string):void;

        info(message:string):void;

        warn(message:string):void;

        error(message:string):void;

        fatal(message:string):void;

        trace(message:string):void;
    }
}

interface GeoPoint {
    ___class?:string;
    objectId?:string;
    latitude:number;
    longitude:number;
    categories?:string|string[];
    metadata?:Object;
}

interface GeoCluster extends GeoPoint {
    totalPoints:number;
    geoQuery:BackendlessGeoQuery |BackendlessRectangleGeoQuery| BackendlessCircleGeoQuery;
}

interface BackendlessGeoQuery {
    categories?:string|string[];
    includeMetadata?:boolean;
    metadata?:Object;
    condition?:string;
    relativeFindMetadata?:Object;
    relativeFindPercentThreshold?:number;
    pageSize?:number;
    offset?:number;
}

interface BackendlessRectangleGeoQuery extends BackendlessGeoQuery {
    searchRectangle:number[];
}

interface BackendlessCircleGeoQuery extends BackendlessGeoQuery {
    latitude:number;
    longitude:number;
    radius:number;
    units:string;
}

interface CollectionResult {
    offset: number;
    totalObjects: number;
    getPage : (offset:number, pageSize:number, async:Backendless.Async)=>any;
    nextPage: (async:Backendless.Async)=>any;
}

interface GeoCollectionResult extends CollectionResult {
    data:Array<GeoPoint|GeoCluster>;
}

interface SubscriptionOptions {
    subscriberId?:string;
    subtopic?:string;
    selector?:string;
}

interface PublishOptions {
    publisherId?:string;
    headers?:Object;
    subtopic?:string;
}

interface DeliveryOptions {
    pushPolicy?:string;
    pushBroadcast?:number;
    pushSinglecast?:Array;
    publishAt?:number;
    repeatEvery?:number;
    repeatExpiresAt?:number;
}

interface Bodyparts {
    textmessage?:string;
    htmlmessage?:string;
}

declare module "backendless" {
    export = Backendless;
}
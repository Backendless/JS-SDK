/**
 * @global
 * @namespace Backendless
 */
declare module __Backendless {
    import Backendless = __Backendless;

    var VERSION:string;
    var serverURL:string;
    var applicationId:string;
    var secretKey:string;
    var appVersion:string;
    var appPath:string;
    var XMLHttpRequest:any;

    var browser:{
        browser:string;
        version:string;
    };

    /**
     * @dictionary
     */
    var PublishOptionsHeaders:{ [key: string]: string; };


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
     * @public
     * @type: Function
     **/
    function enablePromises():void;

    /**
     * @namespace Backendless.Utils
     **/
    var Utils:Backendless.UtilsI;

    /**
     * @namespace Backendless.LocalCache
     **/
    var LocalCache:Backendless.LocalCacheI;

    /**
     * @namespace Backendless.Persistence
     **/
    var Persistence:Backendless.PersistenceClass;

    /**
     * @namespace Backendless.Data
     **/
    var Data:Backendless.PersistenceClass;

    /**
     * @namespace Backendless.UserService
     **/
    var UserService:Backendless.UserServiceClass;

    /**
     * @namespace Backendless.Geo
     **/
    var Geo:Backendless.GeoClass;

    /**
     * @namespace Backendless.Messaging
     **/
    var Messaging:Backendless.MessagingClass;

    /**
     * @namespace Backendless.Files
     **/
    var Files:Backendless.FilesClass;

    /**
     * @namespace Backendless.Commerce
     **/
    var Commerce:Backendless.CommerceClass;

    /**
     * @namespace Backendless.Events
     **/
    var Events:Backendless.EventsClass;

    /**
     * @namespace Backendless.Cache
     **/
    var Cache:Backendless.CacheClass;

    /**
     * @namespace Backendless.Counters
     **/
    var Counters:Backendless.CountersClass;

    /**
     * @namespace Backendless.CustomServices
     **/
    var CustomServices:Backendless.CustomServicesClass;

    /**
     * @namespace Backendless.Logging
     **/
    var Logging:LoggingI;

    /**
     * @public
     * @class Backendless.Async
     * @constructor
     */
    class Async {
        constructor(onSuccess?:(data?:Object) => void, onError?:((data:Object) => void) | Object, context?:Object);

        success(data:Object):void;

        fault(data:Object):void;
    }

    /**
     * @public
     * @class Backendless.User
     * @constructor
     */
    class User {
        ___class:string;
        username:string;
        password:string;
        email:string;
    }

    /**
     * @public
     * @class Backendless.DataQuery
     * @constructor
     */
    class DataQuery implements Backendless.DataQueryValueI {
        properties:string[];
        condition:string;
        options:Object;
        url:string;

        addProperty(prop:string):void;
    }

    /**
     * @public
     * @class Backendless.GeoPoint
     * @constructor
     */
    class GeoPoint {
        ___class:string;
        objectId:string;
        latitude:number;
        longitude:number;
        categories:string|string[];
        metadata:Object;
    }

    /**
     * @public
     * @class Backendless.GeoCluster
     * @extends GeoPoint
     * @constructor
     */
    class GeoCluster extends Backendless.GeoPoint {
        totalPoints:number;
        geoQuery:Backendless.GeoQuery | Backendless.RectangleGeoQueryI | Backendless.CircleGeoQueryI;
    }

    /**
     * @public
     * @class Backendless.GeoQuery
     * @constructor
     */
    class GeoQuery implements Backendless.GeoQueryI {
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
     * @class Backendless.PublishOptions
     * @constructor
     */
    class PublishOptions {
        publisherId:string;
        headers:Object;
        subtopic:string;

        constructor(args?:Object);
    }

    /**
     * @public
     * @class Backendless.DeliveryOptions
     * @constructor
     */
    class DeliveryOptions {
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
     * @class Backendless.Bodyparts
     * @constructor
     */
    class Bodyparts {
        textmessage:string;
        htmlmessage:string;

        constructor(args?:Object);
    }

    /**
     * @public
     * @class Backendless.SubscriptionOptions
     * @constructor
     */
    class SubscriptionOptions {
        subscriberId:string;
        subtopic:string;
        selector:string;

        constructor(args?:Object);
    }

    /**
     * @private
     * @class Logger
     */
    class Logger {
        debug(message:string):void;

        info(message:string):void;

        warn(message:string):void;

        error(message:string):void;

        fatal(message:string):void;

        trace(message:string):void;
    }

    /**
     * @private
     * @class Proxy
     */
    class Proxy {
        eventHandlers:Object;

        on(eventName:string, handler:(data:any)=>any):void;

        fireEvent(eventName:string, data:any):void;
    }

    /**
     * @private
     * @class PollingProxy
     */
    class PollingProxy extends Backendless.Proxy {
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
     * @class SocketProxy
     */
    class SocketProxy extends Backendless.Proxy {
        reconnectWithPolling:boolean;
        socket:WebSocket;

        onMessage():void;

        onSocketClose(data):void;

        close():void;
    }

    /**
     * @private
     * @class DataStore
     */
    class DataStore {
        model:Function|Object;
        className:string;
        restUrl:string;

        constructor(name:string|Object|Function);

        save(obj:Object, async:Backendless.Async):XMLHttpRequest;
        save(obj:Object):Object;
        save<Promise>(obj:Object):Promise;

        remove(id:Object|string, async:Backendless.Async):XMLHttpRequest;
        remove(obj:Object|string):Object;
        remove<Promise>(obj:Object|string):Promise;

        find():Object;
        find(async:Backendless.Async):XMLHttpRequest;
        find(obj:Backendless.DataQuery|Backendless.DataQueryValueI|string):Object;
        find(id:Backendless.DataQuery|Backendless.DataQueryValueI|string, async:Backendless.Async):XMLHttpRequest;
        find<Promise>():Promise;
        find<Promise>(obj:Backendless.DataQuery|Backendless.DataQueryValueI|string):Promise;

        findById(query:Backendless.DataQuery|DataQueryValueI|string):Object;
        findById(query:Backendless.DataQuery|DataQueryValueI|string, async:Backendless.Async):XMLHttpRequest;
        findById<Promise>(query:Backendless.DataQuery|DataQueryValueI|string):Promise;

        findFirst():Object;
        findFirst(async:Backendless.Async):XMLHttpRequest;
        findFirst(query:Backendless.DataQuery|DataQueryValueI):Object;
        findFirst(query:Backendless.DataQuery|DataQueryValueI, async:Backendless.Async):XMLHttpRequest;
        findFirst<Promise>():Promise;
        findFirst<Promise>(query:Backendless.DataQuery|DataQueryValueI):Promise;

        findLast():Object;
        findLast(async:Backendless.Async):XMLHttpRequest;
        findLast(query:Backendless.DataQuery|DataQueryValueI):Object;
        findLast(query:Backendless.DataQuery|DataQueryValueI, async:Backendless.Async):XMLHttpRequest;
        findLast<Promise>():Promise;
        findLast<Promise>(query:Backendless.DataQuery|DataQueryValueI):Promise;

        loadRelations(query:Backendless.DataQuery|DataQueryValueI|string):void;
        loadRelations(query:Backendless.DataQuery|DataQueryValueI|string, relation:Array<string>):void;
        loadRelations<Promise>(query:Backendless.DataQuery|DataQueryValueI|string):Promise;
        loadRelations<Promise>(query:Backendless.DataQuery|DataQueryValueI|string, relation:Array<string>):Promise;
    }

    /**
     * @private
     * @class AtomicInstance
     */
    class AtomicInstance {

        constructor(counterName:string);

        get():number;
        get(async:Backendless.Async):XMLHttpRequest;
        get<Promise>():Promise;

        getAndIncrement():number;
        getAndIncrement(async:Backendless.Async):XMLHttpRequest;
        getAndIncrement<Promise>():Promise;

        incrementAndGet():number;
        incrementAndGet(async:Backendless.Async):XMLHttpRequest;
        incrementAndGet<Promise>():Promise;

        getAndDecrement():number;
        getAndDecrement(async:Backendless.Async):XMLHttpRequest;
        getAndDecrement<Promise>():Promise;

        decrementAndGet():number;
        decrementAndGet(async:Backendless.Async):XMLHttpRequest;
        decrementAndGet<Promise>():Promise;

        addAndGet(value:number):number;
        addAndGet(value:number, async:Backendless.Async):XMLHttpRequest;
        addAndGet<Promise>(value:number):Promise;

        getAndAdd(value:number):number;
        getAndAdd(value:number, async:Backendless.Async):XMLHttpRequest;
        getAndAdd<Promise>(value:number):Promise;

        compareAndSet(expected:number, updated:number):number;
        compareAndSet(expected:number, updated:number, async:Backendless.Async):XMLHttpRequest;
        compareAndSet<Promise>(expected:number, updated:number):Promise;

        reset():number;
        reset(async:Backendless.Async):XMLHttpRequest;
        reset<Promise>():Promise;
    }

    /**
     * @private
     * @class Persistence
     * @refers {@link Backendless.Persistence}
     */
    class PersistenceClass {

        /**
         * @namespace Backendless.Persistence.Permissions
         **/
        Permissions:PersistencePermissionsClass;

        of(model:string|Object|Function):Backendless.DataStore;

        save(model:Backendless.DataStore|string, data:Object):Object;
        save(model:Backendless.DataStore|string, data:Object, async:Backendless.Async):XMLHttpRequest;
        save<Promise>(model:Backendless.DataStore|string, data:Object):Promise;

        getView(viewName:string):Object;
        getView(viewName:string, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause:string):Object;
        getView(viewName:string, whereClause:string, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause:string, pageSize:number):Object;
        getView(viewName:string, whereClause:string, pageSize:number, async:Object):XMLHttpRequest;
        getView(viewName:string, whereClause:string, pageSize:number, offset:number):Object;
        getView(viewName:string, whereClause:string, pageSize:number, offset:number, async:Object):XMLHttpRequest;
        getView<Promise>(viewName:string, whereClause?:string, pageSize?:number, offset?:number):Promise;

        describe(model:string|Object|Function, async):XMLHttpRequest;
        describe(model:string|Object|Function):Object;
        describe<Promise>(model:string|Object|Function):Promise;

        callStoredProcedure(spName:string, argumentValues:Object|string, async:Backendless.Async):XMLHttpRequest;
        callStoredProcedure(spName:string, argumentValues:Object|string):Object;
        callStoredProcedure<Promise>(spName:string, argumentValues:Object|string):Promise;
    }

    /**
     * @private
     * @class PersistencePermissions
     * @refers {@link Backendless.Persistence.Permissions}
     */
    class PersistencePermissionsClass {
        restUrl:string;

        getRestUrl(obj:DataItemI, type:string):string;

        FIND:{
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantUser<Promise>(userId:string, dataItem:ExistDataItemI):Promise;

            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            grant(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grant(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grant<Promise>(dataItem:Backendless.ExistDataItemI):Promise;

            denyUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyUser<Promise>(userId:string, dataItem:Backendless.ExistDataItemI):Promise;

            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            deny(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            deny(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            deny<Promise>(dataItem:Backendless.ExistDataItemI):Promise;
        };

        REMOVE:{
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantUser<Promise>(userId:string, dataItem:ExistDataItemI):Promise;

            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            grant(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grant(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grant<Promise>(dataItem:Backendless.ExistDataItemI):Promise;

            denyUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyUser<Promise>(userId:string, dataItem:Backendless.ExistDataItemI):Promise;

            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            deny(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            deny(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            deny<Promise>(dataItem:Backendless.ExistDataItemI):Promise;
        };

        UPDATE:{
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantUser<Promise>(userId:string, dataItem:ExistDataItemI):Promise;

            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grantRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grantRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            grant(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            grant(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            grant<Promise>(dataItem:Backendless.ExistDataItemI):Promise;

            denyUser(userId:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyUser(userId:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyUser<Promise>(userId:string, dataItem:Backendless.ExistDataItemI):Promise;

            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            denyRole(roleName:string, dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            denyRole<Promise>(roleName:string, dataItem:Backendless.ExistDataItemI):Promise;

            deny(dataItem:Backendless.ExistDataItemI):Backendless.ExistDataItemI;
            deny(dataItem:Backendless.ExistDataItemI, async:Backendless.Async):XMLHttpRequest;
            deny<Promise>(dataItem:Backendless.ExistDataItemI):Promise;
        };
    }

    /**
     * @private
     * @class Geo
     * @refers {@link Backendless.Geo}
     */
    class GeoClass {
        restUrl:string;

        UNITS:Object;
        EARTH_RADIUS:number;

        addPoint(point:Backendless.GeoPoint):Backendless.GeoPoint;
        addPoint(point:Backendless.GeoPoint, async:Backendless.Async):XMLHttpRequest;
        addPoint<Promise>(point:Backendless.GeoPoint):Promise;

        find(query:Backendless.GeoQueryI):Backendless.GeoCollectionResultI;
        find(query:Backendless.GeoQueryI, async:Backendless.Async):XMLHttpRequest;
        find<Promise>(query:Backendless.GeoQueryI):Promise;

        deletePoint(pointId:string):string;
        deletePoint(point:Backendless.GeoPoint):string;
        deletePoint(pointId:string, async:Backendless.Async):XMLHttpRequest;
        deletePoint(point:Backendless.GeoPoint, async:Backendless.Async):XMLHttpRequest;
        deletePoint<Promise>(pointId:string):Promise;
        deletePoint<Promise>(point:Backendless.GeoPoint):Promise;

        loadMetadata(point:Backendless.GeoPoint|Backendless.GeoCluster):Object;
        loadMetadata(point:Backendless.GeoPoint|Backendless.GeoCluster, async:Backendless.Async):XMLHttpRequest;
        loadMetadata<Promise>(point:Backendless.GeoPoint|Backendless.GeoCluster):Promise;

        getClusterPoints(cluster:Backendless.GeoCluster):GeoCollectionResultI;
        getClusterPoints(cluster:Backendless.GeoCluster, async:Backendless.Async):XMLHttpRequest;
        getClusterPoints<Promise>(cluster:Backendless.GeoCluster):Promise;

        getFencePoints(fenceName:string, query:Backendless.GeoQueryI):Backendless.GeoCollectionResultI;
        getFencePoints(fenceName:string, query:Backendless.GeoQueryI, async:Backendless.Async):XMLHttpRequest;
        getFencePoints<Promise>(fenceName:string, query:Backendless.GeoQueryI):Promise;

        relativeFind(query:Backendless.GeoQueryI):Backendless.GeoCollectionResultI;
        relativeFind(query:Backendless.GeoQueryI, async:Backendless.Async):XMLHttpRequest;
        relativeFind<Promise>(query:Backendless.GeoQueryI):Promise;

        addCategory(name:string):Backendless.GeoCategoryI;
        addCategory(name:string, async:Backendless.Async):XMLHttpRequest;
        addCategory<Promise>(name:string):Promise;

        deleteCategory(name:string):boolean;
        deleteCategory(name:string, async:Backendless.Async):XMLHttpRequest;
        deleteCategory<Promise>(name:string):Promise;

        getCategories():Backendless.GeoCategoryI[];
        getCategories(async:Backendless.Async):XMLHttpRequest;
        getCategories<Promise>():Promise;

        runOnStayAction(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnStayAction(fenceName:string, point:Backendless.GeoPoint, async:Backendless.Async):XMLHttpRequest;
        runOnStayAction<Promise>(fenceName:string, point:Backendless.GeoPoint):Promise;

        runOnExitAction(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnExitAction(fenceName:string, point:Backendless.GeoPoint, async:Backendless.Async):XMLHttpRequest;
        runOnExitAction<Promise>(fenceName:string, point:Backendless.GeoPoint):Promise;

        runOnEnterAction(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnEnterAction(fenceName:string, point:Backendless.GeoPoint, async:Backendless.Async):XMLHttpRequest;
        runOnEnterAction<Promise>(fenceName:string, point:Backendless.GeoPoint):Promise;

        startGeofenceMonitoringWithInAppCallback(fenceName:string, inAppCallback:Backendless.GeofenceMonitoringCallbacksI, async?:Backendless.Async):void;
        startGeofenceMonitoringWithInAppCallback<Promise>(fenceName:string, inAppCallback:Backendless.GeofenceMonitoringCallbacksI):Promise;

        startGeofenceMonitoringWithRemoteCallback(fenceName:string, point:Backendless.GeoPoint, async?:Backendless.Async):void;
        startGeofenceMonitoringWithRemoteCallback<Promise>(fenceName:string, point:Backendless.GeoPoint):Promise;

        stopGeofenceMonitoring(fenceName:string):void;
    }

    /**
     * @private
     * @class Messaging
     * @refers {@link Backendless.Messaging}
     */
    class MessagingClass {
        restUrl:string;
        channelProperties:Object;

        subscribe(channelName:string, subscriptionCallback:() => void, subscriptionOptions:Backendless.SubscriptionOptions):Backendless.SubscriptionI;
        subscribe(channelName:string, subscriptionCallback:() => void, subscriptionOptions:Backendless.SubscriptionOptions, async:Backendless.Async):XMLHttpRequest;
        subscribe<Promise>(channelName:string, subscriptionCallback:() => void, subscriptionOptions:Backendless.SubscriptionOptions):Promise;

        publish(channelName:string, message:string|Object, publishOptions:Backendless.PublishOptions, deliveryOptions:Backendless.DeliveryOptions):Object;
        publish(channelName:string, message:string|Object, publishOptions:Backendless.PublishOptions, deliveryOptions:Backendless.DeliveryOptions, async:Backendless.Async):XMLHttpRequest;
        publish<Promise>(channelName:string, message:string|Object, publishOptions:Backendless.PublishOptions, deliveryOptions:Backendless.DeliveryOptions):Promise;

        sendEmail(subject:string, bodyParts:Backendless.Bodyparts, recipients:string[], attachments:string[]):Object;
        sendEmail(subject:string, bodyParts:Backendless.Bodyparts, recipients:string[], attachments:string[], async:Backendless.Async):XMLHttpRequest;
        sendEmail<Promise>(subject:string, bodyParts:Backendless.Bodyparts, recipients:string[], attachments:string[]):Promise;

        cancel(messageId:string):boolean;
        cancel(messageId:string, async:Backendless.Async):XMLHttpRequest;
        cancel<Promise>(messageId:string):Promise;

        registerDevice(channels:string[], expiration:number|Date):Object;
        registerDevice(channels:string[], expiration:number|Date, async:Backendless.Async):XMLHttpRequest;
        registerDevice<Promise>(channels:string[], expiration:number|Date):Promise;

        getRegistrations():Object;
        getRegistrations(async:Backendless.Async):XMLHttpRequest;
        getRegistrations<Promise>():Promise;

        unregisterDevice():Object;
        unregisterDevice(async:Backendless.Async):XMLHttpRequest;
        unregisterDevice<Promise>():Promise;

        getMessageStatus(messageId:string):Object;
        getMessageStatus(messageId:string, async:Backendless.Async):XMLHttpRequest;
        getMessageStatus<Promise>(messageId:string):Promise;
    }

    /**
     * @private
     * @class Files
     * @refers {@link Backendless.Files}
     */
    class FilesClass {
        /**
         * @namespace Backendless.Files.Permissions
         **/
        Permissions:FilesPermissions;

        restUrl:string;

        saveFile(path:string, fileName:string, fileContent:Blob):boolean;
        saveFile(path:string, fileName:string, fileContent:Blob, async:Backendless.Async):void;
        saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean):boolean;
        saveFile(path:string, fileName:string, fileContent:Blob, overwrite:boolean, async:Backendless.Async):void;
        saveFile<Promise>(path:string, fileName:string, fileContent:Blob):Promise;
        saveFile<Promise>(path:string, fileName:string, fileContent:Blob, overwrite:boolean):Promise;

        upload(files:File|File[], path:string, overwrite:boolean, async?:Backendless.Async):void;
        upload<Promise>(files:File|File[], path:string, overwrite:boolean):Promise;

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
        listing<Promise>(path:string, pattern?:string, recursively?:boolean, pageSize?:number, offset?:number):Promise;

        renameFile(oldPathName:string, newName:string):Object;
        renameFile(oldPathName:string, newName:string, async:Backendless.Async):void;
        renameFile<Promise>(oldPathName:string, newName:string):Promise;

        moveFile(sourcePath:string, targetPath:string):Object;
        moveFile(sourcePath:string, targetPath:string, async:Backendless.Async):void;
        moveFile<Promise>(sourcePath:string, targetPath:string):Promise;

        copyFile(sourcePath:string, targetPath:string):Object;
        copyFile(sourcePath:string, targetPath:string, async:Backendless.Async):void;
        copyFile<Promise>(sourcePath:string, targetPath:string):Promise;

        remove(fileURL:string):void;
        remove(fileURL:string, async:Backendless.Async):void;
        remove<Promise>(fileURL:string):Promise;

        exists(path:string):Object;
        exists(path:string, async:Backendless.Async):XMLHttpRequest;
        exists<Promise>(path:string):Promise;

        removeDirectory(path:string):void;
        removeDirectory(path:string, async:Backendless.Async):void;
        removeDirectory<Promise>(path:string):Promise;
    }

    /**
     * @private
     * @class FilesPermissions
     * @refers {@link Backendless.Files.Permissions}
     */
    class FilesPermissions {
        restUrl:string;

        grantUser(userId:string, url:string, permissionType:string):Object;
        grantUser(userId:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;
        grantUser<Promise>(userId:string, url:string, permissionType:string):Promise;

        grantRole(roleName:string, url:string, permissionType:string):Object;
        grantRole(roleName:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;
        grantRole<Promise>(roleName:string, url:string, permissionType:string):Promise;

        denyUser(userId:string, url:string, permissionType:string):Object;
        denyUser(userId:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;
        denyUser<Promise>(userId:string, url:string, permissionType:string):Promise;

        denyRole(roleName:string, url:string, permissionType:string):Object;
        denyRole(roleName:string, url:string, permissionType:string, async:Backendless.Async):XMLHttpRequest;
        denyRole<Promise>(roleName:string, url:string, permissionType:string):Promise;
    }

    /**
     * @private
     * @class Commerce
     * @refers {@link Backendless.Commerce}
     */
    class CommerceClass {
        restUrl:string;

        validatePlayPurchase(packageName:string, productId:string, token:string):Object;
        validatePlayPurchase(packageName:string, productId:string, token:string, async:Backendless.Async):XMLHttpRequest;
        validatePlayPurchase<Promise>(packageName:string, productId:string, token:string):Promise;

        cancelPlaySubscription(packageName:string, subscriptionId:string, token:string):Object;
        cancelPlaySubscription(packageName:string, subscriptionId:string, token:string, async:Backendless.Async):XMLHttpRequest;
        cancelPlaySubscription<Promise>(packageName:string, subscriptionId:string, token:string):Promise;

        getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string):Object;
        getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string, async:Backendless.Async):XMLHttpRequest;
        getPlaySubscriptionStatus<Promise>(packageName:string, subscriptionId:string, token:string):Promise;
    }

    /**
     * @private
     * @class Events
     * @refers {@link Backendless.Events}
     */
    class EventsClass {
        restUrl:string;

        dispatch(eventName:string, eventArgs:Object):Object;
        dispatch(eventName:string, eventArgs:Object, async:Backendless.Async):XMLHttpRequest;
        dispatch<Promise>(eventName:string, eventArgs:Object):Promise;
    }

    /**
     * @private
     * @class Cache
     * @refers {@link Backendless.Cache}
     */
    class CacheClass {
        put(key:string, value:any):Object;
        put(key:string, value:any, timeToLive:number):Object;
        put(key:string, value:any, async:Backendless.Async):XMLHttpRequest;
        put(key:string, value:any, timeToLive:number):Object;
        put(key:string, value:any, timeToLive:number, async:Backendless.Async):XMLHttpRequest;
        put<Promise>(key:string, value:any, timeToLive:number):Promise;
        put<Promise>(key:string, value:any):Promise;

        expireIn(key:string, time:number|Date):Object;
        expireIn(key:string, time:number|Date, async:Backendless.Async):XMLHttpRequest;
        expireIn<Promise>(key:string, time:number|Date):Promise;

        expireAt(key:string, time:number|Date):Object;
        expireAt(key:string, time:number|Date, async:Backendless.Async):XMLHttpRequest;
        expireAt<Promise>(key:string, time:number|Date):Promise;

        contains(key:string):Object;
        contains(key:string, async:Backendless.Async):XMLHttpRequest;
        contains<Promise>(key:string):Promise;

        get(key:string):Object;
        get(key:string, async:Backendless.Async):XMLHttpRequest;
        get<Promise>(key:string):Promise;

        remove(key:string):Object;
        remove(key:string, async:Backendless.Async):XMLHttpRequest;
        remove<Promise>(key:string):Promise;
    }

    /**
     * @private
     * @class Counters
     * @refers {@link Backendless.Counters}
     */
    class CountersClass {
        of(counterName:string):Backendless.AtomicInstance;

        get(counterName:string):number;
        get(counterName:string, async:Backendless.Async):XMLHttpRequest;
        get<Promise>(counterName:string):Promise;

        getAndIncrement(counterName:string):number;
        getAndIncrement(counterName:string, async:Backendless.Async):XMLHttpRequest;
        getAndIncrement<Promise>(counterName:string):Promise;

        incrementAndGet(counterName:string):number;
        incrementAndGet(counterName:string, async:Backendless.Async):XMLHttpRequest;
        incrementAndGet<Promise>(counterName:string):Promise;

        getAndDecrement(counterName:string):number;
        getAndDecrement(counterName:string, async:Backendless.Async):XMLHttpRequest;
        getAndDecrement<Promise>(counterName:string):Promise;

        decrementAndGet(counterName:string):number;
        decrementAndGet(counterName:string, async:Backendless.Async):XMLHttpRequest;
        decrementAndGet<Promise>(counterName:string):Promise;

        addAndGet(counterName:string, value:number):number;
        addAndGet(counterName:string, value:number, async:Backendless.Async):XMLHttpRequest;
        addAndGet<Promise>(counterName:string, value:number):Promise;

        getAndAdd(counterName:string, value:number):number;
        getAndAdd(counterName:string, value:number, async:Backendless.Async):XMLHttpRequest;
        getAndAdd<Promise>(counterName:string, value:number):Promise;

        compareAndSet(counterName:string, expected:number, updated:number):number;
        compareAndSet(counterName:string, expected:number, updated:number, async:Backendless.Async):XMLHttpRequest;
        compareAndSet<Promise>(counterName:string, expected:number, updated:number):Promise;

        reset(counterName:string):number;
        reset(counterName:string, async:Backendless.Async):XMLHttpRequest;
        reset<Promise>(counterName:string):Promise;
    }

    /**
     * @private
     * @class CustomServices
     * @refers {@link Backendless.CustomServices}
     */
    class CustomServicesClass {
        invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object):Object;
        invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object, async:Backendless.Async):XMLHttpRequest;
        invoke<Promise>(serviceName:string, serviceVersion:string, method:string, parameters:Object):Promise;
    }

    /**
     * @private
     * @class UserService
     * @refers {@link Backendless.UserService}
     */
    class UserServiceClass {
        restUrl:string;

        register(user:Backendless.User):Backendless.User;
        register(user:Backendless.User, async:Backendless.Async):XMLHttpRequest;
        register<Promise>(user:Backendless.User):Promise;

        getUserRoles():Backendless.User ;
        getUserRoles(async:Backendless.Async):XMLHttpRequest;
        getUserRoles<Promise>():Promise;

        describeUserClass():Backendless.User ;
        describeUserClass(async:Backendless.Async):XMLHttpRequest;
        describeUserClass<Promise>():Promise;

        restorePassword(email:string):Backendless.User ;
        restorePassword(email:string, async:Backendless.Async):XMLHttpRequest;
        restorePassword<Promise>(email:string):Promise;

        assignRole(identity:string, roleName:string):Backendless.User ;
        assignRole(identity:string, roleName:string, async:Backendless.Async):XMLHttpRequest;
        assignRole<Promise>(identity:string, roleName:string):Promise;

        unassignRole(identity:string, roleName:string):Backendless.User ;
        unassignRole(identity:string, roleName:string, async:Backendless.Async):XMLHttpRequest;
        unassignRole<Promise>(identity:string, roleName:string):Promise;

        login(userName:string, password:string):Backendless.User;
        login(userName:string, password:string, stayLoggedIn:boolean):Backendless.User ;
        login(userName:string, password:string, stayLoggedIn:boolean, async:Backendless.Async):XMLHttpRequest;
        login<Promise>(userName:string, password:string):Promise;
        login<Promise>(userName:string, password:string, stayLoggedIn:boolean):Promise;

        loggedInUser():boolean;

        logout():void;
        logout(async:Backendless.Async):XMLHttpRequest;
        logout<Promise>():Promise;

        getCurrentUser():Backendless.User;
        getCurrentUser<Promise>():Promise;
        getCurrentUser(async?:Backendless.Async):void;

        update(user:Backendless.User):Backendless.User ;
        update(user:Backendless.User, async:Backendless.Async):XMLHttpRequest;
        update<Promise>(user:Backendless.User):Promise;

        loginWithFacebook(fields?:Object, permissions?:Object, async?:Backendless.Async, stayLoggedIn?:boolean):void;
        loginWithFacebook<Promise>(fields?:Object, permissions?:Object, async?:Backendless.Async, stayLoggedIn?:boolean):Promise;

        loginWithGooglePlus(fields?:Object, permissions?:Object, container?:HTMLElement, async?:Backendless.Async, stayLoggedIn?:boolean):void;
        loginWithGooglePlus<Promise>(fields?:Object, permissions?:Object, container?:HTMLElement, async?:Backendless.Async, stayLoggedIn?:boolean):Promise;

        loginWithTwitter(fields?:Object, async?:Backendless.Async, stayLoggedIn?:boolean):void;
        loginWithTwitter<Promise>(fields?:Object, async?:Backendless.Async, stayLoggedIn?:boolean):Promise;

        loginWithFacebookSdk(fields?:Object, stayLoggedIn?:boolean, async?:Backendless.Async):void;
        loginWithFacebookSdk<Promise>(fields?:Object, stayLoggedIn?:boolean, async?:Backendless.Async):Promise;

        loginWithGooglePlusSdk(fields?:Object, stayLoggedIn?:boolean, async?:Backendless.Async):void;
        loginWithGooglePlusSdk<Promise>(fields?:Object, stayLoggedIn?:boolean, async?:Backendless.Async):Promise;

        isValidLogin():boolean;
        isValidLogin<Promise>():Promise;
        isValidLogin(async:Backendless.Async):XMLHttpRequest;

        resendEmailConfirmation(email:string, async?:Backendless.Async):XMLHttpRequest;
        resendEmailConfirmation<Promise>(email:string):Promise;
    }


    interface UtilsI {
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

    interface LoggingI {
        restUrl:string;
        loggers:Object;
        logInfo:Object[];
        messagesCount:number;
        numOfMessages:number;
        timeFrequency:number;

        setLogReportingPolicy(numOfMessages:number, timeFrequencySec:number):void;

        getLogger(name):Backendless.Logger;
    }

    interface DataQueryValueI {
        properties?:string[];
        condition?:string;
        options?:Object;
        url?:string;
    }

    interface LocalCacheI {
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

    interface GeoCategoryI {
        objectId:string;
        size:number;
        name:string;
    }

    interface GeofenceMonitoringCallbackI {
        (geoFenceName:string, geoFenceId:string, latitude:number, longitude:number):void;
    }

    interface GeofenceMonitoringCallbacksI {
        onenter?:Backendless.GeofenceMonitoringCallbackI;
        onstay?:Backendless.GeofenceMonitoringCallbackI;
        onexit?:Backendless.GeofenceMonitoringCallbackI;
    }

    interface DataItemI {
        ___class:string;
        objectId?:string;
    }

    interface ExistDataItemI extends Backendless.DataItemI {
        objectId:string;
    }

    interface SubscriptionI {
        channelName:string;
        options:Object;
        channelProperties:string;
        subscriptionId:string;
        restUrl:string;
        proxy:Proxy;
        cancelSubscription():void;
    }

    interface GeoQueryI {
        categories?:string|string[];
        includeMetadata?:boolean;
        metadata?:Object;
        condition?:string;
        relativeFindMetadata?:Object;
        relativeFindPercentThreshold?:number;
        pageSize?:number;
        offset?:number;
    }

    interface RectangleGeoQueryI extends Backendless.GeoQueryI {
        searchRectangle:number[];
    }

    interface CircleGeoQueryI extends Backendless.GeoQueryI {
        latitude:number;
        longitude:number;
        radius:number;
        units:string;
    }

    interface CollectionResultI {
        offset: number;
        totalObjects: number;
        getPage : (offset:number, pageSize:number, async:Backendless.Async)=>any;
        nextPage: (async:Backendless.Async)=>any;
        data: Object[];
    }

    interface GeoCollectionResultI extends CollectionResultI {
        data:Array<Backendless.GeoPoint|Backendless.GeoCluster>;
    }
}

import Backendless = __Backendless;

declare module 'backendless' {
    import Backendless = __Backendless;

    export = Backendless;
}

/**
 * @global
 * @namespace Backendless
 */
declare module __Backendless {
    import Backendless = __Backendless;

    var serverURL:string;
    var applicationId:string;
    var secretKey:string;
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
    function initApp(applicationId:string, jsSecretKey:string):void;

    /**
     * @public
     * @type: Function
     **/
    function setupDevice(deviceProps:Object):void;

    /**
     * @public
     * @type: Function
     **/
    function setUIState(state:string):void;

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
     * @private
     * @class Async
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
     * @private
     * @class DataQuery
     * @constructor
     */
    class DataQuery implements Backendless.DataQueryValueI {
        properties:string[];
        condition:string;
        options:Object;
        url:string;

        addProperty(prop:string):void;
        setOption(name:string, value:string|Array<string>|number):void;
        setOptions(options:Object):void;
        getOption(name:string):string|Array<string>|number;
        toJSON():Object;
    }

    /**
     * @public
     * @class Backendless.DataQueryBuilder
     * @constructor
     */
    class DataQueryBuilder {
        static create():Backendless.DataQueryBuilder;

        setPageSize(pageSize:number):Backendless.DataQueryBuilder;
        setOffset(offset:number):Backendless.DataQueryBuilder;
        prepareNextPage():Backendless.DataQueryBuilder;
        preparePreviousPage():Backendless.DataQueryBuilder;
        getProperties():Array<string>;
        setProperties(properties:string):Backendless.DataQueryBuilder;
        addProperty(properties:string):Backendless.DataQueryBuilder;
        getWhereClause():string;
        setWhereClause(whereClause:string):Backendless.DataQueryBuilder;
        getSortBy():Array<string>;
        setSortBy(sortBy:string|Array<string>):Backendless.DataQueryBuilder;
        getRelated():Array<string>;
        setRelated(relations:string|Array<string>):Backendless.DataQueryBuilder;
        getRelationsDepth():number;
        setRelationsDepth(relationsDepth:number):Backendless.DataQueryBuilder;
        build():Backendless.DataQueryValueI;
    }

    /**
     * @private
     * @class PagingQueryBuilder
     * @constructor
     */
    class PagingQueryBuilder {
        offset:number;
        pageSize:number;

        setPageSize(pageSize:number):PagingQueryBuilder;
        setOffset(offset:number):PagingQueryBuilder;
        prepareNextPage():PagingQueryBuilder;
        preparePreviousPage():PagingQueryBuilder;
        build():Object;
    }

    /**
     * @public
     * @class Backendless.LoadRelationsQueryBuilder
     * @constructor
     */

    class LoadRelationsQueryBuilder {
        static create():Backendless.LoadRelationsQueryBuilder;
        static of(RelationModel:Object):Backendless.LoadRelationsQueryBuilder;

        setRelationName(relationName:string):Backendless.LoadRelationsQueryBuilder;
        setPageSize(pageSize:number):Backendless.LoadRelationsQueryBuilder;
        setOffset(offset:number):Backendless.LoadRelationsQueryBuilder;
        prepareNextPage():Backendless.LoadRelationsQueryBuilder;
        preparePreviousPage():Backendless.LoadRelationsQueryBuilder;
        build():Backendless.DataQueryValueI;
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
        responder:Async;

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

        save(obj:Object):Promise<Object>;
        saveSync(obj:Object):Object;

        remove(id:Object|string):Promise<Object>;
        removeSync(obj:Object|string):Object;

        find(obj?:Backendless.DataQueryBuilder):Promise<Object>;
        findSync(obj?:Backendless.DataQueryBuilder):Array<Object>;

        findById(query:Object|string):Promise<Object>;
        findByIdSync(query:Object|string):Object;

        findFirst(query?:Object):Promise<Object>;
        findFirstSync(query?:Object):Object;

        findLast(query?:Object):Promise<Object>;
        findLastSync(query?:Object):Object;

        loadRelations(parentObjectId:string, query:Backendless.LoadRelationsQueryBuilder):Promise<Array<Object>>;
        loadRelationsSync(parentObjectId:string, query:Backendless.LoadRelationsQueryBuilder):Array<Object>;

        setRelation(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):Promise<string>;
        setRelation(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):Promise<string>;
        setRelation(parentObject:Object, columnName:string, whereClause:string):Promise<string>;
        setRelationSync(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):string;
        setRelationSync(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):string;
        setRelationSync(parentObject:Object, columnName:string, whereClause:string):string;

        addRelation(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):Promise<string>;
        addRelation(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):Promise<string>;
        addRelation(parentObject:Object, columnName:string, whereClause:string):Promise<string>;
        addRelationSync(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):string;
        addRelationSync(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):string;
        addRelationSync(parentObject:Object, columnName:string, whereClause:string):string;

        deleteRelation(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):Promise<string>;
        deleteRelation(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):Promise<string>;
        deleteRelation(parentObject:Object, columnName:string, whereClause:string):Promise<string>;
        deleteRelationSync(parentObject:Object, columnName:string, childObjectsArray:Array<Object>):string;
        deleteRelationSync(parentObject:Object, columnName:string, childObjectIdArray:Array<string>):string;
        deleteRelationSync(parentObject:Object, columnName:string, whereClause:string):string;

        bulkCreate(objectsArray:Array<Object>):Promise<string>;
        bulkCreateSync(objectsArray:Array<Object>):string;

        bulkUpdate(templateObject:Object, whereClause:string):Promise<string>;
        bulkUpdateSync(templateObject:Object, whereClause:string):string;

        bulkDelete(objectsArray:string|Array<string>|Array<Object>):Promise<string>;
        bulkDeleteSync(objectsArray:string|Array<string>|Array<Object>):string;

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

        save(model:Backendless.DataStore|string, data:Object):Promise<Object>;
        saveSync(model:Backendless.DataStore|string, data:Object):Object;

        getView(viewName:string, whereClause?:string, pageSize?:number, offset?:number):Promise<Object>;
        getViewSync(viewName:string, whereClause?:string, pageSize?:number, offset?:number):Object;

        describe(model:string|Object|Function):Promise<Object>;
        describeSync(model:string|Object|Function):Object;

        callStoredProcedure(spName:string, argumentValues:Object|string):Promise<Object>;
        callStoredProcedureSync(spName:string, argumentValues:Object|string):Object;
    }

    /**
     * @private
     * @class PersistencePermissions
     * @refers {@link Backendless.Persistence.Permissions}
     */
    class PersistencePermissionsClass {
        FIND:PersistencePermissionI;
        REMOVE:PersistencePermissionI;
        UPDATE:PersistencePermissionI;
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

        savePointSync(point:Backendless.GeoPoint):Backendless.GeoPoint;
        savePoint(point:Backendless.GeoPoint):Promise<Backendless.GeoPoint>;

        findSync(query:Backendless.GeoQueryI):Array<Backendless.GeoPoint|Backendless.GeoCluster>;
        find(query:Backendless.GeoQueryI):Promise<Array<Backendless.GeoPoint|Backendless.GeoCluster>>;

        deletePointSync(point:string|Backendless.GeoPoint):string;
        deletePoint(point:string|Backendless.GeoPoint):Promise<string>;

        loadMetadataSync(point:Backendless.GeoPoint|Backendless.GeoCluster):Object;
        loadMetadata(point:Backendless.GeoPoint|Backendless.GeoCluster):Promise<Object>;

        getClusterPointsSync(cluster:Backendless.GeoCluster):Array<Backendless.GeoPoint|Backendless.GeoCluster>;
        getClusterPoints(cluster:Backendless.GeoCluster):Promise<Array<Backendless.GeoPoint|Backendless.GeoCluster>>;

        getFencePointsSync(fenceName:string, query:Backendless.GeoQueryI):Array<Backendless.GeoPoint|Backendless.GeoCluster>;
        getFencePoints(fenceName:string, query:Backendless.GeoQueryI):Promise<Array<Backendless.GeoPoint|Backendless.GeoCluster>>;

        relativeFindSync(query:Backendless.GeoQueryI):Array<Backendless.GeoPoint|Backendless.GeoCluster>;
        relativeFind(query:Backendless.GeoQueryI):Promise<Array<Backendless.GeoPoint|Backendless.GeoCluster>>;

        addCategorySync(name:string):Backendless.GeoCategoryI;
        addCategory(name:string):Promise<Backendless.GeoCategoryI>;

        deleteCategorySync(name:string):boolean;
        deleteCategory(name:string):Promise<boolean>;

        getCategoriesSync():Array<Backendless.GeoCategoryI>;
        getCategories():Promise<Array<Backendless.GeoCategoryI>>;

        runOnStayActionSync(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnStayAction(fenceName:string, point:Backendless.GeoPoint):Promise<Object>;

        runOnExitActionSync(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnExitAction(fenceName:string, point:Backendless.GeoPoint):Promise<Object>;

        runOnEnterActionSync(fenceName:string, point:Backendless.GeoPoint):Object;
        runOnEnterAction(fenceName:string, point:Backendless.GeoPoint):Promise<Object>;

        startGeofenceMonitoringWithInAppCallbackSync(fenceName:string, inAppCallback:Backendless.GeofenceMonitoringCallbacksI):void;
        startGeofenceMonitoringWithInAppCallback(fenceName:string, inAppCallback:Backendless.GeofenceMonitoringCallbacksI):Promise<void>;

        startGeofenceMonitoringWithRemoteCallbackSync(fenceName:string, point:Backendless.GeoPoint):void;
        startGeofenceMonitoringWithRemoteCallback(fenceName:string, point:Backendless.GeoPoint):Promise<void>;

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

        subscribeSync(channelName:string, subscriptionCallback:() => void, subscriptionOptions:Backendless.SubscriptionOptions):Backendless.SubscriptionI;
        subscribe(channelName:string, subscriptionCallback:() => void, subscriptionOptions:Backendless.SubscriptionOptions):Promise<Backendless.SubscriptionI>;

        publishSync(channelName:string, message:string|Object, publishOptions:Backendless.PublishOptions, deliveryOptions:Backendless.DeliveryOptions):Object;
        publish(channelName:string, message:string|Object, publishOptions:Backendless.PublishOptions, deliveryOptions:Backendless.DeliveryOptions):Promise<Object>;

        sendEmailSync(subject:string, bodyParts:Backendless.Bodyparts, recipients:string[], attachments:string[]):Object;
        sendEmail(subject:string, bodyParts:Backendless.Bodyparts, recipients:string[], attachments:string[]):Promise<Object>;

        cancelSync(messageId:string):boolean;
        cancel(messageId:string):Promise<boolean>;

        registerDeviceSync(deviceToken:string, channels:string[], expiration:number|Date):Object;
        registerDevice(deviceToken:string, channels:string[], expiration:number|Date):Promise<Object>;

        getRegistrationsSync():Object;
        getRegistrations():Promise<Object>;

        unregisterDeviceSync():Object;
        unregisterDevice():Promise<Object>;

        getMessageStatusSync(messageId:string):boolean;
        getMessageStatus(messageId:string):Promise<boolean>;
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
        Permissions:FilePermissions;

        restUrl:string;

        saveFileSync(path:string, fileName:string, fileContent:Blob, overwrite?:boolean):boolean;
        saveFile(path:string, fileName:string, fileContent:Blob, overwrite?:boolean):Promise<boolean>;

        uploadSync(files:File|File[], path:string, overwrite?:boolean):void;
        upload(files:File|File[], path:string, overwrite?:boolean):Promise<void>;

        listingSync(path:string, pattern?:string, recursively?:boolean, pageSize?:number, offset?:number):Object;
        listing(path:string, pattern?:string, recursively?:boolean, pageSize?:number, offset?:number):Promise<Object>;

        renameFileSync(oldPathName:string, newName:string):Object;
        renameFile(oldPathName:string, newName:string):Promise<Object>;

        moveFileSync(sourcePath:string, targetPath:string):Object;
        moveFile(sourcePath:string, targetPath:string):Promise<Object>;

        copyFileSync(sourcePath:string, targetPath:string):Object;
        copyFile(sourcePath:string, targetPath:string):Promise<Object>;

        removeSync(fileURL:string):void;
        remove(fileURL:string):Promise<void>;

        existsSync(path:string):Object;
        exists(path:string):Promise<Object>;

        removeDirectorySync(path:string):void;
        removeDirectory(path:string):Promise<void>;
    }

    /**
     * @private
     * @class FilePermissions
     * @refers {@link Backendless.Files.Permissions}
     */
    class FilePermissions {
        READ:FilePermissionI;
        DELETE:FilePermissionI;
        WRITE:FilePermissionI;
    }

    /**
     * @private
     * @class Commerce
     * @refers {@link Backendless.Commerce}
     */
    class CommerceClass {
        restUrl:string;

        validatePlayPurchaseSync(packageName:string, productId:string, token:string):Object;
        validatePlayPurchase(packageName:string, productId:string, token:string):Promise<Object>;

        cancelPlaySubscriptionSync(packageName:string, subscriptionId:string, token:string):Object;
        cancelPlaySubscription(packageName:string, subscriptionId:string, token:string):Promise<Object>;

        getPlaySubscriptionStatusSync(packageName:string, subscriptionId:string, token:string):Object;
        getPlaySubscriptionStatus(packageName:string, subscriptionId:string, token:string):Promise<Object>;
    }

    /**
     * @private
     * @class Events
     * @refers {@link Backendless.Events}
     */
    class EventsClass {
        restUrl:string;

        dispatchSync(eventName:string, eventArgs:Object):Object;
        dispatch(eventName:string, eventArgs:Object):Promise<Object>;
    }

    /**
     * @private
     * @class Cache
     * @refers {@link Backendless.Cache}
     */
    class CacheClass {
        putSync(key:string, value:any, timeToLive?:number):Object;
        put(key:string, value:any, timeToLive?:number):Promise<Object>;

        expireInSync(key:string, time:number|Date):Object;
        expireIn(key:string, time:number|Date):Promise<Object>;

        expireAtSync(key:string, time:number|Date):Object;
        expireAt(key:string, time:number|Date):Promise<Object>;

        containsSync(key:string):Object;
        contains(key:string):Promise<Object>;

        getSync(key:string):Object;
        get(key:string):Promise<Object>;

        removeSync(key:string):Object;
        remove(key:string):Promise<Object>;
    }

    /**
     * @private
     * @class Counter
     */
    class Counter {

        constructor(name:string, restUrl:string);

        getSync():number;
        get():Promise<number>;

        getAndIncrementSync():number;
        getAndIncrement():Promise<number>;

        incrementAndGetSync():number;
        incrementAndGet():Promise<number>;

        getAndDecrementSync():number;
        getAndDecrement():Promise<number>;

        decrementAndGetSync():number;
        decrementAndGet():Promise<number>;

        addAndGetSync(value:number):number;
        addAndGet(value:number):Promise<number>;

        getAndAddSync(value:number):number;
        getAndAdd(value:number):Promise<number>

        compareAndSetSync(expected:number, updated:number):number;
        compareAndSet(expected:number, updated:number):Promise<number>;

        resetSync():number;
        reset():Promise<number>;
    }


    /**
     * @private
     * @class Counters
     * @refers {@link Backendless.Counters}
     */
    class CountersClass {
        of(counterName:string):Counter;

        getSync(counterName:string):number;
        get(counterName:string):Promise<number>;

        getAndIncrementSync(counterName:string):number;
        getAndIncrement(counterName:string):Promise<number>;

        incrementAndGetSync(counterName:string):number;
        incrementAndGet(counterName:string):Promise<number>;

        getAndDecrementSync(counterName:string):number;
        getAndDecrement(counterName:string):Promise<number>;

        decrementAndGetSync(counterName:string):number;
        decrementAndGet(counterName:string):Promise<number>;

        addAndGetSync(counterName:string, value:number):number;
        addAndGet(counterName:string, value:number):Promise<number>;

        getAndAddSync(counterName:string, value:number):number;
        getAndAdd(counterName:string, value:number):Promise<number>

        compareAndSetSync(counterName:string, expected:number, updated:number):number;
        compareAndSet(counterName:string, expected:number, updated:number):Promise<number>;

        resetSync(counterName:string):number;
        reset(counterName:string):Promise<number>;
    }

    /**
     * @private
     * @class CustomServices
     * @refers {@link Backendless.CustomServices}
     */
    class CustomServicesClass {
        invokeSync(serviceName:string, serviceVersion:string, method:string, parameters:Object):any;
        invoke(serviceName:string, serviceVersion:string, method:string, parameters:Object):Promise<any>;
    }

    /**
     * @private
     * @class UserService
     * @refers {@link Backendless.UserService}
     */
    class UserServiceClass {
        restUrl:string;

        registerSync(user:Backendless.User):Backendless.User;
        register(user:Backendless.User):Promise<Backendless.User>;

        getUserRolesSync():Backendless.User;
        getUserRoles():Promise<Backendless.User>;

        describeUserClassSync():Backendless.User ;
        describeUserClass():Promise<Backendless.User>;

        restorePasswordSync(email:string):Backendless.User;
        restorePassword(email:string):Promise<Backendless.User>;

        assignRoleSync(identity:string, roleName:string):Backendless.User;
        assignRole(identity:string, roleName:string):Promise<Backendless.User>;

        unassignRoleSync(identity:string, roleName:string):Backendless.User;
        unassignRole(identity:string, roleName:string):Promise<Backendless.User>;

        loginSync(userName:string, password:string, stayLoggedIn?:boolean):Backendless.User;
        login(userName:string, password:string, stayLoggedIn?:boolean):Promise<Backendless.User>;

        loggedInUser():boolean;

        logoutSync():void;
        logout():Promise<void>;

        getCurrentUserSync():Backendless.User;
        getCurrentUser():Promise<Backendless.User>;

        updateSync(user:Backendless.User):Backendless.User;
        update(user:Backendless.User):Promise<Backendless.User>;

        loginWithFacebookSync(fields?:Object, permissions?:Object, stayLoggedIn?:boolean):void;
        loginWithFacebook(fields?:Object, permissions?:Object, stayLoggedIn?:boolean):Promise<void>;

        loginWithGooglePlusSync(fields?:Object, permissions?:Object, container?:HTMLElement, stayLoggedIn?:boolean):void;
        loginWithGooglePlus(fields?:Object, permissions?:Object, container?:HTMLElement, stayLoggedIn?:boolean):Promise<void>;

        loginWithTwitterSync(fields?:Object, stayLoggedIn?:boolean):void;
        loginWithTwitter(fields?:Object, stayLoggedIn?:boolean):Promise<void>;

        loginWithFacebookSdk(fields?:Object, stayLoggedIn?:boolean):Promise<void>;

        loginWithGooglePlusSdk(fields?:Object, stayLoggedIn?:boolean):Promise<void>;

        isValidLoginSync():boolean;
        isValidLogin():Promise<boolean>;

        resendEmailConfirmationSync(email:string):void;
        resendEmailConfirmation(email:string):Promise<void>;
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

    interface PersistencePermissionI {
        grantUserSync(userId: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        grantUser(userId: string, dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

        grantRoleSync(roleName: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        grantRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

        grantSync(dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        grant(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

        denyUserSync(userId: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        denyUser(userId: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

        denyRoleSync(roleName: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        denyRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

        denySync(dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;
        deny(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;
    }

    interface FilePermissionI {
        grantUserSync(userId:string, url:string):boolean;
        grantUser(userId:string, url:string):Promise<boolean>;

        grantRoleSync(roleName:string, url:string):boolean;
        grantRole(roleName:string, url:string):Promise<boolean>;

        denyUserSync(userId:string, url:string):boolean;
        denyUser(userId:string, url:string):Promise<boolean>;

        denyRoleSync(roleName:string, url:string):boolean;
        denyRole(roleName:string, url:string):Promise<boolean>;
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
}

import Backendless = __Backendless;

declare module 'backendless' {
    import Backendless = __Backendless;

    export = Backendless;
}

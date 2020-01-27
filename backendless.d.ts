/**
 * @global
 * @namespace Backendless
 */
declare module Backendless {
    let debugMode: boolean;
    let serverURL: string;
    let applicationId: string;
    let secretKey: string;
    let appPath: string;
    let XMLHttpRequest: any;

    let browser: {
        browser: string;
        version: string;
    };

    /**
     * @dictionary
     */
    let PublishOptionsHeaders: { [key: string]: string; };

    /**
     * @public
     * @type: Function
     **/
    function initApp(applicationId: string, jsSecretKey: string): void;

    /**
     * @public
     * @type: Function
     **/
    function setupDevice(deviceProps: Object): void;

    /**
     * @public
     * @namespace Backendless.LocalCache
     **/
    namespace LocalCache {
        let enabled: boolean;

        function exists(key: string): boolean;

        function set(key: string): boolean;

        function set<T>(key: string, val: T): T;

        function remove(key: string): boolean;

        function get(key: string): any;

        function getAll(): Object;

        function getCachePolicy(key: string): Object;

        function serialize(value: any): string;

        function deserialize(value: string): any;

        function clear(): void;

        function flushExpired(): void;
    }

    /**
     * @public
     * @namespace Backendless.Data
     */
    namespace Data {

        /**
         * @private
         */
        interface PersistencePermissionI {
            /** @deprecated */
            grantUserSync(userId: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            denyUserSync(userId: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            grantUser(userId: string, dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            denyUser(userId: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            grantRoleSync(roleName: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            denyRoleSync(roleName: string, dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            grantRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            denyRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            grantSync(dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            denySync(dataItem: Backendless.ExistDataItemI): Backendless.ExistDataItemI;

            /** @deprecated */
            grant(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            deny(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            grantForUser(userId: string, dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            denyForUser(userId: string, dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            grantForRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            denyForRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            grantForAllUsers(dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            denyForAllUsers(dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            grantForAllRoles(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            denyForAllRoles(dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;
        }

        /**
         * @public
         * @interface Backendless.Data.Permissions
         */
        namespace Permissions {
            const FIND: PersistencePermissionI;
            const REMOVE: PersistencePermissionI;
            const UPDATE: PersistencePermissionI;
        }

        namespace SpatialReferenceSystem {
            class SpatialType {
                constructor(spatialType: { srsId: string, name: string });

                getSRSId(): string;

                getName(): string;

                toString(): string;
            }

            const CARTESIAN: SpatialType;
            const PULKOVO_1995: SpatialType;
            const WGS84: SpatialType;
            const WGS84_PSEUDO_MERCATOR: SpatialType;
            const WGS84_WORLD_MERCATOR: SpatialType;
            const DEFAULT: SpatialType;

            function valueBySRSId(srsId: string): SpatialType;
        }

        /**
         * @public
         * @class Backendless.Data.Geometry
         */
        class Geometry {
            constructor(srs: SpatialReferenceSystem.SpatialType);

            static fromWKT(wellKnownText: string, srs?: SpatialReferenceSystem.SpatialType): Point|LineString|Polygon;

            static fromGeoJSON(geoJSON: string, srs?: SpatialReferenceSystem.SpatialType): Point|LineString|Polygon;

            getSRS(): SpatialReferenceSystem.SpatialType;

            asGeoJSON(): object;

            asWKT(): string;
        }

        /**
         * @public
         * @class Backendless.Data.Point
         */
        class Point extends Geometry {
            constructor(srs?: SpatialReferenceSystem.SpatialType);

            getX(): Number;

            getY(): Number;

            getLongitude(): Number;

            getLatitude(): Number;

            setX(x: Number): Point;

            setY(y: Number): Point;

            setLongitude(x: Number): Point;

            setLatitude(y: Number): Point;

            setSrs(srs: Object): Point;

            getGeojsonType(): string;

            getWktType(): string;

            wktCoordinatePairs(): string;

            jsonCoordinatePairs(): string;

            equals(o: Object): boolean;
        }

        /**
         * @public
         * @class Backendless.Data.LineString
         */
        class LineString extends Geometry {
            constructor(points: Point[], srs?: SpatialReferenceSystem.SpatialType);

            getPoints(): Point[];

            setPoints(points: Point[]): LineString;

            getGeojsonType(): string;

            getWktType(): string;

            jsonCoordinatePairs(): string;

            wktCoordinatePairs(): string;
        }

        /**
         * @public
         * @class Backendless.Data.Polygon
         */
        class Polygon extends Geometry {
            constructor(boundary: LineString | Point[], holes?: LineString[], srs?: SpatialReferenceSystem.SpatialType);

            getBoundary(): LineString;

            setBoundary(boundary: LineString | Point[]): Polygon;

            getHoles(): LineString[];

            setHoles(holes: LineString[]): Polygon;

            getGeojsonType(): string;

            getWktType(): string;

            jsonCoordinatePairs(): string;

            wktCoordinatePairs(): string;
        }

        /**
         * @public
         * @class Backendless.Data.GeoJSONParser
         */
        class GeoJSONParser {
            constructor(srs: SpatialReferenceSystem.SpatialType);

            read(geoJSON: string): Point|LineString|Polygon;
        }

        /**
         * @public
         * @class Backendless.Data.WKTParser
         */
        class WKTParser {
            constructor(srs: SpatialReferenceSystem.SpatialType);

            read(wktString: string): Point|LineString|Polygon;
        }

        function of(model: string | Object | Function): Backendless.DataStore;

        function save(model: Backendless.DataStore | string, data: Object): Promise<Object>;

        function saveSync(model: Backendless.DataStore | string, data: Object): Object;

        function getView(viewName: string, whereClause?: string, pageSize?: number, offset?: number): Promise<Object>;

        function getViewSync(viewName: string, whereClause?: string, pageSize?: number, offset?: number): Object;

        function describe(model: string | Object | Function): Promise<Object>;

        function describeSync(model: string | Object | Function): Object;

        function callStoredProcedure(spName: string, argumentValues: Object | string): Promise<Object>;

        function callStoredProcedureSync(spName: string, argumentValues: Object | string): Object;

        function mapTableToClass(tableName: string, clientClass: Function);
    }

    /**
     * @public
     * @namespace Backendless.UserService
     **/
    namespace UserService {
        let restUrl: string;

        function registerSync(user: Backendless.User): Backendless.User;
        function registerSync<T>(user: T): T;

        function register(user: Backendless.User): Promise<Backendless.User>;
        function register<T>(user: T): Promise<T>;

        function getUserRolesSync(): string[];

        function getUserRoles(): Promise<string[]>;

        function describeUserClassSync(): Object[] ;

        function describeUserClass(): Promise<Object[]>;

        function restorePasswordSync(email: string): void;

        function restorePassword(email: string): Promise<void>;

        function assignRoleSync(identity: string, roleName: string): void;

        function assignRole(identity: string, roleName: string): Promise<void>;

        function unassignRoleSync(identity: string, roleName: string): void;

        function unassignRole(identity: string, roleName: string): Promise<void>;

        function loginSync(userName: string, password: string, stayLoggedIn?: boolean): Backendless.User;
        function loginSync<T>(userName: string, password: string, stayLoggedIn?: boolean): T;

        function login(identity: string, password: string, stayLoggedIn?: boolean): Promise<Backendless.User>;
        function login<T>(identity: string, password: string, stayLoggedIn?: boolean): Promise<T>;

        function loginAsGuestSync(stayLoggedIn?: boolean): Backendless.User;
        function loginAsGuestSync<T>(stayLoggedIn?: boolean): T;

        function loginAsGuest(stayLoggedIn?: boolean): Promise<Backendless.User>;
        function loginAsGuest<T>(stayLoggedIn?: boolean): Promise<T>;

        function loggedInUser(): boolean;

        function logoutSync(): void;

        function logout(): Promise<void>;

        function getCurrentUserSync(): Backendless.User;
        function getCurrentUserSync<T>(): T;

        function getCurrentUser(): Promise<Backendless.User>;
        function getCurrentUser<T>(): Promise<T>;

        function updateSync(user: Backendless.User): Backendless.User;
        function updateSync<T>(user: T): T;

        function update(user: Backendless.User): Promise<Backendless.User>;
        function update<T>(user: T): Promise<T>;

        /**@deprecated */
        function loginWithFacebookSync(fields?: Object, permissions?: Object, stayLoggedIn?: boolean): void;

        /**@deprecated */
        function loginWithFacebook(fields?: Object, permissions?: Object, stayLoggedIn?: boolean): Promise<void>;

        /**@deprecated */
        function loginWithGooglePlusSync(fields?: Object, permissions?: Object, container?: HTMLElement, stayLoggedIn?: boolean): void;

        /**@deprecated */
        function loginWithGooglePlus(fields?: Object, permissions?: Object, container?: HTMLElement, stayLoggedIn?: boolean): Promise<void>;

        function loginWithTwitterSync(fields?: Object, stayLoggedIn?: boolean): void;

        function loginWithTwitter(fields?: Object, stayLoggedIn?: boolean): Promise<void>;

        /**@deprecated */
        function loginWithFacebookSdk<T = Backendless.User>(fields?: Object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithFacebookSdk<T = Backendless.User>(accessToken: String, fields: Object, stayLoggedIn?: boolean): Promise<T>;

        /**@deprecated */
        function loginWithGooglePlusSdk<T = Backendless.User>(fields?: Object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithGooglePlusSdk<T = Backendless.User>(accessToken: String, fields?: Object, stayLoggedIn?: boolean): Promise<T>;

        function isValidLoginSync(): boolean;

        function isValidLogin(): Promise<boolean>;

        function resendEmailConfirmationSync(email: string): void;

        function resendEmailConfirmation(email: string): Promise<void>;
    }

    /**
     * @public
     * @namespace Backendless.Geo
     **/
    namespace Geo {
        let restUrl: string;

        let UNITS: Object;
        let EARTH_RADIUS: number;

        function savePointSync(point: Backendless.GeoPoint): Backendless.GeoPoint;

        function savePoint(point: Backendless.GeoPoint): Promise<Backendless.GeoPoint>;

        function findSync(query: Backendless.GeoQueryI): Array<Backendless.GeoPoint | Backendless.GeoCluster>;

        function find(query: Backendless.GeoQueryI): Promise<Array<Backendless.GeoPoint | Backendless.GeoCluster>>;

        function getGeopointCount(fenceName: string, query: Backendless.GeoQueryI): Promise<number>

        function getGeopointCount(query: Backendless.GeoQueryI): Promise<number>

        function getGeopointCountSync(fenceName: string, query: Backendless.GeoQueryI): number

        function getGeopointCountSync(query: Backendless.GeoQueryI): number

        function deletePointSync(point: string | Backendless.GeoPoint): string;

        function deletePoint(point: string | Backendless.GeoPoint): Promise<string>;

        function loadMetadataSync(point: Backendless.GeoPoint | Backendless.GeoCluster): Object;

        function loadMetadata(point: Backendless.GeoPoint | Backendless.GeoCluster): Promise<Object>;

        function getClusterPointsSync(cluster: Backendless.GeoCluster): Array<Backendless.GeoPoint | Backendless.GeoCluster>;

        function getClusterPoints(cluster: Backendless.GeoCluster): Promise<Array<Backendless.GeoPoint | Backendless.GeoCluster>>;

        function getFencePointsSync(fenceName: string, query: Backendless.GeoQueryI): Array<Backendless.GeoPoint | Backendless.GeoCluster>;

        function getFencePoints(fenceName: string, query: Backendless.GeoQueryI): Promise<Array<Backendless.GeoPoint | Backendless.GeoCluster>>;

        function relativeFindSync(query: Backendless.GeoQueryI): Array<Backendless.GeoPoint | Backendless.GeoCluster>;

        function relativeFind(query: Backendless.GeoQueryI): Promise<Array<Backendless.GeoPoint | Backendless.GeoCluster>>;

        function addCategorySync(name: string): Backendless.GeoCategoryI;

        function addCategory(name: string): Promise<Backendless.GeoCategoryI>;

        function deleteCategorySync(name: string): boolean;

        function deleteCategory(name: string): Promise<boolean>;

        function getCategoriesSync(): Array<Backendless.GeoCategoryI>;

        function getCategories(): Promise<Array<Backendless.GeoCategoryI>>;

        function runOnStayActionSync(fenceName: string, point: Backendless.GeoPoint): Object;

        function runOnStayAction(fenceName: string, point: Backendless.GeoPoint): Promise<Object>;

        function runOnExitActionSync(fenceName: string, point: Backendless.GeoPoint): Object;

        function runOnExitAction(fenceName: string, point: Backendless.GeoPoint): Promise<Object>;

        function runOnEnterActionSync(fenceName: string, point: Backendless.GeoPoint): Object;

        function runOnEnterAction(fenceName: string, point: Backendless.GeoPoint): Promise<Object>;

        function startGeofenceMonitoringWithInAppCallbackSync(fenceName: string, inAppCallback: Backendless.GeofenceMonitoringCallbacksI): void;

        function startGeofenceMonitoringWithInAppCallback(fenceName: string, inAppCallback: Backendless.GeofenceMonitoringCallbacksI): Promise<void>;

        function startGeofenceMonitoringWithRemoteCallbackSync(fenceName: string, point: Backendless.GeoPoint): void;

        function startGeofenceMonitoringWithRemoteCallback(fenceName: string, point: Backendless.GeoPoint): Promise<void>;

        function stopGeofenceMonitoring(fenceName: string): void;
    }

    /**
     * @public
     * @namespace Backendless.Messaging
     **/
    namespace Messaging {
        let restUrl: string;
        let channelProperties: Object;

        function subscribe(channelName: string): ChannelClass;

        function publishSync(channelName: string, message: string | Object, publishOptions?: Backendless.PublishOptions, deliveryOptions?: Backendless.DeliveryOptions): Object;

        function publish(channelName: string, message: string | Object, publishOptions?: Backendless.PublishOptions, deliveryOptions?: Backendless.DeliveryOptions): Promise<Object>;

        function sendEmailSync(subject: string, bodyParts: Backendless.Bodyparts, recipients: string[], attachments?: string[]): String;

        function sendEmail(subject: string, bodyParts: Backendless.Bodyparts, recipients: string[], attachments?: string[]): Promise<String>;

        function sendEmailFromTemplateSync(templateName: string, emailEnvelope: Backendless.EmailEnvelope, templateValues?: object): object;

        function sendEmailFromTemplate(templateName: string, emailEnvelope: Backendless.EmailEnvelope, templateValues?: object): Promise<object>;

        function cancelSync(messageId: string): boolean;

        function cancel(messageId: string): Promise<boolean>;

        function registerDeviceSync(deviceToken: string, channels?: string[], expiration?: number | Date): Object;

        function registerDevice(deviceToken: string, channels?: string[], expiration?: number | Date): Promise<Object>;

        function getRegistrationsSync(): Object;

        function getRegistrations(): Promise<Object>;

        function unregisterDeviceSync(): Object;

        function unregisterDevice(): Promise<Object>;

        function getMessageStatusSync(messageId: string): boolean;

        function getMessageStatus(messageId: string): Promise<boolean>;

        function getPushTemplates(deviceType: string): Promise<Object>;

        function pushWithTemplate(templateName: string): Promise<Object>;
    }

    /**
     * @public
     * @namespace Backendless.Files
     **/
    namespace Files {

        interface FilePermissionI {
            /** @deprecated */
            grantUserSync(userId: string, url: string): boolean;

            /** @deprecated */
            grantUser(userId: string, url: string): Promise<boolean>;

            /** @deprecated */
            grantRoleSync(roleName: string, url: string): boolean;

            /** @deprecated */
            grantRole(roleName: string, url: string): Promise<boolean>;

            /** @deprecated */
            denyUserSync(userId: string, url: string): boolean;

            /** @deprecated */
            denyUser(userId: string, url: string): Promise<boolean>;

            /** @deprecated */
            denyRoleSync(roleName: string, url: string): boolean;

            /** @deprecated */
            denyRole(roleName: string, url: string): Promise<boolean>;

            grantForUser(userId: string, url: string): Promise<boolean>;

            denyForUser(userId: string, url: string): Promise<boolean>;

            grantForRole(roleName: string, url: string): Promise<boolean>;

            denyForRole(roleName: string, url: string): Promise<boolean>;

            grantForAllUsers(url: string): Promise<boolean>;

            denyForAllUsers(url: string): Promise<boolean>;

            grantForAllRoles(url: string): Promise<boolean>;

            denyForAllRoles(url: string): Promise<boolean>;
        }

        /**
         * @public
         * @namespace Backendless.Files.Permissions
         **/
        namespace Permissions {
            let READ: FilePermissionI;
            let DELETE: FilePermissionI;
            let WRITE: FilePermissionI;
        }

        let restUrl: string;

        function saveFileSync(path: string, fileName: string, fileContent: Blob, overwrite?: boolean): boolean;

        function saveFile(path: string, fileName: string, fileContent: Blob, overwrite?: boolean): Promise<boolean>;

        function uploadSync(files: File | File[], path: string, overwrite?: boolean): void;

        function upload(files: File | File[], path: string, overwrite?: boolean): Promise<void>;

        function listingSync(path: string, pattern?: string, recursively?: boolean, pageSize?: number, offset?: number): Object;

        function listing(path: string, pattern?: string, recursively?: boolean, pageSize?: number, offset?: number): Promise<Object>;

        function renameFileSync(oldPathName: string, newName: string): Object;

        function renameFile(oldPathName: string, newName: string): Promise<Object>;

        function moveFileSync(sourcePath: string, targetPath: string): Object;

        function moveFile(sourcePath: string, targetPath: string): Promise<Object>;

        function copyFileSync(sourcePath: string, targetPath: string): Object;

        function copyFile(sourcePath: string, targetPath: string): Promise<Object>;

        function removeSync(fileURL: string): number;

        function remove(fileURL: string): Promise<number>;

        function existsSync(path: string): Object;

        function exists(path: string): Promise<Object>;

        function removeDirectorySync(path: string): number;

        function removeDirectory(path: string): Promise<number>;
    }

    /**
     * @public
     * @namespace Backendless.Commerce
     **/
    namespace Commerce {
        let restUrl: string;

        function validatePlayPurchaseSync(packageName: string, productId: string, token: string): Object;

        function validatePlayPurchase(packageName: string, productId: string, token: string): Promise<Object>;

        function cancelPlaySubscriptionSync(packageName: string, subscriptionId: string, token: string): Object;

        function cancelPlaySubscription(packageName: string, subscriptionId: string, token: string): Promise<Object>;

        function getPlaySubscriptionStatusSync(packageName: string, subscriptionId: string, token: string): Object;

        function getPlaySubscriptionStatus(packageName: string, subscriptionId: string, token: string): Promise<Object>;
    }

    /**
     * @public
     * @namespace Backendless.BL
     **/
    namespace BL {
        let ExecutionTypes: {
            SYNC: string,
            ASYNC: string,
            ASYNC_LOW_PRIORITY: string,
        }

        export interface CustomServicesI {
            invokeSync(serviceName: string, method: string, parameters: Object): any;

            invoke(serviceName: string, method: string, parameters: Object): Promise<any>;

            invoke(serviceName: string, method: string, parameters: Object, executionType: string): Promise<any>;

            invoke(serviceName: string, method: string, executionType: string): Promise<any>;
        }

        /**
         * @public
         * @interface CustomServicesI
         * @namespace Backendless.BL.CustomServices
         **/
        let CustomServices: CustomServicesI;

        export interface EventsI {
            restUrl: string;

            dispatchSync(eventName: string, eventArgs: Object): Object;

            dispatch(eventName: string): Promise<Object>;

            dispatch(eventName: string, eventArgs: Object): Promise<Object>;

            dispatch(eventName: string, eventArgs: Object, executionType: string): Promise<Object>;

            dispatch(eventName: string, executionType: string): Promise<Object>;
        }

        let Events: EventsI
    }

    /**
     * @public
     * @namespace Backendless.Events
     **/
    let Events: Backendless.BL.EventsI;

    /**
     * @public
     * @namespace Backendless.Cache
     **/
    namespace Cache {
        function putSync(key: string, value: any, timeToLive?: number): Object;

        function put(key: string, value: any, timeToLive?: number): Promise<Object>;

        function expireInSync(key: string, time: number | Date): Object;

        function expireIn(key: string, time: number | Date): Promise<Object>;

        function expireAtSync(key: string, time: number | Date): Object;

        function expireAt(key: string, time: number | Date): Promise<Object>;

        function containsSync(key: string): Object;

        function contains(key: string): Promise<Object>;

        function getSync(key: string): Object;

        function get(key: string): Promise<Object>;

        function removeSync(key: string): Object;

        function remove(key: string): Promise<Object>;
    }

    /**
     * @namespace Backendless.Counters
     **/
    namespace Counters {
        function of(counterName: string): Counter;

        function getSync(counterName: string): number;

        function get(counterName: string): Promise<number>;

        function getAndIncrementSync(counterName: string): number;

        function getAndIncrement(counterName: string): Promise<number>;

        function incrementAndGetSync(counterName: string): number;

        function incrementAndGet(counterName: string): Promise<number>;

        function getAndDecrementSync(counterName: string): number;

        function getAndDecrement(counterName: string): Promise<number>;

        function decrementAndGetSync(counterName: string): number;

        function decrementAndGet(counterName: string): Promise<number>;

        function addAndGetSync(counterName: string, value: number): number;

        function addAndGet(counterName: string, value: number): Promise<number>;

        function getAndAddSync(counterName: string, value: number): number;

        function getAndAdd(counterName: string, value: number): Promise<number>

        function compareAndSetSync(counterName: string, expected: number, updated: number): number;

        function compareAndSet(counterName: string, expected: number, updated: number): Promise<number>;

        function resetSync(counterName: string): number;

        function reset(counterName: string): Promise<number>;
    }

    /**
     * @public
     * @namespace Backendless.CustomServices
     **/
    let CustomServices: Backendless.BL.CustomServicesI;

    /**
     * @public
     * @namespace Backendless.Logging
     **/
    namespace Logging {
        let restUrl: string;
        let loggers: Object;
        let logInfo: Object[];
        let messagesCount: number;
        let numOfMessages: number;
        let timeFrequency: number;

        function setLogReportingPolicy(numOfMessages: number, timeFrequencySec: number): void;

        function getLogger(name: string): Backendless.Logger;
    }

    /**
     * @public
     * @namespace Backendless.RT
     **/
    namespace RT {
        function addConnectEventListener(callback: () => void): void;

        function removeConnectEventListener(callback: () => void): void;

        function addConnectErrorEventListener(callback: (error: string) => void): void;

        function removeConnectErrorEventListener(callback: (error: string) => void): void;

        function addDisconnectEventListener(callback: () => void): void;

        function removeDisconnectEventListener(callback: () => void): void;

        function addReconnectAttemptEventListener(callback: (attempt: number, timeout: number) => void): void;

        function removeReconnectAttemptEventListener(callback: (attempt: number, timeout: number) => void): void;

        function removeConnectionListeners(): void;
    }

    /**
     * @private
     * @class Async
     * @constructor
     */
    class Async {
        constructor(onSuccess?: (data?: Object) => void, onError?: ((data: Object) => void) | Object, context?: Object);

        success(data: Object): void;

        fault(data: Object): void;
    }

    /**
     * @public
     * @class Backendless.User
     * @constructor
     */
    class User {
        ___class: string;
        objectId?: string;
        username?: string;
        password: string;
        email?: string;
        blUserLocale?: string;
    }

    /**
     * @private
     * @class DataQuery
     * @constructor
     */
    class DataQuery implements Backendless.DataQueryValueI {
        properties: string[];
        condition: string;
        options: Object;
        url: string;

        addProperty(prop: string): void;

        setOption(name: string, value: string | Array<string> | number): void;

        setOptions(options: Object): void;

        getOption(name: string): string | Array<string> | number;

        toJSON(): Object;
    }

    /**
     * @public
     * @class Backendless.DataQueryBuilder
     * @constructor
     */
    class DataQueryBuilder {
        static create(): Backendless.DataQueryBuilder;

        setPageSize(pageSize: number): Backendless.DataQueryBuilder;

        setOffset(offset: number): Backendless.DataQueryBuilder;

        prepareNextPage(): Backendless.DataQueryBuilder;

        preparePreviousPage(): Backendless.DataQueryBuilder;

        getProperties(): Array<string>;

        setProperties(properties: string | Array<string>): Backendless.DataQueryBuilder;

        addProperty(property: string): Backendless.DataQueryBuilder;

        addProperties(...properties: Array<string | Array<string>>): Backendless.DataQueryBuilder;

        getWhereClause(): string;

        setWhereClause(whereClause: string): Backendless.DataQueryBuilder;

        getSortBy(): Array<string>;

        setSortBy(sortBy: string | Array<string>): Backendless.DataQueryBuilder;

        getRelated(): Array<string>;

        setRelated(relations: string | Array<string>): Backendless.DataQueryBuilder;

        addRelated(relations: string | Array<string>): Backendless.DataQueryBuilder;

        getRelationsDepth(): number;

        setRelationsDepth(relationsDepth: number): Backendless.DataQueryBuilder;

        getRelationsPageSize(): number;

        setRelationsPageSize(relationsPageSize: number): Backendless.DataQueryBuilder;

        build(): Backendless.DataQueryValueI;
    }

    /**
     * @private
     * @class PagingQueryBuilder
     * @constructor
     */
    class PagingQueryBuilder {
        offset: number;
        pageSize: number;

        setPageSize(pageSize: number): PagingQueryBuilder;

        setOffset(offset: number): PagingQueryBuilder;

        prepareNextPage(): PagingQueryBuilder;

        preparePreviousPage(): PagingQueryBuilder;

        build(): Object;
    }

    /**
     * @public
     * @class Backendless.LoadRelationsQueryBuilder
     * @constructor
     */

    class LoadRelationsQueryBuilder {
        static create(): Backendless.LoadRelationsQueryBuilder;

        static of(RelationModel: Object): Backendless.LoadRelationsQueryBuilder;

        setRelationName(relationName: string): Backendless.LoadRelationsQueryBuilder;

        getProperties(): Array<string>;

        setProperties(properties: string | Array<string>): Backendless.LoadRelationsQueryBuilder;

        addProperty(properties: string): Backendless.LoadRelationsQueryBuilder;

        getWhereClause(): string;

        setWhereClause(whereClause: string): Backendless.LoadRelationsQueryBuilder;

        setPageSize(pageSize: number): Backendless.LoadRelationsQueryBuilder;

        setOffset(offset: number): Backendless.LoadRelationsQueryBuilder;

        getSortBy(): Array<string>;

        setSortBy(sortBy: string | Array<string>): Backendless.LoadRelationsQueryBuilder;

        prepareNextPage(): Backendless.LoadRelationsQueryBuilder;

        preparePreviousPage(): Backendless.LoadRelationsQueryBuilder;

        build(): Backendless.DataQueryValueI;
    }

    /**
     * @public
     * @class Backendless.GeoPoint
     * @constructor
     */
    class GeoPoint {
        ___class: string;
        objectId: string;
        latitude: number;
        longitude: number;
        categories: string | string[];
        metadata: Object;
    }

    /**
     * @public
     * @class Backendless.GeoCluster
     * @extends GeoPoint
     * @constructor
     */
    class GeoCluster extends Backendless.GeoPoint {
        totalPoints: number;
        geoQuery: Backendless.GeoQuery | Backendless.RectangleGeoQueryI | Backendless.CircleGeoQueryI;
    }

    /**
     * @public
     * @class Backendless.GeoQuery
     * @constructor
     */
    class GeoQuery implements Backendless.GeoQueryI {
        categories: string | string[];
        includeMetadata: boolean;
        metadata: Object;
        condition: string;
        relativeFindMetadata: Object;
        relativeFindPercentThreshold: number;
        pageSize: number;
        offset: number;
    }

    /**
     * @public
     * @class Backendless.PublishOptions
     * @constructor
     */
    class PublishOptions {
        publisherId: string;
        headers: Object;

        /**
         * @deprecated
         * */
        subtopic: string;

        constructor(args?: Object);
    }

    /**
     * @public
     * @class Backendless.EmailEnvelope
     * @constructor
     */
    class EmailEnvelope {
        addresses: string[];
        ccAddresses: string[];
        bccAddresses: string[];
        query: string | null;

        constructor(data?: Object);

        static create(data?: Object): Backendless.EmailEnvelope;

        setTo(addresses: string | string[]): Backendless.EmailEnvelope;

        addTo(addresses: string | string[]): Backendless.EmailEnvelope;

        getTo(): string[];

        setCc(addresses: string | string[]): Backendless.EmailEnvelope;

        addCc(addresses: string | string[]): Backendless.EmailEnvelope;

        getCc(): string[];

        setBcc(addresses: string | string[]): Backendless.EmailEnvelope;

        addBcc(addresses: string | string[]): Backendless.EmailEnvelope;

        getBcc(): string[];

        setQuery(query: string): Backendless.EmailEnvelope;

        getQuery(): string;
    }

    /**
     * @public
     * @class Backendless.DeliveryOptions
     * @constructor
     */
    class DeliveryOptions {
        publishPolicy: string;
        pushBroadcast: number;
        pushSinglecast: string[];
        publishAt: number;
        repeatEvery: number;
        repeatExpiresAt: number;

        constructor(args?: Object);
    }

    /**
     * @public
     * @class Backendless.Bodyparts
     * @constructor
     */
    class Bodyparts {
        textmessage: string;
        htmlmessage: string;

        constructor(args?: Object);
    }

    /**
     * @public
     * @deprecated
     * @class Backendless.SubscriptionOptions
     * @constructor
     */
    class SubscriptionOptions {
        subscriberId: string;
        subtopic: string;
        selector: string;

        constructor(args?: Object);
    }

    /**
     * @private
     * @class Logger
     */
    class Logger {
        debug(message: string): void;

        info(message: string): void;

        warn(message: string): void;

        error(message: string): void;

        fatal(message: string): void;

        trace(message: string): void;
    }

    interface RTSubscriptionError {
        code?: number;
        message?: string;
        details?: object;
    }

    interface RTBulkChangesSubscriptionResult {
        whereClause?: string;
        count?: number;
    }

    /**
     * @private
     * @class EventHandler
     */
    class EventHandler {
        addCreateListener<T = object>(whereClause: string, callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addCreateListener<T = object>(whereClause: string, callback: (obj: T) => void): Backendless.EventHandler;
        addCreateListener<T = object>(callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addCreateListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        removeCreateListeners(whereClause: string): Backendless.EventHandler;
        removeCreateListeners(): Backendless.EventHandler;

        removeCreateListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        addUpdateListener<T = object>(whereClause: string, callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addUpdateListener<T = object>(whereClause: string, callback: (obj: T) => void): Backendless.EventHandler;
        addUpdateListener<T = object>(callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addUpdateListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        removeUpdateListeners(whereClause: string): Backendless.EventHandler;
        removeUpdateListeners(): Backendless.EventHandler;

        removeUpdateListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        addDeleteListener<T = object>(whereClause: string, callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addDeleteListener<T = object>(whereClause: string, callback: (obj: T) => void): Backendless.EventHandler;
        addDeleteListener<T = object>(callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addDeleteListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        removeDeleteListeners(whereClause: string): Backendless.EventHandler;
        removeDeleteListeners(): Backendless.EventHandler;

        removeDeleteListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        addBulkCreateListener(callback: (list: string[]) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkCreateListener(callback: (list: string[]) => void): Backendless.EventHandler;

        removeBulkCreateListener(callback: (list: string[]) => void): Backendless.EventHandler;

        removeBulkCreateListeners(): Backendless.EventHandler;

        removeBulkCreateListener(callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;

        addBulkUpdateListener(whereClause: string, callback: (obj: RTBulkChangesSubscriptionResult) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkUpdateListener(whereClause: string, callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;
        addBulkUpdateListener(callback: (obj: RTBulkChangesSubscriptionResult) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkUpdateListener(callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;

        removeBulkUpdateListeners(whereClause: string): Backendless.EventHandler;
        removeBulkUpdateListeners(): Backendless.EventHandler;

        removeBulkUpdateListener(callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;

        addBulkDeleteListener(whereClause: string, callback: (obj: RTBulkChangesSubscriptionResult) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkDeleteListener(whereClause: string, callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;
        addBulkDeleteListener(callback: (obj: RTBulkChangesSubscriptionResult) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkDeleteListener(callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;

        removeBulkDeleteListeners(whereClause: string): Backendless.EventHandler;
        removeBulkDeleteListeners(): Backendless.EventHandler;

        removeBulkDeleteListener(callback: (obj: RTBulkChangesSubscriptionResult) => void): Backendless.EventHandler;

        removeAllListeners(): Backendless.EventHandler;
    }

    /**
     * @private
     * @class DataStore
     */
    class DataStore {
        model: Function | Object;
        className: string;
        restUrl: string;
        classToTableMap: Object;

        constructor(name: string | Object | Function, classToTableMap: Object);

        save(obj: Object): Promise<Object>;
        save<T>(obj: T): Promise<T>;

        saveSync(obj: Object): Object;

        remove(id: Object | string): Promise<Object>;

        removeSync(obj: Object | string): Object;

        find(obj?: Backendless.DataQueryBuilder): Promise<Object[]>;
        find<T>(obj?: Backendless.DataQueryBuilder): Promise<T[]>;

        findSync(obj?: Backendless.DataQueryBuilder): Array<Object>;

        findById(query: Object | string): Promise<Object>;
        findById<T>(query: Object | string): Promise<T>;

        findByIdSync(query: Object | string): Object;

        findFirst(query?: Object): Promise<Object>;
        findFirst<T>(query?: Object): Promise<T>;

        findFirstSync(query?: Object): Object;

        findLast(query?: Object): Promise<Object>;
        findLast<T>(query?: Object): Promise<T>;

        findLastSync(query?: Object): Object;

        loadRelations(parentObjectId: string, query: Backendless.LoadRelationsQueryBuilder): Promise<Array<Object>>;
        loadRelations<T>(parentObjectId: string, query: Backendless.LoadRelationsQueryBuilder): Promise<T[]>;

        loadRelationsSync(parentObjectId: string, query: Backendless.LoadRelationsQueryBuilder): Array<Object>;

        getObjectCount(query?: Backendless.DataQueryBuilder | string): Promise<number>

        getObjectCountSync(query?: Backendless.DataQueryBuilder | string): number

        setRelation(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): Promise<string>;
        setRelation(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): Promise<string>;
        setRelation(parentObject: Object, columnName: string, whereClause: string): Promise<string>;

        setRelationSync(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): string;
        setRelationSync(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): string;
        setRelationSync(parentObject: Object, columnName: string, whereClause: string): string;

        addRelation(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): Promise<string>;
        addRelation(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): Promise<string>;
        addRelation(parentObject: Object, columnName: string, whereClause: string): Promise<string>;

        addRelationSync(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): string;
        addRelationSync(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): string;
        addRelationSync(parentObject: Object, columnName: string, whereClause: string): string;

        deleteRelation(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): Promise<string>;
        deleteRelation(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): Promise<string>;
        deleteRelation(parentObject: Object, columnName: string, whereClause: string): Promise<string>;

        deleteRelationSync(parentObject: Object, columnName: string, childObjectsArray: Array<Object>): string;
        deleteRelationSync(parentObject: Object, columnName: string, childObjectIdArray: Array<string>): string;
        deleteRelationSync(parentObject: Object, columnName: string, whereClause: string): string;

        bulkCreate(objects: Array<Object>): Promise<Array<string>>;

        bulkCreateSync(objects: Array<Object>): Array<string>;

        bulkUpdate(whereClause: string, changes: Object): Promise<string>;

        bulkUpdateSync(whereClause: string, changes: Object): string;

        bulkDelete(where: string | Array<string> | Array<{ objectId: string, [key: string]: any }>): Promise<string>;

        bulkDeleteSync(where: string | Array<string> | Array<{ objectId: string, [key: string]: any }>): string;

        rt(): EventHandler;
    }

    /**
     * @private
     * @class Counter
     */
    class Counter {

        constructor(name: string, restUrl: string);

        getSync(): number;

        get(): Promise<number>;

        getAndIncrementSync(): number;

        getAndIncrement(): Promise<number>;

        incrementAndGetSync(): number;

        incrementAndGet(): Promise<number>;

        getAndDecrementSync(): number;

        getAndDecrement(): Promise<number>;

        decrementAndGetSync(): number;

        decrementAndGet(): Promise<number>;

        addAndGetSync(value: number): number;

        addAndGet(value: number): Promise<number>;

        getAndAddSync(value: number): number;

        getAndAdd(value: number): Promise<number>

        compareAndSetSync(expected: number, updated: number): number;

        compareAndSet(expected: number, updated: number): Promise<number>;

        resetSync(): number;

        reset(): Promise<number>;
    }

    interface DataQueryValueI {
        properties?: string[];
        condition?: string;
        options?: Object;
        url?: string;
    }

    interface GeoCategoryI {
        objectId: string;
        size: number;
        name: string;
    }

    interface GeofenceMonitoringCallbackI {
        (geoFenceName: string, geoFenceId: string, latitude: number, longitude: number): void;
    }

    interface GeofenceMonitoringCallbacksI {
        onenter?: Backendless.GeofenceMonitoringCallbackI;
        onstay?: Backendless.GeofenceMonitoringCallbackI;
        onexit?: Backendless.GeofenceMonitoringCallbackI;
    }

    interface DataItemI {
        ___class: string;
        objectId?: string;
    }

    interface ExistDataItemI extends Backendless.DataItemI {
        objectId: string;
    }

    class ChannelClass {

        publish(message: string | Object, publishOptions?: Backendless.PublishOptions, deliveryOptions?: Backendless.DeliveryOptions): Promise<Object>;

        join(): void

        leave(): void;

        isJoined(): boolean;

        addConnectListener(callback: () => void, onError?: (error: Object) => void): ChannelClass;

        removeConnectListeners(callback?: () => void): ChannelClass;

        addMessageListener(selector: string, callback: (message: Object) => void, onError?: (error: Object) => void): ChannelClass;
        addMessageListener(callback: (message: Object) => void, onError?: (error: Object) => void): ChannelClass;

        removeMessageListener(callback: (message: Object) => void): ChannelClass;
        removeMessageListener(selector: string, callback: (message: Object) => void): ChannelClass;

        removeMessageListeners(selector: string): ChannelClass;

        removeAllMessageListeners(): ChannelClass;

        addCommandListener(callback: (command: Object) => void, onError?: (error: Object) => void): ChannelClass;

        removeCommandListener(callback: (command: Object) => void): ChannelClass;

        removeCommandListeners(): ChannelClass;

        addUserStatusListener(callback: (userStates: Object) => void, onError?: (error: Object) => void): ChannelClass;

        removeUserStatusListener(callback: (userStates: Object) => void): ChannelClass;

        removeUserStatusListeners(): ChannelClass;

        removeAllListeners(): ChannelClass;

        send(type: string, command: Object): Promise<void>;
    }

    interface GeoQueryI {
        categories?: string | string[];
        includeMetadata?: boolean;
        metadata?: Object;
        condition?: string;
        relativeFindMetadata?: Object;
        relativeFindPercentThreshold?: number;
        pageSize?: number;
        offset?: number;
    }

    interface RectangleGeoQueryI extends Backendless.GeoQueryI {
        searchRectangle: number[];
    }

    interface CircleGeoQueryI extends Backendless.GeoQueryI {
        latitude: number;
        longitude: number;
        radius: number;
        units: string;
    }
}

declare module 'backendless' {
    export default Backendless;
}

/**
 * @global
 * @namespace Backendless
 */
declare module Backendless {
    type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>

    let debugMode: boolean;
    let serverURL: string;
    let automationServerURL: string;
    let appId: string;
    let apiKey: string;
    let appPath: string;
    let automationPath: string;
    let domain: string;
    let apiURI: string;
    let XMLHttpRequest: any;

    let browser: {
        browser: string;
        version: string;
    };

    /** @deprecated **/
    let applicationId: string;

    /** @deprecated **/
    let secretKey: string;

    /**
     * @dictionary
     */
    let PublishOptionsHeaders: { [key: string]: string; };

    interface InitAppConfig {
        appId?: string;
        apiKey?: string;
        standalone?: boolean;
        serverURL?: string;
        automationServerURL?: string;
        domain?: string;
        debugMode?: boolean;
        XMLHttpRequest?: XMLHttpRequest;
    }

    /**
     * @public
     * @type: Function
     **/
    function initApp(appId: string, apiKey: string): Object;
    function initApp(config: InitAppConfig): Object;
    function initApp(domain: string): Object;

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
        function set(key: string, value?: any): void;

        function remove(key: string): void;

        function get<T = any>(key: string): T;
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
            grantUser(userId: string, dataItem: ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            denyUser(userId: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            grantRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

            /** @deprecated */
            denyRole(roleName: string, dataItem: Backendless.ExistDataItemI): Promise<Backendless.ExistDataItemI>;

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

            static fromWKT(wellKnownText: string, srs?: SpatialReferenceSystem.SpatialType): Point | LineString | Polygon;

            static fromGeoJSON(geoJSON: string, srs?: SpatialReferenceSystem.SpatialType): Point | LineString | Polygon;

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

            read(geoJSON: string): Point | LineString | Polygon;
        }

        /**
         * @public
         * @class Backendless.Data.WKTParser
         */
        class WKTParser {
            constructor(srs: SpatialReferenceSystem.SpatialType);

            read(wktString: string): Point | LineString | Polygon;
        }

        function of(model: string | Object | Function): Backendless.DataStore;

        function save(model: Backendless.DataStore | string, data: Object): Promise<Object>;

        function deepSave(model: Backendless.DataStore | string, data: Object): Promise<Object>;

        function getView(viewName: string, whereClause?: string, pageSize?: number, offset?: number): Promise<Object>;

        function describe(model: string | Object | Function): Promise<Object>;

        function getTableNameById(tableId: string): Promise<string>;

        function mapTableToClass(tableName: string, clientClass: Function): void;
        function mapTableToClass(clientClass: Function): void;
    }

    /**
     * @public
     * @type: Function
     **/
    function Hive(hiveName: string): Backendless.Hive.DataHive;

    /**
     * @public
     * @namespace Backendless.Hive
     */
    namespace Hive {
        /**
         * @public
         * @type: Function
         */
        function getNames(): Array<string>

        /**
         * @public
         * @class Backendless.Hive.DataHive
         * @constructor
         */
        class DataHive {
            constructor(hiveName: string, appContext: object);

            create(): Promise<void>

            delete(): Promise<void>

            rename(newName: string): Promise<void>

            KeyValueStore: KeyValueStore;
            ListStore: ListStore;
            MapStore: MapStore;
            SetStore: SetStore;
            SortedSetStore: SortedSetStore;
        }

        interface StoreKeysOptionsI {
            filterPattern?: string;
            cursor?: number;
            pageSize?: number;
        }

        interface StoreKeysResultI {
            keys: string[];
            cursorId: string;
        }

        /**
         * @private
         */
        interface HiveStore {
            keys(options?: StoreKeysOptionsI): Promise<StoreKeysResultI>;

            delete(keys: Array<string>): Promise<number>;

            exist(keys: Array<string>): Promise<number>;

            touch(keys: Array<string>): Promise<void>;
        }

        /**
         * @private
         */
        interface hiveStore {

            delete(): Promise<number>;

            rename(newKeyName: string, overwrite?: boolean): Promise<void>;

            exist(): Promise<boolean>;

            getExpiration(): Promise<number>;

            clearExpiration(): Promise<void>;

            touch(): Promise<void>;

            secondsSinceLastOperation(): Promise<number>;

            expireAfter(ttl: number): Promise<void>;

            expireAt(timestamp: number): Promise<void>;
        }

        interface KeyValueSetKeyOptionsI {
            ttl?: Number; // in seconds
            expireAt?: Number; // timestamp
            condition?: 'IfExists' | 'IfNotExists' | 'Always'; //if not provided set anyway
        }

        /**
         * @public
         */
        interface KeyValueStore extends HiveStore {
            (keyName: string): keyValueStore

            get(keys: Array<string>): Promise<object>;

            set(key: string, value: JSONValue, options?: KeyValueSetKeyOptionsI): Promise<boolean>;

            set(keysMap: object): Promise<boolean>;
        }

        /**
         * @public
         */
        interface keyValueStore extends hiveStore {
            get(): Promise<JSONValue | null>;

            set(value: JSONValue, options?: KeyValueSetKeyOptionsI): Promise<boolean>;

            increment(value: number): Promise<number>;

            decrement(value: number): Promise<number>;
        }

        /**
         * @public
         */
        interface ListStore extends HiveStore {
            (keyName: string): listStore
        }

        /**
         * @public
         */
        interface listStore extends hiveStore {
            get(): Promise<Array<JSONValue>>

            get(index: number): Promise<JSONValue | null>

            get(indexFrom: number, indexTo: number): Promise<Array<JSONValue>>

            insertBefore(valueToInsert: JSONValue, anchorValue: JSONValue): Promise<number>;

            insertAfter(valueToInsert: JSONValue, anchorValue: JSONValue): Promise<number>;

            length(): Promise<number>;

            addFirstValue(value: JSONValue): Promise<number>

            addFirstValues(values: Array<JSONValue>): Promise<number>

            addLastValue(value: JSONValue): Promise<number>

            addLastValues(values: Array<JSONValue>): Promise<number>

            deleteFirst(): Promise<Array<JSONValue>>

            deleteFirst(count: number): Promise<Array<JSONValue>>

            deleteLast(): Promise<Array<JSONValue>>

            deleteLast(count: number): Promise<Array<JSONValue>>

            deleteValue(value: JSONValue, count?: number): Promise<number>
        }

        /**
         * @public
         */
        interface MapStore extends HiveStore {
            (keyName: string): mapStore
        }

        /**
         * @public
         */
        interface mapStore extends hiveStore {

            get(): Promise<object>;

            get(key: string): Promise<object>;

            get(keys: Array<string>): Promise<object>;

            getValue(key: string): Promise<JSONValue | null>;

            keyExists(key: string): Promise<boolean>;

            length(): Promise<number>;

            keys(): Promise<Array<string>>;

            values(): Promise<Array<JSONValue>>;

            set(data: object): Promise<number>;

            set(key: string, value: JSONValue): Promise<boolean>;

            setWithOverwrite(key: string, value: JSONValue, overwrite?: boolean): Promise<boolean>;

            increment(key: string, count?: number): Promise<number>;

            decrement(key: string, count?: number): Promise<number>;

            deleteKeys(key: string): Promise<number>;

            deleteKeys(keys: Array<string>): Promise<number>;
        }

        /**
         * @public
         */
        interface SetStore extends HiveStore {
            (keyName: string): setStore;

            difference(storeKeys: Array<string>): Promise<Array<JSONValue>>;

            intersection(storeKeys: Array<string>): Promise<Array<JSONValue>>;

            union(storeKeys: Array<string>): Promise<Array<JSONValue>>;
        }

        /**
         * @public
         */
        interface setStore extends hiveStore {

            get(): Promise<Array<JSONValue>>;

            getRandom(count?: number): Promise<Array<JSONValue>>;

            getRandomAndDelete(count?: number): Promise<Array<JSONValue>>;

            addValue(value: JSONValue): Promise<number>;

            addValues(values: Array<JSONValue>): Promise<number>;

            deleteValue(value: JSONValue): Promise<number>;

            deleteValues(values: Array<JSONValue>): Promise<number>;

            isValueMember(value: JSONValue): Promise<Array<boolean>>;

            isValuesMembers(values: Array<JSONValue>): Promise<Array<boolean>>;

            length(): Promise<number>;
        }

        type SortedSetItem = [number, JSONValue]
        type SortedSetBound = 'Include' | 'Exclude' | 'Infinity'

        interface SortedSetItemOptionsI {
            duplicateBehaviour?: 'OnlyUpdate' | 'AlwaysAdd';
            scoreUpdateMode?: 'Greater' | 'Less';
            resultType?: 'NewAdded' | 'TotalChanged';
        }

        interface SortedSetFilterI {
            minScore?: number,
            maxScore?: number,
            minBound?: SortedSetBound,
            maxBound?: SortedSetBound,
        }

        /**
         * @public
         */
        interface SortedSetStore extends HiveStore {
            (keyName: string): sortedSetStore

            difference(storeKeys: Array<string>): Promise<Array<JSONValue>>;

            intersection(storeKeys: Array<string>): Promise<Array<JSONValue>>;

            union(storeKeys: Array<string>): Promise<Array<JSONValue>>;
        }

        /**
         * @public
         */
        interface sortedSetStore extends hiveStore {

            add(items: Array<SortedSetItem>, options?: SortedSetItemOptionsI): Promise<number>

            incrementScore(value: JSONValue, scoreValue: number): Promise<number>

            decrementScore(value: JSONValue, scoreValue: number): Promise<number>

            getAndDeleteMaxScore(count?: number): Promise<Array<SortedSetItem>>

            getAndDeleteMinScore(count?: number): Promise<Array<SortedSetItem>>

            getRandom<T = SortedSetItem | JSONValue>(options?: { count?: number, withScores?: boolean }): Promise<Array<T>>

            getScore(value: JSONValue): Promise<number | null>

            getRank(value: JSONValue, reverse?: boolean): Promise<number | null>

            getRangeByRank<T = SortedSetItem | JSONValue>(startRank: number, stopRank: number, options?: {
                reverse?: boolean,
                withScores?: boolean
            }): Promise<Array<T>>

            getRangeByScore<T = SortedSetItem | JSONValue>(options?: {
                minScore?: number,
                maxScore?: number,
                minBound?: SortedSetBound,
                maxBound?: SortedSetBound,
                offset?: number,
                pageSize?: number
                reverse?: boolean,
                withScores?: boolean
            }): Promise<Array<T>>

            deleteValue(value: JSONValue): Promise<number>;

            deleteValues(values: Array<JSONValue>): Promise<number>;

            deleteValuesByRank(startRank: number, stopRank: number): Promise<number>;

            deleteValuesByScore(options?: SortedSetFilterI): Promise<number>;

            length(): Promise<number>;

            countBetweenScores(options?: SortedSetFilterI): Promise<number>;
        }
    }

    /**
     * @public
     * @namespace Backendless.Automations
     */
    namespace Automations {
        /**
         * @public
         * @type: Function
         */

        type Execution = 'any' | 'all' | string

        function activateFlow(flowName: string, initialData?: object): Promise<void>
        function activateFlowById(flowId: string, initialData?: object): Promise<void>
        function activateFlowTrigger(flowName: string, triggerName: string, data?: object): Promise<void>
        function activateFlowTriggerById(flowId: string, triggerId: string, data?: object, execution?: Execution): Promise<void>
    }

    /**
     * @public
     * @namespace Backendless.UserService
     **/
    namespace UserService {
        let restUrl: string;

        let currentUser: Backendless.User;

        /**
         * @public
         * @namespace Backendless.UserService.Utils
         */
        namespace Utils {
            function getClientUserLocale(): string;
        }

        function register(user: Backendless.User): Promise<Backendless.User>;
        function register<T>(user: T): Promise<T>;

        function findByRole<T = Backendless.User>(roleName: string, loadRoles?: boolean, query?: Backendless.DataQueryBuilder | DataQueryI): Promise<T[]>;

        function getUserRoles(userId?: string): Promise<string[]>;

        function describeUserClass(): Promise<Object[]>;

        function restorePassword(email: string): Promise<void>;

        function assignRole(identity: string, roleName: string): Promise<void>;

        function unassignRole(identity: string, roleName: string): Promise<void>;

        function login<T = Backendless.User>(userId: string, stayLoggedIn?: boolean): Promise<T>;
        function login<T = Backendless.User>(identity: string, password: string, stayLoggedIn?: boolean): Promise<T>;

        function loginAsGuest(stayLoggedIn?: boolean): Promise<Backendless.User>;
        function loginAsGuest<T>(stayLoggedIn?: boolean): Promise<T>;

        function loggedInUser(): boolean;

        function logout(): Promise<void>;

        function getCurrentUser<T = Backendless.User>(reload?: boolean): Promise<T>;

        function setCurrentUser<T = Backendless.User>(user?: Object, stayLoggedIn?: boolean): T;

        function update(user: Backendless.User): Promise<Backendless.User>;
        function update<T>(user: T): Promise<T>;

        function loginWithFacebook(fields?: Object, permissions?: Object, stayLoggedIn?: boolean): Promise<void>;

        function loginWithGooglePlus(fields?: Object, permissions?: Object, container?: HTMLElement, stayLoggedIn?: boolean): Promise<void>;

        function loginWithTwitter(fields?: Object, stayLoggedIn?: boolean): Promise<void>;

        function loginWithFacebookSdk<T = Backendless.User>(accessToken: String, fieldsMapping: object, stayLoggedIn: boolean): Promise<T>;
        function loginWithFacebookSdk<T = Backendless.User>(accessToken: String, fieldsMapping: object): Promise<T>;
        function loginWithFacebookSdk<T = Backendless.User>(accessToken: String, stayLoggedIn: boolean): Promise<T>;
        function loginWithFacebookSdk<T = Backendless.User>(accessToken: String): Promise<T>;

        function loginWithGooglePlusSdk<T = Backendless.User>(accessToken: String, fieldsMapping: object, stayLoggedIn: boolean): Promise<T>;
        function loginWithGooglePlusSdk<T = Backendless.User>(accessToken: String, fieldsMapping: object): Promise<T>;
        function loginWithGooglePlusSdk<T = Backendless.User>(accessToken: String, stayLoggedIn: boolean): Promise<T>;
        function loginWithGooglePlusSdk<T = Backendless.User>(accessToken: String): Promise<T>;

        function loginWithOauth2<T = Backendless.User>(providerCode: String, accessToken: String, guestUser?: Backendless.User, fieldsMapping?: object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithOauth2<T = Backendless.User>(providerCode: String, accessToken: String, fieldsMapping?: object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithOauth2<T = Backendless.User>(providerCode: String, accessToken: String, stayLoggedIn?: boolean): Promise<T>;

        function loginWithOauth1<T = Backendless.User>(providerCode: String, accessToken: String, accessTokenSecret: String, guestUser?: Backendless.User, fieldsMapping?: object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithOauth1<T = Backendless.User>(providerCode: String, accessToken: String, accessTokenSecret: String, fieldsMapping?: object, stayLoggedIn?: boolean): Promise<T>;
        function loginWithOauth1<T = Backendless.User>(providerCode: String, accessToken: String, accessTokenSecret: String, stayLoggedIn?: boolean): Promise<T>;

        function isValidLogin(): Promise<boolean>;

        function verifyPassword(currentPassword: string): Promise<boolean>;

        function resendEmailConfirmation(identity: string | number): Promise<void>;

        function createEmailConfirmationURL(identity: string | number): Promise<object>;

        function enableUser(userId: string | number): Promise<void>;

        function disableUser(userId: string | number): Promise<void>;

        function getAuthorizationUrlLink(providerCode: string, fieldsMapping?: object, scope?: string, redirect?: boolean, redirectAfterLoginUrl?: string, callbackUrlDomain?: string): Promise<string>;
    }

    /**
     * @public
     * @namespace Backendless.Messaging
     **/
    namespace Messaging {
        let restUrl: string;
        let channelProperties: Object;

        function subscribe(channelName: string): ChannelClass;

        function deleteChannel(channelName: string): Promise<object>;

        function publish(channelName: string, message: string | Object, publishOptions?: Backendless.PublishOptions, deliveryOptions?: Backendless.DeliveryOptions): Promise<Object>;

        function sendEmail(subject: string, bodyParts: Backendless.Bodyparts, recipients: string[], attachments?: string[]): Promise<object>;

        function sendEmailFromTemplate(templateName: string, emailEnvelope: Backendless.EmailEnvelope, templateValues?: object, attachments?: string[]): Promise<object>;

        function sendEmailFromTemplate(templateName: string, emailEnvelope: Backendless.EmailEnvelope, templateValues?: object): Promise<object>;

        function sendEmailFromTemplate(templateName: string, emailEnvelope: Backendless.EmailEnvelope, attachments?: string[]): Promise<object>;

        function sendEmailFromTemplate(templateName: string, emailEnvelope: Backendless.EmailEnvelope): Promise<object>;

        function cancel(messageId: string): Promise<boolean>;

        function registerDevice(deviceToken: string, channels?: string[], expiration?: number | Date): Promise<Object>;

        function getRegistrations(): Promise<Object>;

        function unregisterDevice(): Promise<Object>;

        function getMessageStatus(messageId: string): Promise<boolean>;

        function getPushTemplates(deviceType: string): Promise<Object>;

        function pushWithTemplate(templateName: string, templateValues?: object): Promise<Object>;
    }

    /**
     * @public
     * @namespace Backendless.Management
     **/
    namespace Management {

        /**
         * @public
         * @interface Backendless.Management.Data
         */
        interface Data {
            createTable(name: string, columns: Array<object>): Promise<void>;
        }

        const Data: Data
    }

    /**
     * @public
     * @namespace Backendless.Files
     **/
    namespace Files {

        interface FilePermissionI {

            /** @deprecated */
            grantUser(userId: string, url: string): Promise<boolean>;

            /** @deprecated */
            grantRole(roleName: string, url: string): Promise<boolean>;

            /** @deprecated */
            denyUser(userId: string, url: string): Promise<boolean>;

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

        function saveFile(path: string, fileName: string, fileContent: Blob | Buffer | string, overwrite?: boolean): Promise<string>;

        // @ts-ignore - file has to be an instance of File in browser env and an instance of ReadStream in nodejs env
        function upload(readStream: ReadStream, path: string, overwrite?: boolean): Promise<{ fileURL: string }>;
        function upload(file: File, path: string, overwrite?: boolean): Promise<{ fileURL: string }>;
        function upload(fileURL: string, path: string, overwrite?: boolean): Promise<{ fileURL: string }>;

        function append(filePath: string, fileURL: string): Promise<string>;
        function append(filePath: string, fileContent: Blob | Buffer | ArrayBuffer | number[]): Promise<string>;
        // @ts-ignore
        function append(filePath: string, readStream: ReadStream): Promise<string>;

        function append(directoryPath: string, fileName: string, fileURL: string): Promise<string>;
        function append(directoryPath: string, fileName: string, fileContent: Blob | Buffer | ArrayBuffer | number[]): Promise<string>;
        // @ts-ignore
        function append(directoryPath: string, fileName: string, readStream: ReadStream): Promise<string>;

        function appendText(directoryPath: string, fileName: string, fileContent: string): Promise<string>;
        function appendText(filePath: string, fileContent: string): Promise<string>;

        function listing(path: string, pattern?: string, sub?: boolean, pageSize?: number, offset?: number): Promise<Object>;

        function getFileCount(path: string, pattern?: string, sub?: boolean, countDirectories?: boolean): Promise<number>;

        function renameFile(oldPathName: string, newName: string): Promise<Object>;

        function moveFile(sourcePath: string, targetPath: string): Promise<Object>;

        function copyFile(sourcePath: string, targetPath: string): Promise<Object>;

        function remove(fileURL: string): Promise<number>;

        function exists(path: string): Promise<Object>;

        function createDirectory(path: string): Promise<void>;

        function removeDirectory(path: string): Promise<number>;
    }

    /**
     * @public
     * @namespace Backendless.Commerce
     **/
    namespace Commerce {
        let restUrl: string;

        function validatePlayPurchase(packageName: string, productId: string, token: string): Promise<Object>;

        function cancelPlaySubscription(packageName: string, subscriptionId: string, token: string): Promise<Object>;

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
            invoke(serviceName: string, method: string, parameters?: object): Promise<any>;

            invoke(serviceName: string, method: string, parameters: object | null, executionType?: string): Promise<any>;

            invoke(serviceName: string, method: string, executionType?: string): Promise<any>;

            invoke(serviceName: string, method: string, parameters: object | null, executionType?: string): Promise<any>;

            invoke(serviceName: string, method: string, parameters: object | null, options?: { executionType?: string, httpRequestHeaders?: object }): Promise<any>;
        }

        /**
         * @public
         * @interface CustomServicesI
         * @namespace Backendless.BL.CustomServices
         **/
        let CustomServices: CustomServicesI;

        export interface EventsI {
            restUrl: string;

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

        function put(key: string, value: any, timeToLive?: number): Promise<Object>;

        function expireIn(key: string, time: number | Date): Promise<Object>;

        function expireAt(key: string, time: number | Date): Promise<Object>;

        function contains(key: string): Promise<Object>;

        function get(key: string): Promise<Object>;

        function remove(key: string): Promise<Object>;
    }

    /**
     * @namespace Backendless.Counters
     **/
    namespace Counters {
        function list(pattern?: string): Promise<string[]>;

        function of(counterName: string): Counter;

        function get(counterName: string): Promise<number>;

        function getAndIncrement(counterName: string): Promise<number>;

        function incrementAndGet(counterName: string): Promise<number>;

        function getAndDecrement(counterName: string): Promise<number>;

        function decrementAndGet(counterName: string): Promise<number>;

        function addAndGet(counterName: string, value: number): Promise<number>;

        function getAndAdd(counterName: string, value: number): Promise<number>

        function compareAndSet(counterName: string, expected: number, updated: number): Promise<number>;

        function reset(counterName: string): Promise<number>;
    }

    /**
     * @public
     * @namespace Backendless.CustomServices
     **/
    let CustomServices: Backendless.BL.CustomServicesI;
    let APIServices: Backendless.BL.CustomServicesI;

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

        function setMessagesLimit(limit: number): void;

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
     * @public
     * @class Backendless.User
     * @constructor
     */
    class User {
        ___class: string;
        objectId?: string;
        username?: string;
        password?: string;
        email?: string;
        blUserLocale?: string;
    }

    interface DataQueryI {
        pageSize?: number;
        offset?: number;

        properties?: Array<string>;
        excludeProps?: Array<string>;

        where?: string;
        having?: string;

        sortBy?: Array<string>;
        groupBy?: Array<string>;

        relations?: Array<string>;
        relationsDepth?: number;
        relationsPageSize?: number;

        fileReferencePrefix?: string;
    }

    interface RelationsQueryI extends DataQueryI {
        relationName: string;
        relationModel?: Function;
    }

    interface GroupQueryI extends DataQueryI {
        groupPageSize?: number;
        recordsPageSize?: number;
        groupDepth?: number;
        groupPath?: Array<object>;
    }

    /**
     * @public
     * @class Backendless.DataQueryBuilder
     * @constructor
     */
    class DataQueryBuilder {
        static create(): Backendless.DataQueryBuilder;

        setPageSize(pageSize: number): this;

        getPageSize(): number;

        setOffset(offset: number): this;

        getOffset(): number;

        prepareNextPage(): this;

        preparePreviousPage(): this;

        getProperties(): Array<string>;

        setProperties(properties: string | Array<string>): this;

        addProperty(property: string): this;

        addProperties(...properties: Array<string | Array<string>>): this;

        addAllProperties(): this;

        excludeProperty(property: string): this;

        excludeProperties(...properties: Array<string | Array<string>>): this;

        getWhereClause(): string;

        setWhereClause(whereClause: string): this;

        getHavingClause(): string;

        setHavingClause(havingClause: string): this;

        getSortBy(): Array<string>;

        setSortBy(sortBy: string | Array<string>): this;

        getGroupBy(): Array<string>;

        setGroupBy(groupBy: string | Array<string>): this;

        getRelated(): Array<string>;

        setRelated(relations: string | Array<string>): this;

        addRelated(relations: string | Array<string>): this;

        getRelationsDepth(): number;

        setRelationsDepth(relationsDepth: number): this;

        getRelationsPageSize(): number;

        setRelationsPageSize(relationsPageSize: number): this;

        setFileReferencePrefix(fileReferencePrefix: string): this;

        getFileReferencePrefix(): string;

        setDistinct(distinct: boolean): this;

        getDistinct(): boolean;

        build(): Backendless.DataQueryValueI;

        toJSON(): DataQueryI;
    }

    /**
     * @public
     * @class Backendless.JSONUpdateBuilder
     * @constructor
     */
    class JSONUpdateBuilder {
        static SET(): Backendless.JSONUpdateBuilder;

        static INSERT(): Backendless.JSONUpdateBuilder;

        static REPLACE(): Backendless.JSONUpdateBuilder;

        static REMOVE(): Backendless.JSONRemoveBuilder;

        static ARRAY_APPEND(): Backendless.JSONUpdateBuilder;

        static ARRAY_INSERT(): Backendless.JSONUpdateBuilder;

        addArgument(arg: string, argValue: any): Backendless.JSONUpdateBuilder;

        create(): Object;

        toJSON(): Object;
    }

    /**
     * @private
     * @class Backendless.JSONRemoveBuilder
     * @constructor
     */
    class JSONRemoveBuilder extends JSONUpdateBuilder {
        addArgument(arg: string): Backendless.JSONRemoveBuilder;
    }

    /**
     * @public
     * @class Backendless.LoadRelationsQueryBuilder
     * @constructor
     */

    class LoadRelationsQueryBuilder extends DataQueryBuilder {
        static create(): Backendless.LoadRelationsQueryBuilder;

        static of(RelationModel: Object): Backendless.LoadRelationsQueryBuilder;

        setRelationModel(RelationModel: Object): this;

        getRelationModel(): Object;

        setRelationName(relationName: string): this;

        getRelationName(): string;

        toJSON(): RelationsQueryI;
    }

    /**
     * @public
     * @class Backendless.GroupQueryBuilder
     * @constructor
     */

    class GroupQueryBuilder extends DataQueryBuilder {
        static create(): Backendless.GroupQueryBuilder;

        setGroupPageSize(groupPageSize: number): this;

        getGroupPageSize(): number;

        setRecordsPageSize(recordsPageSize: number): this;

        getRecordsPageSize(): number;

        setGroupDepth(groupDepth: number): this;

        getGroupDepth(): number;

        addGroupPath(groupPath: object): this;

        setGroupPath(groupPath: object | Array<object>): this;

        getGroupPath(): Array<object>;

        toJSON(): GroupQueryI;
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
        uniqueEmails: boolean;

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

        setUniqueEmails(uniqueEmails: boolean): Backendless.EmailEnvelope;

        getUniqueEmails(): boolean;
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
     * @private
     * @class Logger
     */
    class Logger {
        debug(message: string): void;

        info(message: string): void;

        warn(message: string, exception?: string): void;

        error(message: string, exception?: string): void;

        fatal(message: string, exception?: string): void;

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

    interface RTChangeRelationStatus {
        parentObjectId: string;
        isConditional: boolean;
        whereClause?: string;
        children?: string[];
    }

    /**
     * @private
     * @class EventHandler
     */
    class EventHandler {
        addUpsertListener<T = object>(whereClause: string, callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addUpsertListener<T = object>(whereClause: string, callback: (obj: T) => void): Backendless.EventHandler;
        addUpsertListener<T = object>(callback: (obj: T) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addUpsertListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;

        removeUpsertListeners(whereClause: string): Backendless.EventHandler;
        removeUpsertListeners(): Backendless.EventHandler;

        removeUpsertListener<T = object>(callback: (obj: T) => void): Backendless.EventHandler;
        removeUpsertListener<T = object>(whereClause: string, callback: (obj: T) => void): Backendless.EventHandler;

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

        addBulkUpsertListener(callback: (list: string[]) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkUpsertListener(callback: (list: string[]) => void): Backendless.EventHandler;
        addBulkUpsertListener(whereClause: string, callback: (list: string[]) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkUpsertListener(whereClause: string, callback: (list: string[]) => void): Backendless.EventHandler;

        removeBulkUpsertListener(callback: (list: string[]) => void): Backendless.EventHandler;
        removeBulkUpsertListener(whereClause: string, callback: (list: string[]) => void): Backendless.EventHandler;
        removeBulkUpsertListeners(whereClause: string): Backendless.EventHandler;
        removeBulkUpsertListeners(): Backendless.EventHandler;

        addBulkCreateListener(callback: (list: string[]) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addBulkCreateListener(callback: (list: string[]) => void): Backendless.EventHandler;
        addBulkCreateListener(whereClause: string, callback: (list: string[]) => void): Backendless.EventHandler;
        addBulkCreateListener(whereClause: string, callback: (list: string[]) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;

        removeBulkCreateListener(whereClause: string, callback: (list: string[]) => void): Backendless.EventHandler;
        removeBulkCreateListener(callback: (list: string[]) => void): Backendless.EventHandler;

        removeBulkCreateListeners(): Backendless.EventHandler;
        removeBulkCreateListeners(whereClause: string): Backendless.EventHandler;

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

        addSetRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addSetRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;
        addSetRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addSetRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        addAddRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addAddRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;
        addAddRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addAddRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        addDeleteRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addDeleteRelationListener(relationColumnName: string, parents: Array<string> | Array<{ objectId: string, [key: string]: any }>, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;
        addDeleteRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void, onError: (error: RTSubscriptionError) => void): Backendless.EventHandler;
        addDeleteRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        removeSetRelationListener(relationColumnName: string, callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;
        removeSetRelationListener(callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        removeSetRelationListeners(relationColumnName: string): Backendless.EventHandler;
        removeSetRelationListeners(): Backendless.EventHandler;

        removeAddRelationListener(callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        removeAddRelationListeners(relationColumnName: string): Backendless.EventHandler;
        removeAddRelationListeners(): Backendless.EventHandler;

        removeDeleteRelationListener(callback: (data: RTChangeRelationStatus) => void): Backendless.EventHandler;

        removeDeleteRelationListeners(relationColumnName: string): Backendless.EventHandler;
        removeDeleteRelationListeners(): Backendless.EventHandler;

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

        save<T = object>(obj: T | object, isUpsert?: boolean): Promise<T>;

        deepSave<T = object>(obj: T | object): Promise<T>;

        remove(id: object | string | number): Promise<object>;

        find<T = object>(obj?: Backendless.DataQueryBuilder | DataQueryI): Promise<Array<T>>;

        group<T = object>(obj?: Backendless.GroupQueryBuilder | GroupQueryI): Promise<Array<T>>;

        countInGroup(obj?: Backendless.GroupQueryBuilder | GroupQueryI): Promise<number>;

        findById<T = object>(objectId: string | number, query?: Backendless.DataQueryBuilder | DataQueryI): Promise<T>;
        findById<T = object>(primaryKeys: object, query?: Backendless.DataQueryBuilder | DataQueryI): Promise<T>;

        findFirst<T = object>(query?: Backendless.DataQueryBuilder | DataQueryI): Promise<T>;

        findLast<T = object>(query?: Backendless.DataQueryBuilder | DataQueryI): Promise<T>;

        loadRelations<T = object>(parent: string | number | object, query: Backendless.LoadRelationsQueryBuilder | RelationsQueryI): Promise<Array<T>>;

        getObjectCount(query?: Backendless.DataQueryBuilder | string): Promise<number>

        setRelation(parent: object | string | number, columnName: string, children: Array<object | string | number>): Promise<string>;
        setRelation(parent: object | string | number, columnName: string, whereClause: string): Promise<string>;

        addRelation(parent: object | string | number, columnName: string, children: Array<object | string | number>): Promise<string>;
        addRelation(parent: object | string | number, columnName: string, whereClause: string): Promise<string>;

        deleteRelation(parent: object | string | number, columnName: string, children: Array<object | string | number>): Promise<string>;
        deleteRelation(parent: object | string | number, columnName: string, whereClause: string): Promise<string>;

        bulkCreate(objects: Array<object>): Promise<Array<string>>;

        bulkUpsert(objects: Array<object>): Promise<Array<string>>;

        bulkUpdate(whereClause: string, changes: object): Promise<string>;

        bulkDelete(where: string | Array<string | number | { objectId: string | number, [key: string]: any }>): Promise<string>;

        rt(): EventHandler;
    }

    /**
     * @private
     * @class Counter
     */
    class Counter {

        constructor(name: string, restUrl: string);

        get(): Promise<number>;

        getAndIncrement(): Promise<number>;

        incrementAndGet(): Promise<number>;

        getAndDecrement(): Promise<number>;

        decrementAndGet(): Promise<number>;

        addAndGet(value: number): Promise<number>;

        getAndAdd(value: number): Promise<number>

        compareAndSet(expected: number, updated: number): Promise<number>;

        reset(): Promise<number>;
    }

    interface DataQueryValueI {
        properties?: string[];
        condition?: string;
        options?: Object;
        url?: string;
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

        removeCommandListeners(callback?: (command: Object) => void): ChannelClass;

        addUserStatusListener(callback: (userStates: Object) => void, onError?: (error: Object) => void): ChannelClass;

        removeUserStatusListener(callback: (userStates: Object) => void): ChannelClass;

        removeUserStatusListeners(): ChannelClass;

        removeAllListeners(): ChannelClass;

        send(type: string, command: Object): Promise<void>;
    }

    class TransactionOperationError extends Error {
        operation: OpResult;
    }

    class UnitOfWorkResult {
        setIsolationLevel(isolationLevel: IsolationLevelEnum): UnitOfWorkResult;

        isSuccess(): boolean;

        getError(): TransactionOperationError;

        getResults(): object;
    }

    class OpResultValueReference {

    }

    class OpResult {
        opResultId: string;

        getTableName(): string;

        getOpResultId(): string;

        setOpResultId(opResultId: string): this;

        resolveTo(index: number, property?: string): OpResultValueReference
        resolveTo(property: string): OpResultValueReference
    }

    enum IsolationLevelEnum {
        READ_UNCOMMITTED,
        READ_COMMITTED,
        REPEATABLE_READ,
        SERIALIZABLE
    }

    interface IsolationLevel {
        READ_UNCOMMITTED: IsolationLevelEnum,
        READ_COMMITTED: IsolationLevelEnum,
        REPEATABLE_READ: IsolationLevelEnum,
        SERIALIZABLE: IsolationLevelEnum
    }

    class UnitOfWork {

        static IsolationLevelEnum: IsolationLevel
        static OpResult: Function
        static OpResultValueReference: Function

        static initFromJSON(data: object): UnitOfWork;

        constructor(isolation?: IsolationLevelEnum);

        find(tableName: string, dataQueryBuilder: DataQueryBuilder): OpResult;

        create(object: object): OpResult;
        create(tableName: string, object: object): OpResult;

        upsert(object: object): OpResult;
        upsert(tableName: string, object: object): OpResult;

        update(object: object): OpResult;
        update(tableName: string, object: object): OpResult;
        update(opResult: OpResult | OpResultValueReference, changes: object): OpResult;
        update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: OpResultValueReference): OpResult;
        update(opResult: OpResult | OpResultValueReference, propertyName: string, propertyValue: number | string | boolean): OpResult;
        update(opResult: OpResult | OpResultValueReference, propertyName: string, expression: Expression): OpResult;

        delete(opResult: OpResult | OpResultValueReference): OpResult;
        delete(object: object): OpResult;
        delete(tableName: string, object: object): OpResult;
        delete(tableName: string, objectId: string): OpResult;

        bulkCreate(tableName: string, objects: object[]): OpResult;
        bulkCreate(objects: object[]): OpResult;

        bulkUpsert(tableName: string, objects: object[]): OpResult;
        bulkUpsert(objects: object[]): OpResult;

        bulkUpdate(tableName: string, whereClause: string, changes: object): OpResult;
        bulkUpdate(tableName: string, objectIds: string[], changes: object): OpResult;
        bulkUpdate(tableName: string, objects: object[], changes: object): OpResult;
        bulkUpdate(opResult: OpResult, changes: object): OpResult;

        bulkDelete(opResult: OpResult): OpResult;
        bulkDelete(objects: object[]): OpResult;
        bulkDelete(tableName: string, objects: object[]): OpResult;
        bulkDelete(tableName: string, objectIds: string[]): OpResult;
        bulkDelete(tableName: string, whereClause: string): OpResult;

        addToRelation(parentObject: OpResult, columnName: string, whereClause: string): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, objectIds: string[]): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, child: OpResult): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, child: OpResultValueReference): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, child: object): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, children: object[]): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, children: OpResult[]): OpResult;
        addToRelation(parentObject: OpResult, columnName: string, children: OpResultValueReference[]): OpResult;

        addToRelation(parentObject: OpResultValueReference, columnName: string, whereClause: string): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, objectIds: string[]): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, child: OpResult): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, child: OpResultValueReference): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, child: object): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, children: object[]): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, children: OpResult[]): OpResult;
        addToRelation(parentObject: OpResultValueReference, columnName: string, children: OpResultValueReference[]): OpResult;

        addToRelation(parentObject: object, columnName: string, whereClause: string): OpResult;
        addToRelation(parentObject: object, columnName: string, objectIds: string[]): OpResult;
        addToRelation(parentObject: object, columnName: string, child: OpResult): OpResult;
        addToRelation(parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        addToRelation(parentObject: object, columnName: string, child: object): OpResult;
        addToRelation(parentObject: object, columnName: string, children: object[]): OpResult;
        addToRelation(parentObject: object, columnName: string, children: OpResult[]): OpResult;
        addToRelation(parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        addToRelation(tableName: string, parentObject: object, columnName: string, whereClause: string): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, objectIds: string[]): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, child: OpResult): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, child: object): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, children: object[]): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, children: OpResult[]): OpResult;
        addToRelation(tableName: string, parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        addToRelation(tableName: string, parentObjectId: string, columnName: string, whereClause: string): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, objectIds: string[]): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResult): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResultValueReference): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, child: object): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, children: object[]): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResult[]): OpResult;
        addToRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResultValueReference[]): OpResult;

        setRelation(parentObject: OpResult, columnName: string, whereClause: string): OpResult;
        setRelation(parentObject: OpResult, columnName: string, objectIds: string[]): OpResult;
        setRelation(parentObject: OpResult, columnName: string, child: OpResult): OpResult;
        setRelation(parentObject: OpResult, columnName: string, child: OpResultValueReference): OpResult;
        setRelation(parentObject: OpResult, columnName: string, child: object): OpResult;
        setRelation(parentObject: OpResult, columnName: string, children: object[]): OpResult;
        setRelation(parentObject: OpResult, columnName: string, children: OpResult[]): OpResult;
        setRelation(parentObject: OpResult, columnName: string, children: OpResultValueReference[]): OpResult;

        setRelation(parentObject: OpResultValueReference, columnName: string, whereClause: string): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, objectIds: string[]): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, child: OpResult): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, child: OpResultValueReference): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, child: object): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, children: object[]): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, children: OpResult[]): OpResult;
        setRelation(parentObject: OpResultValueReference, columnName: string, children: OpResultValueReference[]): OpResult;

        setRelation(parentObject: object, columnName: string, whereClause: string): OpResult;
        setRelation(parentObject: object, columnName: string, objectIds: string[]): OpResult;
        setRelation(parentObject: object, columnName: string, child: OpResult): OpResult;
        setRelation(parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        setRelation(parentObject: object, columnName: string, child: object): OpResult;
        setRelation(parentObject: object, columnName: string, children: object[]): OpResult;
        setRelation(parentObject: object, columnName: string, children: OpResult[]): OpResult;
        setRelation(parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        setRelation(tableName: string, parentObject: object, columnName: string, whereClause: string): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, objectIds: string[]): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, child: OpResult): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, child: object): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, children: object[]): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, children: OpResult[]): OpResult;
        setRelation(tableName: string, parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        setRelation(tableName: string, parentObjectId: string, columnName: string, whereClause: string): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, objectIds: string[]): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResult): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResultValueReference): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, child: object): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, children: object[]): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResult[]): OpResult;
        setRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResultValueReference[]): OpResult;

        deleteRelation(parentObject: OpResult, columnName: string, whereClause: string): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, objectIds: string[]): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, child: OpResult): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, child: OpResultValueReference): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, child: object): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, children: object[]): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, children: OpResult[]): OpResult;
        deleteRelation(parentObject: OpResult, columnName: string, children: OpResultValueReference[]): OpResult;

        deleteRelation(parentObject: OpResultValueReference, columnName: string, whereClause: string): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, objectIds: string[]): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, child: OpResult): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, child: OpResultValueReference): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, child: object): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, children: object[]): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, children: OpResult[]): OpResult;
        deleteRelation(parentObject: OpResultValueReference, columnName: string, children: OpResultValueReference[]): OpResult;

        deleteRelation(parentObject: object, columnName: string, whereClause: string): OpResult;
        deleteRelation(parentObject: object, columnName: string, objectIds: string[]): OpResult;
        deleteRelation(parentObject: object, columnName: string, child: OpResult): OpResult;
        deleteRelation(parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        deleteRelation(parentObject: object, columnName: string, child: object): OpResult;
        deleteRelation(parentObject: object, columnName: string, children: object[]): OpResult;
        deleteRelation(parentObject: object, columnName: string, children: OpResult[]): OpResult;
        deleteRelation(parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        deleteRelation(tableName: string, parentObject: object, columnName: string, whereClause: string): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, objectIds: string[]): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, child: OpResult): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, child: OpResultValueReference): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, child: object): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, children: object[]): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, children: OpResult[]): OpResult;
        deleteRelation(tableName: string, parentObject: object, columnName: string, children: OpResultValueReference[]): OpResult;

        deleteRelation(tableName: string, parentObjectId: string, columnName: string, whereClause: string): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, objectIds: string[]): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResult): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, child: OpResultValueReference): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, child: object): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, children: object[]): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResult[]): OpResult;
        deleteRelation(tableName: string, parentObjectId: string, columnName: string, children: OpResultValueReference[]): OpResult;

        execute(): Promise<UnitOfWorkResult>
    }

    class Expression {
        constructor(value: string);
    }
}

declare module 'backendless' {
    export default Backendless;
}

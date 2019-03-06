import Request from 'backendless-request'

import LocalVars from './local-vars'

const root = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)

const previousBackendless = root && root.Backendless

const Backendless = {

  get debugMode() {
    return LocalVars.debugMode
  },

  set debugMode(debugMode) {
    LocalVars.debugMode = !!debugMode

    require('./rt').setRTDebugMode(LocalVars.debugMode)
  },

  get serverURL() {
    return LocalVars.serverURL
  },

  set serverURL(serverURL) {
    LocalVars.serverURL = serverURL
  },

  get XMLHttpRequest() {
    return LocalVars.XMLHttpRequest
  },

  set XMLHttpRequest(XMLHttpRequest) {
    LocalVars.XMLHttpRequest = XMLHttpRequest
  },

  get applicationId() {
    return LocalVars.applicationId
  },

  set applicationId(appId) {
    throw new Error(
      `Setting '${appId}' value to Backendless.applicationId directly is not possible, ` +
      `instead you must use Backendless.initApp('${appId}', API_KEY)`
    )
  },

  get secretKey() {
    return LocalVars.secretKey
  },

  set secretKey(apiKey) {
    throw new Error(
      `Setting '${apiKey}' value to Backendless.secretKey directly is not possible, ` +
      `instead you must use Backendless.initApp(APP_ID, '${apiKey}')`
    )
  },

  get appPath() {
    return LocalVars.appPath
  },

  set appPath(appPath) {
    throw new Error(
      `Setting '${appPath}' value to Backendless.appPath directly is not possible, ` +
      'instead you must use Backendless.initApp(APP_ID, API_KEY) for setup the value'
    )
  },

  get ServerCode() {
    return LocalVars.ServerCode
  },

  set ServerCode(ServerCode) {
    LocalVars.ServerCode = ServerCode
  },

  initApp(...args) {
    require('./init-app').initApp(...args)
  },

  getCurrentUserToken() {
    return require('./users/current-user').getCurrentUserToken()
  },

  setupDevice(...args) {
    const { default: Device } = require('./device')

    Device.setup(...args)
  },

  get browser() {
    return require('./user-agent').getUserAgent()
  },

  Request,

  noConflict() {
    if (root) {
      root.Backendless = previousBackendless
    }

    return Backendless
  },

  ///-------------------------------------///
  ///-------------- SERVICES -------------///

  get Logging() {
    return require('./logging').default
  },

  get Counters() {
    return require('./counters').default
  },

  get Cache() {
    return require('./cache').default
  },

  get Commerce() {
    return require('./commerce').default
  },

  get Users() {
    return require('./users').default
  },

  get User() {
    return require('./users/user').default
  },

  get BL() {
    return require('./bl').default
  },

  get CustomServices() {
    return Backendless.BL.CustomServices
  },

  get Events() {
    return Backendless.BL.Events
  },

  get Geo() {
    return require('./geo').default
  },

  get Data() {
    return require('./data').default
  },

  get Messaging() {
    return require('./messaging').default
  },

  get Files() {
    return require('./files').default
  },

  get RT() {
    return require('./rt').default
  },

  get SharedObject() {
    return require('./rso').default
  },

  ///-------------- SERVICES -------------///
  ///-------------------------------------///

  ///-------------------------------------///
  ///--------BACKWARD COMPATIBILITY-------///

  //TODO: do we need to remove it?

  get UserService() {
    return Backendless.Users
  },

  get GeoQuery() {
    return Backendless.Geo.Query
  },

  get GeoPoint() {
    return Backendless.Geo.Point
  },

  get GeoCluster() {
    return Backendless.Geo.Cluster
  },

  get Persistence() {
    return Backendless.Data
  },

  get DataQueryBuilder() {
    return Backendless.Data.QueryBuilder
  },

  get LoadRelationsQueryBuilder() {
    return Backendless.Data.LoadRelationsQueryBuilder
  },

  get Bodyparts() {
    return Backendless.Messaging.Bodyparts
  },

  get PublishOptions() {
    return Backendless.Messaging.PublishOptions
  },

  get DeliveryOptions() {
    return Backendless.Messaging.DeliveryOptions
  },

  get PublishOptionsHeaders() {
    return Backendless.Messaging.PublishOptionsHeaders
  },

  get LocalCache() {
    return require('./local-cache').default
  },

  /** @deprecated */
  get SubscriptionOptions() {
    return Backendless.Messaging.SubscriptionOptions
  },

  ///--------BACKWARD COMPATIBILITY-------///
  ///-------------------------------------///
}

if (root) {
  root.Backendless = Backendless
}

export default Backendless

module.exports = Backendless
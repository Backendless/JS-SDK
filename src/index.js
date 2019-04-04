import Request from 'backendless-request'

import APIRequest from './request'
import Utils from './utils'
import Urls from './urls';

const DEFAULT_PROPS = {
  appId         : null,
  apiKey        : null,
  serverURL     : 'https://api.backendless.com',
  debugMode     : true,
  ServerCode    : null,
  XMLHttpRequest: typeof XMLHttpRequest !== 'undefined'
    ? XMLHttpRequest
    : undefined,
}

const root = (
  (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)
)

const previousBackendless = root && root.Backendless

// Backendless supports two signatures for the initApp method
// two args - applicationId {String} and secretKey {String}
// or one argument - whole set of options {Object}
const parseArgs = (...args) => {
  const [appId, apiKey] = args

  if (Utils.isObject(appId)) {
    return appId
  }

  return {
    appId,
    apiKey
  }
}

class Backendless {
  constructor(props) {
    this.initProps(props)

    this.Request = Request

    this.request = new APIRequest(this)
    this.urls = Urls(this)
  }

  /**
   * @param {Object} props
   */
  initProps(props) {
    for (const key in DEFAULT_PROPS) {
      if (DEFAULT_PROPS.hasOwnProperty(key) && props.hasOwnProperty(key)) {
        const privateKey = `__${key}`

        this[privateKey] = props[key]
      }
    }
  }

  /**
   * @param {string|Object} applicationId|options
   * @param {string} [secretKey]
   * @returns {Backendless}
   */
  initApp(...args) {
    const { standalone, ...restProps } = parseArgs(...args)

    const app = standalone
      ? new Backendless(this)
      : this

    app.initProps(restProps)

    app.resetRT()
    app.Logging.reset()
    app.Geo.resetGeofenceMonitoring()
    app.Users.setLocalCurrentUser()

    // const { default: LoggingCollector } = require('./logging/collector')
    // const { default: GeoTracker } = require('./geo/tracker-monitor/tracker')
    // const { initRTClient } = require('./rt')
    // const { setLocalCurrentUser } = require('./users/current-user')

    return app
  }

  __getService(name, path) {
    const privateName = `__${name}`

    if (!this[privateName]) {
      const Service = require(path).default

      this[privateName] = new Service(this)
    }

    return this[privateName]
  }

  ///--------SETTERS/GETTERS-------///

  ///--------applicationId-------///
  get applicationId() {
    return this.__appId
  }

  set applicationId(appId) {
    throw new Error(
      `Setting '${appId}' value to Backendless.applicationId directly is not possible, ` +
      `instead you must use Backendless.initApp('${appId}', API_KEY)`
    )
  }

  ///--------secretKey-------///
  get secretKey() {
    return this.__apiKey
  }

  set secretKey(apiKey) {
    throw new Error(
      `Setting '${apiKey}' value to Backendless.secretKey directly is not possible, ` +
      `instead you must use Backendless.initApp(APP_ID, '${apiKey}')`
    )
  }

  ///--------serverURL-------///
  get serverURL() {
    return this.__serverURL
  }

  set serverURL(serverURL) {
    this.__serverURL = serverURL
  }

  ///--------appPath-------///
  get appPath() {
    return [this.serverURL, this.applicationId, this.secretKey].join('/')
  }

  set appPath(appPath) {
    throw new Error(
      `Setting '${appPath}' value to Backendless.appPath directly is not possible, ` +
      'instead you must use Backendless.initApp(APP_ID, API_KEY) for setup the value'
    )
  }

  ///--------debugMode-------///
  get debugMode() {
    return this.__debugMode
  }

  set debugMode(debugMode) {
    debugMode = !!debugMode

    if (this.__debugMode !== debugMode) {
      this.__debugMode = debugMode
      this.RT.setDebugMode(debugMode)
    }
  }

  ///--------XMLHttpRequestMode-------///
  get XMLHttpRequest() {
    return this.__XMLHttpRequest
  }

  set XMLHttpRequest(XMLHttpRequest) {
    this.__XMLHttpRequest = XMLHttpRequest
  }

  ///--------ServerCode-------///
  get ServerCode() {
    return this.__ServerCode
  }

  set ServerCode(ServerCode) {
    this.__ServerCode = ServerCode
  }

  ///----------UTIL METHODS--------///

  getCurrentUserToken() {
    return require('./users/current-user').getCurrentUserToken()
  }

  setupDevice(...args) {
    const { default: Device } = require('./device')

    Device.setup(...args)
  }

  get browser() {
    return require('./user-agent').getUserAgent()
  }

  noConflict() {
    if (root) {
      root.Backendless = previousBackendless
    }

    return this
  }

  ///-------------------------------------///
  ///-------------- SERVICES -------------///

  get Logging() {
    return this.__getService('Logging', './logging')
  }

  get Counters() {
    return this.__getService('Counters', './counters')
  }

  get Cache() {
    return this.__getService('Cache', './cache')
  }

  get Commerce() {
    return this.__getService('Commerce', './commerce')
  }

  get Users() {
    return this.__getService('Users', './users')
  }

  get User() {
    return require('./users/user').default
  }

  get CustomServices() {
    return this.__getService('CustomServices', './bl/custom-services')
  }

  get Events() {
    return this.__getService('Events', './bl/events')
  }

  get Geo() {
    return this.__getService('Geo', './geo')
  }

  get Data() {
    return this.__getService('Data', './data')
  }

  get Messaging() {
    return this.__getService('Messaging', './messaging')
  }

  get Files() {
    return this.__getService('Files', './files')
  }

  get RT() {
    return this.__getService('RT', './rt')
  }

  resetRT() {
    if (this.__RT) {
      this.__RT.terminate()
      delete this.__RT
    }
  }

  get SharedObject() {
    return require('./rso').default //TODO back compatibility problems
  }

  ///-------------- SERVICES -------------///
  ///-------------------------------------///

  ///-------------------------------------///
  ///--------BACKWARD COMPATIBILITY-------///

  //TODO: do we need to remove it?

  get UserService() {
    return this.Users
  }

  get GeoQuery() {
    return this.Geo.Query
  }

  get GeoPoint() {
    return this.Geo.Point
  }

  get GeoCluster() {
    return this.Geo.Cluster
  }

  get Persistence() {
    return this.Data
  }

  get DataQueryBuilder() {
    return this.Data.QueryBuilder
  }

  get LoadRelationsQueryBuilder() {
    return this.Data.LoadRelationsQueryBuilder
  }

  get Bodyparts() {
    return this.Messaging.Bodyparts
  }

  get PublishOptions() {
    return this.Messaging.PublishOptions
  }

  get DeliveryOptions() {
    return this.Messaging.DeliveryOptions
  }

  get PublishOptionsHeaders() {
    return this.Messaging.PublishOptionsHeaders
  }

  get LocalCache() {
    return require('./local-cache').default
  }

  /** @deprecated */
  get SubscriptionOptions() {
    return this.Messaging.SubscriptionOptions
  }

  ///--------BACKWARD COMPATIBILITY-------///
  ///-------------------------------------///
}

const backendless = new Backendless(DEFAULT_PROPS)

if (root) {
  root.Backendless = backendless
}

export default backendless

module.exports = backendless
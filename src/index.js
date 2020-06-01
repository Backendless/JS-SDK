import Request from 'backendless-request'

import APIRequest from './request'
import Urls from './urls'
import Utils from './utils'

const DEFAULT_PROPS = {
  appId         : null,
  apiKey        : null,
  serverURL     : 'https://api.backendless.com',
  debugMode     : false,
  standalone    : false,
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
const parseInitConfig = (...args) => {
  const [appId, apiKey] = args

  if (appId && typeof appId === 'object') {
    return appId
  }

  return {
    appId,
    apiKey
  }
}

const SERVICES = {
  'Logging'     : () => require('./logging').default,
  'Counters'    : () => require('./counters').default,
  'Cache'       : () => require('./cache').default,
  'Commerce'    : () => require('./commerce').default,
  'Users'       : () => require('./users').default,
  'BL'          : () => require('./bl').default,
  'Geo'         : () => require('./geo').default,
  'Data'        : () => require('./data').default,
  'Messaging'   : () => require('./messaging').default,
  'Files'       : () => require('./files').default,
  'RT'          : () => require('./rt').default,
  'SharedObject': () => require('./rso').default,
  'LocalCache'  : () => require('./local-cache').default,
}

class Backendless {
  constructor(props) {
    this.initConfig(props)

    this.Request = Request

    this.request = new APIRequest(this)
    this.urls = new Urls(this)
  }

  /**
   * @param {Object} config
   */
  initConfig(config) {
    for (const key in DEFAULT_PROPS) {
      if (DEFAULT_PROPS.hasOwnProperty(key)) {
        const privateKey = `__${key}`

        const defaultValue = this[privateKey] === undefined
          ? DEFAULT_PROPS[key]
          : this[privateKey]

        this[privateKey] = config[key] === undefined
          ? defaultValue
          : config[key]
      }
    }
  }

  /**
   * @param {string|Object} appId|config
   * @param {string} [secretKey]
   * @returns {Backendless}
   */
  initApp() {
    const config = parseInitConfig(...arguments)

    const app = config.standalone
      ? new Backendless(this)
      : this

    app.initConfig(config)

    app.resetRT()

    app.__removeService('LocalCache')

    if (app.__hasService('Logging')) {
      app.Logging.reset()
    }

    if (app.__hasService('Geo')) {
      app.Geo.resetGeofenceMonitoring()
    }

    if (app.__hasService('Users')) {
      app.Users.currentUser = null
    }

    delete this.__device

    return app
  }

  __hasService(name) {
    return !!this[`__${name}`]
  }

  __removeService(name) {
    delete this[`__${name}`]
  }

  __getService(name) {
    const privateName = `__${name}`

    if (!this[privateName]) {
      const Service = SERVICES[name]()

      this[privateName] = new Service(this)
    }

    return this[privateName]
  }

  ///--------SETTERS/GETTERS-------///

  ///--------standalone-------///
  get standalone() {
    return this.__standalone
  }

  set standalone(standalone) {
    throw new Error(
      'Setting value to Backendless.standalone directly is not possible, ' +
      `instead you must use Backendless.initApp({ appId: [APP_ID], apiKey: [API_KEY], standalone: ${standalone} })`
    )
  }

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

      if (this.__RT) {
        this.RT.setDebugMode(debugMode)
      }
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

  ///--------device-------///
  get device() {
    if (!this.__device) {
      throw new Error('Device is not defined. Please, run the Backendless.setupDevice')
    }

    return this.__device
  }

  set device(props) {
    throw new Error(
      'Setting value to Backendless.device directly is not possible, ' +
      'instead you must use Backendless.setupDevice(deviceProperties) for setup the device'
    )
  }

  setupDevice(device) {
    const Device = require('./device').default

    this.__device = new Device(device)
  }

  ///----------UTIL METHODS--------///

  get Utils() {
    return Utils
  }

  getCurrentUserToken() {
    return this.Users.getCurrentUserToken()
  }

  setCurrentUserToken(userToken) {
    this.Users.setCurrentUserToken(userToken)
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
    return this.__getService('Logging')
  }

  get Counters() {
    return this.__getService('Counters')
  }

  get Cache() {
    return this.__getService('Cache')
  }

  get Commerce() {
    return this.__getService('Commerce')
  }

  get Users() {
    return this.__getService('Users')
  }

  get User() {
    return require('./users/user').default
  }

  get UserService() {
    return this.Users
  }

  get BL() {
    return this.__getService('BL')
  }

  get CustomServices() {
    return this.BL.CustomServices
  }

  get Events() {
    return this.BL.Events
  }

  get Geo() {
    return this.__getService('Geo')
  }

  get Data() {
    return this.__getService('Data')
  }

  get Messaging() {
    return this.__getService('Messaging')
  }

  get Files() {
    return this.__getService('Files')
  }

  get RT() {
    return this.__getService('RT')
  }

  resetRT() {
    if (this.__RT) {
      this.__RT.terminate()
      delete this.__RT
    }
  }

  get SharedObject() {
    return this.__getService('SharedObject')
  }

  get LocalCache() {
    return this.__getService('LocalCache')
  }

  ///-------------- SERVICES -------------///
  ///-------------------------------------///

  ///-------------------------------------///
  ///--------BACKWARD COMPATIBILITY-------///

  //TODO: do we need to remove it?

  get GeoQuery() {
    return this.Geo.Query
  }

  get GeoPoint() {
    return this.Geo.Point
  }

  get GeoCluster() {
    return this.Geo.Cluster
  }

  /** @deprecated */
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

  get EmailEnvelope() {
    return this.Messaging.EmailEnvelope
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

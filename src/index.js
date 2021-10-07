import Request from 'backendless-request'

import APIRequest from './request'
import Urls from './urls'
import Utils from './utils'

const DEFAULT_PROPS = {
  appId         : null,
  apiKey        : null,
  serverURL     : 'https://api.backendless.com',
  domain        : null,
  apiURI        : '/api',
  debugMode     : false,
  standalone    : false,
  XMLHttpRequest: typeof XMLHttpRequest !== 'undefined'
    ? XMLHttpRequest
    : undefined,
}

const STATELESS_PROPS = ['appId', 'apiKey', 'domain']

const root = (
  (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)
)

const previousBackendless = root && root.Backendless

const showLegacyDataWarning = () => {
  if (!showLegacyDataWarning.isShown) {
    // eslint-disable-next-line no-console
    console.warn('Backendless.Persistence is deprecated namespace, use Backendless.Data instead')

    showLegacyDataWarning.isShown = true
  }
}

// Backendless supports three signatures for the initApp method
// two args - applicationId {String} and secretKey {String}
// one argument - domain {String}
// one argument - whole set of options {Object}
const parseInitConfig = (...args) => {
  const [appId, apiKey] = args

  if (appId && typeof appId === 'object') {
    return appId
  }

  if (typeof appId === 'string' && !apiKey) {
    return { domain: appId }
  }

  return {
    appId,
    apiKey
  }
}

const validateConfig = config => {
  if (config.domain) {
    if (!config.domain.startsWith('https://') && !config.domain.startsWith('http://')) {
      throw new Error(
        'When initialize the SDK with a custom domain it should start with http:// or https://, ' +
        'for example: Backendless.initApp(\'https://foobar.com\')'
      )
    }
  }
}

const SERVICES = {
  'Logging'     : () => require('./logging').default,
  'Counters'    : () => require('./counters').default,
  'Cache'       : () => require('./cache').default,
  'Commerce'    : () => require('./commerce').default,
  'Users'       : () => require('./users').default,
  'BL'          : () => require('./bl').default,
  'Data'        : () => require('./data').default,
  'Messaging'   : () => require('./messaging').default,
  'Files'       : () => require('./files').default,
  'RT'          : () => require('./rt').default,
  'SharedObject': () => require('./rso').default,
  'LocalCache'  : () => require('./local-cache').default,
  'UnitOfWork'  : () => require('./unit-of-work').default,
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
    config = { ...config }

    if (config.domain) {
      delete config.appId
      delete config.apiKey
    }

    for (const key in DEFAULT_PROPS) {
      if (DEFAULT_PROPS.hasOwnProperty(key)) {
        const privateKey = `__${key}`

        if (STATELESS_PROPS.includes(key)) {
          delete this[privateKey]
        }

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
   * @param {string|Object} appId|domain|config
   * @param {string} [apiKey]
   * @returns {Backendless}
   */
  initApp() {
    const config = parseInitConfig(...arguments)

    validateConfig(config)

    const app = config.standalone
      ? new Backendless(this)
      : this

    app.initConfig(config)

    app.resetRT()

    app.__removeService('LocalCache')

    if (app.__hasService('Logging')) {
      app.Logging.reset()
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

  get appId() {
    return this.__appId
  }

  set appId(appId) {
    throw new Error(
      `Setting '${appId}' value to Backendless.appId directly is not possible, ` +
      `instead you must use Backendless.initApp('${appId}', API_KEY)`
    )
  }

  get apiKey() {
    return this.__apiKey
  }

  set apiKey(apiKey) {
    throw new Error(
      `Setting '${apiKey}' value to Backendless.apiKey directly is not possible, ` +
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

  ///--------domain-------///
  get domain() {
    return this.__domain
  }

  set domain(domain) {
    this.__domain = domain
  }

  ///--------apiURI-------///
  get apiURI() {
    return this.__apiURI
  }

  set apiURI(apiURI) {
    this.__apiURI = apiURI
  }

  ///--------appPath-------///
  get appPath() {
    if (this.domain) {
      return this.domain + this.apiURI
    }

    return [this.serverURL, this.appId, this.apiKey].join('/')
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

  get APIServices() {
    return this.BL.CustomServices
  }

  get Events() {
    return this.BL.Events
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

  get UnitOfWork() {
    return this.__getService('UnitOfWork')
  }

  ///-------------- SERVICES -------------///
  ///-------------------------------------///

  ///-------------------------------------///
  ///--------BACKWARD COMPATIBILITY-------///

  /** @deprecated */
  get applicationId() {
    // eslint-disable-next-line no-console
    // temporary comment it because it breaks JS-CodeRunner version less than 6.3.0
    // console.warn('getter/setter for Backendless.applicationId is deprecated, instead use Backendless.appId')

    return this.appId
  }

  /** @deprecated */
  set applicationId(appId) {
    // eslint-disable-next-line no-console
    console.warn('getter/setter for Backendless.applicationId is deprecated, instead use Backendless.appId')

    this.appId = appId
  }

  /** @deprecated */
  get secretKey() {
    // eslint-disable-next-line no-console
    console.warn('getter/setter for Backendless.secretKey is deprecated, instead use Backendless.apiKey')

    return this.apiKey
  }

  /** @deprecated */
  set secretKey(apiKey) {
    // eslint-disable-next-line no-console
    console.warn('getter/setter for Backendless.secretKey is deprecated, instead use Backendless.apiKey')

    this.apiKey = apiKey
  }

  /** @deprecated */
  get Persistence() {
    showLegacyDataWarning()

    return this.Data
  }

  get DataQueryBuilder() {
    return this.Data.QueryBuilder
  }

  get GroupQueryBuilder() {
    return this.Data.GroupQueryBuilder
  }

  get JSONUpdateBuilder() {
    return this.Data.JSONUpdateBuilder
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

  ///--------BACKWARD COMPATIBILITY-------///
  ///-------------------------------------///
}

const backendless = new Backendless(DEFAULT_PROPS)

if (root) {
  root.Backendless = backendless
}

exports = module.exports = backendless

export default backendless


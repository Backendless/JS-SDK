import Request from 'backendless-request'

import Logging from './logging'
import Counters from './counters'
import Cache from './cache'
import Commerce from './commerce'
import Users from './users'
import User from './users/user'
import CustomServices from './bl/custom-services'
import Events from './bl/events'
import Geo from './geo'
import Data from './data'
import Messaging from './messaging'
import Device from './device'
import Files from './files'
import RTClient from './rt'
import SharedObject from './rso'
import LocalCache from './local-cache'
import LocalVars from './local-vars'

import { initApp } from './init-app'
import { getUserAgent } from './user-agent'
import { getCurrentUserToken } from './users/current-user'

const root = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global)

const previousBackendless = root && root.Backendless

const Backendless = {

  get debugMode() {
    return LocalVars.debugMode
  },

  set debugMode(debugMode) {
    LocalVars.debugMode = !!debugMode
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

  get secretKey() {
    return LocalVars.secretKey
  },

  get appPath() {
    return LocalVars.appPath
  },

  initApp,

  getCurrentUserToken,

  setupDevice: Device.setup,

  browser: getUserAgent(),

  Request,

  noConflict() {
    if (root) {
      root.Backendless = previousBackendless
    }

    return Backendless
  },

  ///-------------------------------------///
  ///-------------- SERVICES -------------///

  Logging       : Logging,
  Counters      : Counters,
  Cache         : Cache,
  Commerce      : Commerce,
  Users         : Users,
  User          : User,
  CustomServices: CustomServices,
  Events        : Events,
  Geo           : Geo,
  Data          : Data,
  Messaging     : Messaging,
  Files         : Files,
  RTClient      : RTClient,
  SharedObject  : SharedObject,
  ///-------------- SERVICES -------------///
  ///-------------------------------------///

  ///-------------------------------------///
  ///--------BACKWARD COMPATIBILITY-------///

  //TODO: do we need to remove it?
  UserService              : Users,
  GeoQuery                 : Geo.Query,
  GeoPoint                 : Geo.Point,
  GeoCluster               : Geo.Cluster,
  Persistence              : Data,
  DataQueryBuilder         : Data.QueryBuilder,
  LoadRelationsQueryBuilder: Data.LoadRelationsQueryBuilder,
  Bodyparts                : Messaging.Bodyparts,
  PublishOptions           : Messaging.PublishOptions,
  DeliveryOptions          : Messaging.DeliveryOptions,
  SubscriptionOptions      : Messaging.SubscriptionOptions,
  PublishOptionsHeaders    : Messaging.PublishOptionsHeaders,

  LocalCache,
  ///--------BACKWARD COMPATIBILITY-------///
  ///-------------------------------------///
}

if (root) {
  root.Backendless = Backendless
}

export default Backendless

module.exports = Backendless
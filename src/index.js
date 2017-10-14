import Request from 'backendless-request'

import Backendless from './bundle'

import Logging from './logging'
import Counters from './counters/counters'
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
import LocalCache from './local-cache'

import { initApp } from './init-app'
import { getUserAgent } from './user-agent'
import { getCurrentUserToken } from './users/current-user'
import { noConflict } from './no-conflct'

Backendless.debugMode = true

Backendless.serverURL = 'https://api.backendless.com'

Backendless.XMLHttpRequest = typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined

Backendless.setupDevice = Device.setup

Backendless.Request = Request

Backendless.LocalCache = LocalCache

Backendless.initApp = initApp

Backendless.browser = getUserAgent()

Backendless.getCurrentUserToken = getCurrentUserToken

Backendless.noConflict = noConflict

///-------------------------------------///
///-------------- SERVICES -------------///

Backendless.Logging = Logging
Backendless.Counters = Counters
Backendless.Cache = Cache
Backendless.Commerce = Commerce
Backendless.Users = Users
Backendless.User = User
Backendless.CustomServices = CustomServices
Backendless.Events = Events
Backendless.Geo = Geo
Backendless.Data = Data
Backendless.Messaging = Messaging
Backendless.Files = Files

///-------------- SERVICES -------------///
///-------------------------------------///


///-------------------------------------///
///--------BACKWARD COMPATIBILITY-------///
//TODO: do we need to remove it?
Backendless.UserService = Users
Backendless.GeoQuery = Geo.Query
Backendless.GeoPoint = Geo.Point
Backendless.GeoCluster = Geo.Cluster
Backendless.Persistence = Data
Backendless.DataQueryBuilder = Data.QueryBuilder
Backendless.LoadRelationsQueryBuilder = Data.LoadRelationsQueryBuilder
Backendless.Bodyparts = Messaging.Bodyparts
Backendless.PublishOptions = Messaging.PublishOptions
Backendless.DeliveryOptions = Messaging.DeliveryOptions
Backendless.SubscriptionOptions = Messaging.SubscriptionOptions
Backendless.PublishOptionsHeaders = Messaging.PublishOptionsHeaders
///--------BACKWARD COMPATIBILITY-------///
///-------------------------------------///

export default Backendless

module.exports = Backendless
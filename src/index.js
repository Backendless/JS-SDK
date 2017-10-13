import Request from 'backendless-request'

import Backendless from './bundle'

import Logging from './logging'
import Counters from './counters/counters'
import Cache from './cache'
import Commerce from './commerce'
import UserService from './users'
import User from './users/user'
import CustomServices from './bl/custom-services'
import Events from './bl/events'
import Geo from './geo'
import Data from './data'
import Messaging from './messaging'
import Device from './device'
import Files from './files'

import { initApp } from './init-app'

Backendless.debugMode = true

Backendless.serverURL = 'https://api.backendless.com'

Backendless.XMLHttpRequest = typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined

Backendless.setupDevice = Device.setup

Backendless.Request = Request

Backendless.initApp = initApp

///-------------------------------------///
///-------------- SERVICES -------------///

Backendless.Logging = Logging

Backendless.Counters = Counters

Backendless.Cache = Cache

Backendless.Commerce = Commerce

Backendless.UserService = UserService
Backendless.Users = UserService
Backendless.User = User

Backendless.CustomServices = CustomServices
Backendless.Events = Events

Backendless.Geo = Geo
Backendless.GeoQuery = Geo.Query
Backendless.GeoPoint = Geo.Point
Backendless.GeoCluster = Geo.Cluster

Backendless.Data = Data
Backendless.Persistence = Data
Backendless.DataQueryBuilder = Data.QueryBuilder
Backendless.LoadRelationsQueryBuilder = Data.LoadRelationsQueryBuilder

Backendless.Messaging = Messaging
Backendless.Bodyparts = Messaging.Bodyparts
Backendless.PublishOptions = Messaging.PublishOptions
Backendless.DeliveryOptions = Messaging.DeliveryOptions
Backendless.SubscriptionOptions = Messaging.SubscriptionOptions
Backendless.PublishOptionsHeaders = Messaging.PublishOptionsHeaders

Backendless.Files = Files

///-------------- SERVICES -------------///
///-------------------------------------///

export default Backendless

module.exports = Backendless
import Backendless from './bundle'

import Logging from './logging'
import LoggingCollector from './logging/collector'
import Counters from './counters/counters'
import Cache from './cache'
import Commerce from './commerce'
import UserService from './user'
import User from './user/user'
import CustomServices from './bl/custom-services'
import Events from './bl/events'
import Geo from './geo'
import GeoTrackerMonitor from './geo/tracker-monitor'
import Data from './data'
import Messaging from './messaging'
import Device from './device'
import Files from './files'

import './request/request'
import Private from './private'


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


Backendless.setupDevice = Device.setup

Backendless.initApp = (appId, secretKey) => {

  LoggingCollector.reset()
  GeoTrackerMonitor.reset()

  //TODO: remove it
  Data.reset()
  Private.setCurrentUser()

  Backendless.applicationId = appId
  Backendless.secretKey = secretKey
  Backendless.appPath = [Backendless.serverURL, appId, secretKey].join('/')
}

export default Backendless

module.exports = Backendless
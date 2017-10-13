import Backendless from './bundle'
// import DataPermissions from './data/data-permissions'
import UserService from './user/user-service'
import Geo from './geo'
import GeoTrackerMonitor from './geo/tracker-monitor'
import Files from './file/files'
import Commerce from './commerce'
import Cache from './cache'
import Counters from './counters/counters'
import Data from './data'
import Messaging from './messaging'
import FilePermissions from './file/file-persmission'
import User from './user/user'
import Logging from './logging'
import LoggingCollector from './logging/collector'
import './request/request'
import Device from './device'
import Private from './private'

import CustomServices from './bl/custom-services'
import Events from './bl/events'

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

  // Backendless.Data.Permissions = new DataPermissions()
  Backendless.Files = new Files()
  Backendless.Files.Permissions = new FilePermissions()
}

export default Backendless

module.exports = Backendless
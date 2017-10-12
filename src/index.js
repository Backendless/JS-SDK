import Backendless from './bundle'
import DataQueryBuilder from './data/data-query-builder'
import LoadRelationsQueryBuilder from './data/load-relations-query-builder'
import PublishOptionsHeaders from './messaging/publish-options-header'
import PublishOptions from './messaging/publish-options'
import DeliveryOptions from './messaging/delivery-options'
import Bodyparts from './messaging/body-parts'
import SubscriptionOptions from './messaging/subscriptions-options'
import DataPermissions from './data/data-permissions'
import UserService from './user/user-service'
import Geo from './geo'
import GeoTrackerMonitor from './geo/tracker-monitor'
import Files from './file/files'
import Commerce from './messaging/commerce'
import Cache from './cache'
import Counters from './counters/counters'
import persistence from './data/persistence'
import Messaging from './messaging/messaging'
import FilePermissions from './file/file-persmission'
import User from './user/user'
import './logging/logging'
import './request/request'
import Private from './private'

import CustomServices from './bl/custom-services'
import Events from './bl/events'


Backendless.Counters = Counters

Backendless.Cache = Cache

Backendless.UserService = UserService
Backendless.Users = UserService
Backendless.User = User

Backendless.CustomServices = CustomServices
Backendless.Events = Events

Backendless.Geo = Geo
Backendless.GeoQuery = Backendless.Geo.Query
Backendless.GeoPoint = Backendless.Geo.Point
Backendless.GeoCluster = Backendless.Geo.Cluster

Backendless.DataQueryBuilder = DataQueryBuilder
Backendless.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder

Backendless.Bodyparts = Bodyparts
Backendless.PublishOptions = PublishOptions
Backendless.DeliveryOptions = DeliveryOptions
Backendless.SubscriptionOptions = SubscriptionOptions
Backendless.PublishOptionsHeaders = PublishOptionsHeaders

Backendless.initApp = (appId, secretKey) => {
  Backendless.applicationId = appId
  Backendless.secretKey = secretKey
  Backendless.appPath = [Backendless.serverURL, appId, secretKey].join('/')

  Backendless.Persistence = persistence
  Backendless.Data = persistence
  Backendless.Data.Permissions = new DataPermissions()
  Backendless.Messaging = new Messaging()
  Backendless.Files = new Files()
  Backendless.Files.Permissions = new FilePermissions()
  Backendless.Commerce = new Commerce()

  GeoTrackerMonitor.reset()

  Private.resetDataStore()

  Private.setCurrentUser(null)
}


export default Backendless

module.exports = Backendless
import Backendless from './bundle'
import DataQueryBuilder from './data/data-query-builder'
import LoadRelationsQueryBuilder from './data/load-relations-query-builder'
import GeoQuery from './geo/geo-query'
import GeoPoint from './geo/geo-point'
import GeoCluster from './geo/geo-cluster'
import PublishOptionsHeaders from './messaging/publish-options-header'
import PublishOptions from './messaging/publish-options'
import DeliveryOptions from './messaging/delivery-options'
import Bodyparts from './messaging/body-parts'
import SubscriptionOptions from './messaging/subscriptions-options'
import DataPermissions from './data/data-permissions'
import UserService from './user/user-service'
import Geo from './geo/geo-service'
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


Backendless.initApp = (appId, secretKey) => {
  Backendless.applicationId = appId
  Backendless.secretKey = secretKey
  Backendless.appPath = [Backendless.serverURL, appId, secretKey].join('/')

  Backendless.UserService = new UserService()
  Backendless.Users = Backendless.UserService
  Backendless.Geo = new Geo()
  Backendless.Persistence = persistence
  Backendless.Data = persistence
  Backendless.Data.Permissions = new DataPermissions()
  Backendless.Messaging = new Messaging()
  Backendless.Files = new Files()
  Backendless.Files.Permissions = new FilePermissions()
  Backendless.Commerce = new Commerce()
  Backendless.Cache = new Cache()
  Backendless.Counters = new Counters()

  Backendless.CustomServices = CustomServices
  Backendless.Events = Events

  Private.resetDataStore()

  Private.setCurrentUser(null)
}

Backendless.User = User
Backendless.DataQueryBuilder = DataQueryBuilder
Backendless.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder
Backendless.GeoQuery = GeoQuery
Backendless.GeoPoint = GeoPoint
Backendless.GeoCluster = GeoCluster
Backendless.Bodyparts = Bodyparts
Backendless.PublishOptions = PublishOptions
Backendless.DeliveryOptions = DeliveryOptions
Backendless.SubscriptionOptions = SubscriptionOptions
Backendless.PublishOptionsHeaders = PublishOptionsHeaders

try {
  const root = this || {}

  /** @deprecated */
  root.GeoPoint = Backendless.GeoPoint

  /** @deprecated */
  root.GeoCluster = Backendless.GeoCluster

  /** @deprecated */
  root.BackendlessGeoQuery = Backendless.GeoQuery

  /** @deprecated */
  root.Bodyparts = Backendless.Bodyparts

  /** @deprecated */
  root.PublishOptions = Backendless.PublishOptions

  /** @deprecated */
  root.DeliveryOptions = Backendless.DeliveryOptions

  /** @deprecated */
  root.SubscriptionOptions = Backendless.SubscriptionOptions

  /** @deprecated */
  root.PublishOptionsHeaders = Backendless.PublishOptionsHeaders
} catch (error) {
  console && console.warn(error)
}

export default Backendless

module.exports = Backendless
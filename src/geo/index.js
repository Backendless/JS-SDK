import Utils from '../utils'
import { deprecated } from '../decorators'

import { EARTH_RADIUS, UNITS } from './constants'
import GeoUtils from './utils'
import GeoTrackerMonitor from './tracker-monitor'
import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'
import { savePoint } from './save-point'
import { addCategory } from './add-category'
import { deleteCategory } from './delete-category'
import { getCategories } from './get-categories'
import { deletePoint } from './delete-point'
import { getGeopointCount } from './get-points-count'
import { getClusterPoints } from './get-cluster-points'
import { loadPoints } from './load-points'
import { loadMetadata } from './load-metadata'
import { relativeFind } from './relative-find'
import { loadFencePoints } from './load-fence-points'

const Geo = {

  EARTH_RADIUS,
  UNITS,

  Utils: GeoUtils,

  Cluster: GeoCluster,
  Point  : GeoPoint,
  Query  : GeoQuery,

  /** @deprecated */
  addPoint: function(/** geopoint, async */) {
    return this.savePoint.apply(this, arguments)
  },

  @deprecated('Backendless.Geo', 'Backendless.Geo.savePoint')
  savePointSync: Utils.synchronized(savePoint),
  savePoint    : Utils.promisified(savePoint),

  @deprecated('Backendless.Geo', 'Backendless.Geo.find')
  findSync: Utils.synchronized(loadPoints),
  find    : Utils.promisified(loadPoints),

  @deprecated('Backendless.Geo', 'Backendless.Geo.loadMetadata')
  loadMetadataSync: Utils.synchronized(loadMetadata),
  loadMetadata    : Utils.promisified(loadMetadata),

  @deprecated('Backendless.Geo', 'Backendless.Geo.getClusterPoints')
  getClusterPointsSync: Utils.synchronized(getClusterPoints),
  getClusterPoints    : Utils.promisified(getClusterPoints),

  @deprecated('Backendless.Geo', 'Backendless.Geo.relativeFind')
  relativeFindSync: Utils.synchronized(relativeFind),
  relativeFind    : Utils.promisified(relativeFind),

  @deprecated('Backendless.Geo', 'Backendless.Geo.addCategory')
  addCategorySync: Utils.synchronized(addCategory),
  addCategory    : Utils.promisified(addCategory),

  @deprecated('Backendless.Geo', 'Backendless.Geo.getCategories')
  getCategoriesSync: Utils.synchronized(getCategories),
  getCategories    : Utils.promisified(getCategories),

  @deprecated('Backendless.Geo', 'Backendless.Geo.deleteCategory')
  deleteCategorySync: Utils.synchronized(deleteCategory),
  deleteCategory    : Utils.promisified(deleteCategory),

  @deprecated('Backendless.Geo', 'Backendless.Geo.deletePoint')
  deletePointSync: Utils.synchronized(deletePoint),
  deletePoint    : Utils.promisified(deletePoint),

  @deprecated('Backendless.Geo', 'Backendless.Geo.getFencePoints')
  getFencePointsSync: Utils.synchronized(loadFencePoints),
  getFencePoints    : Utils.promisified(loadFencePoints),

  @deprecated('Backendless.Geo', 'Backendless.Geo.getGeopointCount')
  getGeopointCountSync: Utils.synchronized(getGeopointCount),
  getGeopointCount    : Utils.promisified(getGeopointCount),

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnEnterAction')
  runOnEnterActionSync: GeoTrackerMonitor.runOnEnterActionSync,
  runOnEnterAction    : GeoTrackerMonitor.runOnEnterAction,

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnStayAction')
  runOnStayActionSync: GeoTrackerMonitor.runOnStayActionSync,
  runOnStayAction    : GeoTrackerMonitor.runOnStayAction,

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnExitAction')
  runOnExitActionSync: GeoTrackerMonitor.runOnExitActionSync,
  runOnExitAction    : GeoTrackerMonitor.runOnExitAction,

  @deprecated('Backendless.Geo', 'Backendless.Geo.startGeofenceMonitoringWithInAppCallback')
  startGeofenceMonitoringWithInAppCallbackSync: GeoTrackerMonitor.startGeofenceMonitoringWithInAppCallbackSync,
  startGeofenceMonitoringWithInAppCallback    : GeoTrackerMonitor.startGeofenceMonitoringWithInAppCallback,

  @deprecated('Backendless.Geo', 'Backendless.Geo.startGeofenceMonitoringWithRemoteCallback')
  startGeofenceMonitoringWithRemoteCallbackSync: GeoTrackerMonitor.startGeofenceMonitoringWithRemoteCallbackSync,
  startGeofenceMonitoringWithRemoteCallback    : GeoTrackerMonitor.startGeofenceMonitoringWithRemoteCallback,

  stopGeofenceMonitoring: GeoTrackerMonitor.stopGeofenceMonitoring
}

export default Geo

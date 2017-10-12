import Utils from '../utils'
import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'

import { EARTH_RADIUS, UNITS } from './constants'
import GeoUtils from './utils'
import GeoTrackerMonitor from './tracker-monitor'
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

  Utils         : GeoUtils,
  TrackerMonitor: GeoTrackerMonitor,

  Cluster: GeoCluster,
  Point  : GeoPoint,
  Query  : GeoQuery,

  /** @deprecated */
  addPoint: function(/** geopoint, async */) {
    return this.savePoint.apply(this, arguments)
  },

  savePoint    : Utils.promisified(savePoint),
  savePointSync: Utils.synchronized(savePoint),

  find    : Utils.promisified(loadPoints),
  findSync: Utils.synchronized(loadPoints),

  loadMetadata    : Utils.promisified(loadMetadata),
  loadMetadataSync: Utils.synchronized(loadMetadata),

  getClusterPoints    : Utils.promisified(getClusterPoints),
  getClusterPointsSync: Utils.synchronized(getClusterPoints),

  relativeFind    : Utils.promisified(relativeFind),
  relativeFindSync: Utils.synchronized(relativeFind),

  addCategory    : Utils.promisified(addCategory),
  addCategorySync: Utils.synchronized(addCategory),

  getCategories    : Utils.promisified(getCategories),
  getCategoriesSync: Utils.synchronized(getCategories),

  deleteCategory    : Utils.promisified(deleteCategory),
  deleteCategorySync: Utils.synchronized(deleteCategory),

  deletePoint    : Utils.promisified(deletePoint),
  deletePointSync: Utils.synchronized(deletePoint),

  getFencePoints    : Utils.promisified(loadFencePoints),
  getFencePointsSync: Utils.synchronized(loadFencePoints),

  getGeopointCount    : Utils.promisified(getGeopointCount),
  getGeopointCountSync: Utils.synchronized(getGeopointCount),

  runOnEnterAction    : GeoTrackerMonitor.runOnEnterAction,
  runOnEnterActionSync: GeoTrackerMonitor.runOnEnterActionSync,

  runOnStayAction    : GeoTrackerMonitor.runOnStayAction,
  runOnStayActionSync: GeoTrackerMonitor.runOnStayActionSync,

  runOnExitAction    : GeoTrackerMonitor.runOnExitAction,
  runOnExitActionSync: GeoTrackerMonitor.runOnExitActionSync,

  startGeofenceMonitoringWithInAppCallback    : GeoTrackerMonitor.startGeofenceMonitoringWithInAppCallback,
  startGeofenceMonitoringWithInAppCallbackSync: GeoTrackerMonitor.startGeofenceMonitoringWithInAppCallbackSync,

  startGeofenceMonitoringWithRemoteCallback    : GeoTrackerMonitor.startGeofenceMonitoringWithRemoteCallback,
  startGeofenceMonitoringWithRemoteCallbackSync: GeoTrackerMonitor.startGeofenceMonitoringWithRemoteCallbackSync,

  stopGeofenceMonitoring: GeoTrackerMonitor.stopGeofenceMonitoring
}

export default Geo

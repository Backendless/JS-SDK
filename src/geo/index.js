import Utils from '../utils'
import GeoUtils from './utils'

import { deprecated } from '../decorators'

import { EARTH_RADIUS, UNITS } from './constants'

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

const alternativeForDepreciation = (
  'Spatial Data Types [POINT,LINESTRING,POLYGON]. ' +
  'See more details here: https://backendless.com/docs/js/data_spatial_overview.html '
)

export default class Geo {
  constructor(app) {
    this.app = app
    this.trackerMonitor = new GeoTrackerMonitor(app)

    this.EARTH_RADIUS = EARTH_RADIUS
    this.UNITS = UNITS

    this.Utils = GeoUtils
    this.Cluster = GeoCluster
    this.Point = GeoPoint
    this.Query = GeoQuery
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  addPoint(/** geopoint, async */) {
    return this.savePoint.apply(this, arguments)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  savePointSync(...args) {
    return Utils.synchronized(savePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  savePoint(...args) {
    return Utils.promisified(savePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  findSync(...args) {
    return Utils.synchronized(loadPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  find(...args) {
    return Utils.promisified(loadPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  loadMetadataSync(...args) {
    return Utils.synchronized(loadMetadata).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  loadMetadata(...args) {
    return Utils.promisified(loadMetadata).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getClusterPointsSync(...args) {
    return Utils.synchronized(getClusterPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getClusterPoints(...args) {
    return Utils.promisified(getClusterPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  relativeFindSync(...args) {
    return Utils.synchronized(relativeFind).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  relativeFind(...args) {
    return Utils.promisified(relativeFind).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  addCategorySync(...args) {
    return Utils.synchronized(addCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  addCategory(...args) {
    return Utils.promisified(addCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getCategoriesSync(...args) {
    return Utils.synchronized(getCategories).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getCategories(...args) {
    return Utils.promisified(getCategories).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  deleteCategorySync(...args) {
    return Utils.synchronized(deleteCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  deleteCategory(...args) {
    return Utils.promisified(deleteCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  deletePointSync(...args) {
    return Utils.synchronized(deletePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  deletePoint(...args) {
    return Utils.promisified(deletePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getFencePointsSync(...args) {
    return Utils.synchronized(loadFencePoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getFencePoints(...args) {
    return Utils.promisified(loadFencePoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getGeopointCountSync(...args) {
    return Utils.synchronized(getGeopointCount).call(this, ...args)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  getGeopointCount(...args) {
    return Utils.promisified(getGeopointCount).call(this, ...args)
  }

  @deprecated('Backendless.Geo')
  runOnEnterActionSync(...args) {
    return this.trackerMonitor.runOnEnterActionSync(...args)
  }

  @deprecated('Backendless.Geo')
  runOnEnterAction(...args) {
    return this.trackerMonitor.runOnEnterAction(...args)
  }

  @deprecated('Backendless.Geo')
  runOnStayActionSync(...args) {
    return this.trackerMonitor.runOnStayActionSync(...args)
  }

  @deprecated('Backendless.Geo')
  runOnStayAction(...args) {
    return this.trackerMonitor.runOnStayAction(...args)
  }

  @deprecated('Backendless.Geo')
  runOnExitActionSync(...args) {
    return this.trackerMonitor.runOnExitActionSync(...args)
  }

  @deprecated('Backendless.Geo')
  runOnExitAction(...args) {
    return this.trackerMonitor.runOnExitAction(...args)
  }

  @deprecated('Backendless.Geo')
  startGeofenceMonitoringWithInAppCallbackSync(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithInAppCallbackSync(...args)
  }

  @deprecated('Backendless.Geo')
  startGeofenceMonitoringWithInAppCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithInAppCallback(...args)
  }

  @deprecated('Backendless.Geo')
  startGeofenceMonitoringWithRemoteCallbackSync(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithRemoteCallbackSync(...args)
  }

  @deprecated('Backendless.Geo')
  startGeofenceMonitoringWithRemoteCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithRemoteCallback(...args)
  }

  @deprecated('Backendless.Geo')
  stopGeofenceMonitoring(...args) {
    return this.trackerMonitor.stopGeofenceMonitoring(...args)
  }

  resetGeofenceMonitoring(...args) {
    return this.trackerMonitor.reset(...args)
  }
}

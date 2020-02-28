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

  /** @deprecated */
  addPoint(/** geopoint, async */) {
    return this.savePoint.apply(this, arguments)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.savePoint')
  savePointSync(...args) {
    return Utils.synchronized(savePoint).call(this, ...args)
  }

  savePoint(...args) {
    return Utils.promisified(savePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.find')
  findSync(...args) {
    return Utils.synchronized(loadPoints).call(this, ...args)
  }

  find(...args) {
    return Utils.promisified(loadPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.loadMetadata')
  loadMetadataSync(...args) {
    return Utils.synchronized(loadMetadata).call(this, ...args)
  }

  loadMetadata(...args) {
    return Utils.promisified(loadMetadata).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.getClusterPoints')
  getClusterPointsSync(...args) {
    return Utils.synchronized(getClusterPoints).call(this, ...args)
  }

  getClusterPoints(...args) {
    return Utils.promisified(getClusterPoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.relativeFind')
  relativeFindSync(...args) {
    return Utils.synchronized(relativeFind).call(this, ...args)
  }

  relativeFind(...args) {
    return Utils.promisified(relativeFind).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.addCategory')
  addCategorySync(...args) {
    return Utils.synchronized(addCategory).call(this, ...args)
  }

  addCategory(...args) {
    return Utils.promisified(addCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.getCategories')
  getCategoriesSync(...args) {
    return Utils.synchronized(getCategories).call(this, ...args)
  }

  getCategories(...args) {
    return Utils.promisified(getCategories).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.deleteCategory')
  deleteCategorySync(...args) {
    return Utils.synchronized(deleteCategory).call(this, ...args)
  }

  deleteCategory(...args) {
    return Utils.promisified(deleteCategory).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.deletePoint')
  deletePointSync(...args) {
    return Utils.synchronized(deletePoint).call(this, ...args)
  }

  deletePoint(...args) {
    return Utils.promisified(deletePoint).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.getFencePoints')
  getFencePointsSync(...args) {
    return Utils.synchronized(loadFencePoints).call(this, ...args)
  }

  getFencePoints(...args) {
    return Utils.promisified(loadFencePoints).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.getGeopointCount')
  getGeopointCountSync(...args) {
    return Utils.synchronized(getGeopointCount).call(this, ...args)
  }

  getGeopointCount(...args) {
    return Utils.promisified(getGeopointCount).call(this, ...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnEnterAction')
  runOnEnterActionSync(...args) {
    return this.trackerMonitor.runOnEnterActionSync(...args)
  }

  runOnEnterAction(...args) {
    return this.trackerMonitor.runOnEnterAction(...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnStayAction')
  runOnStayActionSync(...args) {
    return this.trackerMonitor.runOnStayActionSync(...args)
  }

  runOnStayAction(...args) {
    return this.trackerMonitor.runOnStayAction(...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.runOnExitAction')
  runOnExitActionSync(...args) {
    return this.trackerMonitor.runOnExitActionSync(...args)
  }

  runOnExitAction(...args) {
    return this.trackerMonitor.runOnExitAction(...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.startGeofenceMonitoringWithInAppCallback')
  startGeofenceMonitoringWithInAppCallbackSync(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithInAppCallbackSync(...args)
  }

  startGeofenceMonitoringWithInAppCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithInAppCallback(...args)
  }

  @deprecated('Backendless.Geo', 'Backendless.Geo.startGeofenceMonitoringWithRemoteCallback')
  startGeofenceMonitoringWithRemoteCallbackSync(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithRemoteCallbackSync(...args)
  }

  startGeofenceMonitoringWithRemoteCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithRemoteCallback(...args)
  }

  stopGeofenceMonitoring(...args) {
    return this.trackerMonitor.stopGeofenceMonitoring(...args)
  }

  resetGeofenceMonitoring(...args) {
    return this.trackerMonitor.reset(...args)
  }
}

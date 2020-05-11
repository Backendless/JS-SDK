import { deprecated } from '../decorators'
import Utils from '../utils'
import GeoUtils from './utils'

import { EARTH_RADIUS, UNITS } from './constants'

import GeoTrackerMonitor from './tracker-monitor'
import GeoCluster from './cluster'
import GeoPoint from './point'
import GeoQuery from './query'

import FindHelpers from './find-helpers'
import { validateQueryObject } from './query-validator'
import { toQueryParams } from './query-params'

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
  async addPoint(/** geopoint, async */) {
    return this.savePoint.apply(this, arguments)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async savePoint(geoPoint) {
    if (typeof geoPoint.latitude !== 'number' || typeof geoPoint.longitude !== 'number') {
      throw new Error('Latitude or longitude not a number')
    }

    geoPoint.categories = Utils.castArray(geoPoint.categories || ['Default'])

    const method = geoPoint.objectId
      ? this.app.request.Methods.PATCH
      : this.app.request.Methods.POST

    const url = geoPoint.objectId
      ? this.app.urls.geoPoint(geoPoint.objectId)
      : this.app.urls.geoPoints()

    return this.app.request
      .send({
        method,
        url,
        data: geoPoint,
      })
      .then(parseResponse)

    function parseResponse(resp) {
      const geoPoint = new GeoPoint()

      geoPoint.categories = resp.geopoint.categories
      geoPoint.latitude = resp.geopoint.latitude
      geoPoint.longitude = resp.geopoint.longitude
      geoPoint.metadata = resp.geopoint.metadata
      geoPoint.objectId = resp.geopoint.objectId

      return geoPoint
    }
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async find(query) {
    query.url = this.app.urls.geo()

    return loadItems.call(this, query)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async loadMetadata(geoObject) {
    const isCluster = geoObject instanceof GeoCluster
    const isPoint = geoObject instanceof GeoPoint

    if (!geoObject.objectId || !isCluster && !isPoint) {
      throw new Error('Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server')
    }

    let url = this.app.urls.geoPointMetaData(geoObject.objectId)

    if (isCluster) {
      const geoQuery = geoObject.geoQuery

      if (!(geoQuery instanceof GeoQuery)) {
        throw new Error(
          'Invalid GeoCluster object. ' +
          'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
        )
      }

      url += '?'

      for (const prop in geoQuery) {
        if (geoQuery.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && geoQuery[prop] != null) {
          url += '&' + FindHelpers[prop](geoQuery[prop])
        }
      }

    }

    return this.app.request.get({
      url: url,
    })
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async getClusterPoints(geoObject) {
    if (!geoObject.objectId || !(geoObject instanceof GeoCluster)) {
      throw new Error('Method argument must be a valid instance of GeoCluster persisted on the server')
    }

    if (!(geoObject.geoQuery instanceof GeoQuery)) {
      throw new Error(
        'Invalid GeoCluster object. ' +
        'Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API'
      )
    }

    let url = this.app.urls.geoClusterPoints(geoObject.objectId) + '?'

    const geoQuery = geoObject.geoQuery

    for (const prop in geoQuery) {
      if (geoQuery.hasOwnProperty(prop) && FindHelpers.hasOwnProperty(prop) && geoQuery[prop] != null) {
        url += '&' + FindHelpers[prop](geoQuery[prop])
      }
    }

    const parser = geoCollection => {
      for (let i = 0; i < geoCollection.length; i++) {
        geoCollection[i] = new GeoPoint(geoCollection[i])
      }
    }

    return this.app.request
      .get({
        url: url,
      })
      .then(parser)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async relativeFind(query) {
    if (!(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
      throw new Error(
        'Inconsistent geo query. ' +
        'Query should contain both relativeFindPercentThreshold and relativeFindMetadata'
      )
    }

    validateQueryObject(query)

    query.url = this.app.urls.geoRelative()

    const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + toQueryParams(query)

    return this.app.request
      .get({
        url: url,
      })
      .then(resp => responseParser(resp))

    function responseParser(items) {
      return items.map(item => ({
        geoPoint: new GeoPoint(item.geoPoint),
        matches : item.matches
      }))
    }
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async addCategory(name) {
    if (!name) {
      throw new Error('Category name is required.')
    }

    return this.app.request
      .put({
        url: this.app.urls.geoCategory(name),
      })
      .then(data => data.result || data)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async getCategories() {
    return this.app.request.get({
      url: this.app.urls.geoCategories(),
    })
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async deleteCategory(name) {
    if (!name) {
      throw new Error('Category name is required.')
    }

    return this.app.request
      .delete({
        url: this.app.urls.geoCategory(name),
      })
      .then(data => data.result || data)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async deletePoint(point) {
    if (!point || typeof point === 'function') {
      throw new Error('Point argument name is required, must be string (object Id), or point object')
    }

    const pointId = typeof point === 'string' ? point : point.objectId

    return this.app.request
      .delete({
        url: this.app.urls.geoPoint(pointId),
      })
      .then(data => data.result || data)

  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async getFencePoints(geoFenceName, query) {
    query = query || new GeoQuery()

    query.geoFence = geoFenceName
    query.url = this.app.urls.geo()

    return loadItems.call(this, query)
  }

  @deprecated('Backendless.Geo', alternativeForDepreciation)
  async getGeopointCount(fenceName, query) {
    if (fenceName && typeof fenceName === 'object') {
      query = fenceName
      fenceName = undefined
    }

    if (!query || typeof query !== 'object') {
      throw new Error('Geo query must be specified')
    }

    if (fenceName) {
      query['geoFence'] = fenceName
    }

    validateQueryObject(query)

    const url = this.app.urls.geoCount() + '?' + toQueryParams(query)

    return this.app.request.get({
      url: url,
    })
  }

  @deprecated('Backendless.Geo')
  async runOnEnterAction(...args) {
    return this.trackerMonitor.runOnEnterAction(...args)
  }

  @deprecated('Backendless.Geo')
  async runOnStayAction(...args) {
    return this.trackerMonitor.runOnStayAction(...args)
  }

  @deprecated('Backendless.Geo')
  async runOnExitAction(...args) {
    return this.trackerMonitor.runOnExitAction(...args)
  }

  @deprecated('Backendless.Geo')
  async startGeofenceMonitoringWithInAppCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithInAppCallback(...args)
  }

  @deprecated('Backendless.Geo')
  async startGeofenceMonitoringWithRemoteCallback(...args) {
    return this.trackerMonitor.startGeofenceMonitoringWithRemoteCallback(...args)
  }

  @deprecated('Backendless.Geo')
  async stopGeofenceMonitoring(...args) {
    return this.trackerMonitor.stopGeofenceMonitoring(...args)
  }

  resetGeofenceMonitoring(...args) {
    return this.trackerMonitor.reset(...args)
  }
}

function loadItems(query) {
  validateQueryObject(query)

  const url = query.url + (query.searchRectangle ? '/rect' : '/points') + '?' + toQueryParams(query)

  return this.app.request
    .get({
      url: url,
    })
    .then(resp => responseParser(resp, query))

  function responseParser(resp, geoQuery) {
    return resp.map(geoObject => {
      const GeoItem = geoObject.hasOwnProperty('totalPoints')
        ? GeoCluster
        : GeoPoint

      return new GeoItem({ ...geoObject, geoQuery })
    })
  }
}


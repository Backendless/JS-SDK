import { deprecated } from '../decorators'
import Utils from '../utils'

import { describe } from './describe'
import GeoJSONParser from './geo/geo-json-parser'
import Geometry from './geo/geometry'
import LineString from './geo/linestring'

import Point from './geo/point'
import Polygon from './geo/polygon'
import SpatialReferenceSystem from './geo/spatial-reference-system'
import WKTParser from './geo/wkt-parser'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import { SyncModes } from './offline/database-manager'
import { DataRetrievalPolicy, LocalStoragePolicy } from './offline/policy'

import Permissions from './permissions'
import QueryBuilder from './query-builder'
import Store from './store'

export default class Data {
  constructor(app) {
    this.app = app
    this.classToTableMap = {}

    this.Permissions = new Permissions(app)
    this.QueryBuilder = QueryBuilder
    this.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder

    this.RetrievalPolicy = DataRetrievalPolicy.ONLINEONLY
    this.LocalStoragePolicy = LocalStoragePolicy.DONOTSTOREANY

    this.Point = Point
    this.LineString = LineString
    this.Polygon = Polygon
    this.Geometry = Geometry

    this.GeoJSONParser = GeoJSONParser
    this.WKTParser = WKTParser

    this.SpatialReferenceSystem = SpatialReferenceSystem
  }

  of(model) {
    return new Store(model, this.classToTableMap, this.app)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.describe')
  describeSync(...args) {
    return Utils.synchronized(describe).call(this, ...args)
  }

  describe(...args) {
    return Utils.promisified(describe).call(this, ...args)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  save(className, obj) {
    return this.of(className).save(obj)
  }

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  saveSync(className, obj, asyncHandler) {
    return this.of(className).saveSync(obj, asyncHandler)
  }

  mapTableToClass(tableName, clientClass) {
    if (!tableName) {
      throw new Error('Table name is not specified')
    }

    if (!clientClass) {
      throw new Error('Class is not specified')
    }

    this.classToTableMap[tableName] = clientClass
  }

  async clearLocalDatabase() {
    if (!Utils.isBrowser) {
      throw new Error('Offline DB is not available outside of browser')
    }

    if (await this.app.OfflineDBManager.isDbExist()) {
      await this.app.OfflineDBManager.connection.dropDb()
    }
  }

  enableAutoSync() {
    this.app.OfflineDBManager.setGlobalSyncMode(SyncModes.AUTO)
  }

  disableAutoSync() {
    this.app.OfflineDBManager.setGlobalSyncMode(null)
  }

  startOfflineSync() {
    return this.app.OfflineDBManager.startOfflineSync(this.app)
  }

  isAutoSyncEnabled() {
    return this.app.OfflineDBManager.getGlobalSyncMode() === SyncModes.AUTO
  }
}

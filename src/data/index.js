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
import { DBManager, idbConnection, SyncModes } from './offline/database-manager'
import { DataRetrievalPolicy, LocalStoragePolicy } from './offline/policy'

import Permissions from './permissions'
import QueryBuilder from './query-builder'
import Store from './store'

const classToTableMap = {}

const Data = {
  Permissions: Permissions,

  QueryBuilder             : QueryBuilder,
  LoadRelationsQueryBuilder: LoadRelationsQueryBuilder,

  RetrievalPolicy   : DataRetrievalPolicy.ONLINEONLY,
  LocalStoragePolicy: LocalStoragePolicy.DONOTSTOREANY,

  Point     : Point,
  LineString: LineString,
  Polygon   : Polygon,
  Geometry  : Geometry,

  GeoJSONParser: GeoJSONParser,
  WKTParser    : WKTParser,

  SpatialReferenceSystem: SpatialReferenceSystem,

  of: function (model) {
    return new Store(model, classToTableMap)
  },

  @deprecated('Backendless.Data', 'Backendless.Data.describe')
  describeSync: Utils.synchronized(describe),
  describe    : Utils.promisified(describe),

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  save(className, obj) {
    return this.of(className).save(obj)
  },

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  saveSync(className, obj, asyncHandler) {
    return this.of(className).saveSync(obj, asyncHandler)
  },

  mapTableToClass(tableName, clientClass) {
    if (!tableName) {
      throw new Error('Table name is not specified')
    }

    if (!clientClass) {
      throw new Error('Class is not specified')
    }

    classToTableMap[tableName] = clientClass
  },

  async clearLocalDatabase() {
    if (!Utils.isBrowser) {
      throw new Error('Offline DB is not available outside of browser')
    }

    await idbConnection.dropDb()
  },

  enableAutoSync() {
    DBManager.setGlobalSyncMode(SyncModes.AUTO)
  },

  disableAutoSync() {
    DBManager.setGlobalSyncMode(null)
  },

  startOfflineSync() {
    return DBManager.startOfflineSync()
  },

  isAutoSyncEnabled() {
    return DBManager.getGlobalSyncMode() === SyncModes.AUTO
  }
}

export default Data
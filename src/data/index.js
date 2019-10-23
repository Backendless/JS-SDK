import Utils from '../utils'
import { deprecated } from '../decorators'

import Permissions from './permissions'
import Store from './store'
import QueryBuilder from './query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import { describe } from './describe'

import Point from './geo/point'
import LineString from './geo/linestring'
import Polygon from './geo/polygon'
import Geometry from './geo/geometry'
import SpatialReferenceSystem from './geo/spatial-reference-system'
import WKTParser from './geo/wkt-parser'
import GeoJSONParser from './geo/geo-json-parser'

const classToTableMap = {}

const Data = {
  Permissions: Permissions,

  QueryBuilder             : QueryBuilder,
  LoadRelationsQueryBuilder: LoadRelationsQueryBuilder,

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
  }
}

export default Data
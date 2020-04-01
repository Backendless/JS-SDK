import Utils from '../utils'

import { deprecated } from '../decorators'

import Store from './store'
import QueryBuilder from './query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'

import Point from './geo/point'
import LineString from './geo/linestring'
import Polygon from './geo/polygon'
import Geometry from './geo/geometry'
import SpatialReferenceSystem from './geo/spatial-reference-system'
import WKTParser from './geo/wkt-parser'
import GeoJSONParser from './geo/geo-json-parser'
import DataPermission from './persmission'

export default class Data {
  constructor(app) {
    this.app = app
    this.classToTableMap = {}

    this.Permissions = {
      FIND  : new DataPermission('FIND', app),
      REMOVE: new DataPermission('REMOVE', app),
      UPDATE: new DataPermission('UPDATE', app),
    }

    this.QueryBuilder = QueryBuilder
    this.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder

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

  async describe(className) {
    className = Utils.isString(className)
      ? className
      : Utils.getClassName(className)

    return this.app.request.get({
      url: this.app.urls.dataTableProps(className),
    })
  }

  @deprecated('Backendless.Data', 'Backendless.Data.of(<ClassName>).save')
  save(className, obj) {
    return this.of(className).save(obj)
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
}

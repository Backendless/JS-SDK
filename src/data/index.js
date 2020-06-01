import Utils from '../utils'

import { deprecated } from '../decorators'

import User from '../users/user'

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

export default class Data {
  constructor(app) {
    this.app = app

    this.classToTableMap = {
      [User.className]: User
    }

    this.Permissions = new Permissions(app)
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
    if (typeof tableName === 'function') {
      clientClass = tableName
      tableName = Utils.getClassName(clientClass)
    }

    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table Name must be provided and must be a string.')
    }

    if (!clientClass || typeof clientClass !== 'function') {
      throw new Error('Class must be provided and must be a constructor function.')
    }

    this.classToTableMap[tableName] = clientClass
  }
}

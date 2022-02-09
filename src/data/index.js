import Utils from '../utils'

import User from '../users/user'

import Store from './store'
import DataQueryBuilder from './data-query-builder'
import GroupQueryBuilder from './group-query-builder'
import LoadRelationsQueryBuilder from './load-relations-query-builder'
import JSONUpdateBuilder from './json-update-builder'

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

    this.classToTableMap = {
      [User.className]: User
    }

    this.Permissions = {
      FIND  : new DataPermission('FIND', app),
      REMOVE: new DataPermission('REMOVE', app),
      UPDATE: new DataPermission('UPDATE', app),
    }

    this.QueryBuilder = DataQueryBuilder
    this.GroupQueryBuilder = GroupQueryBuilder
    this.LoadRelationsQueryBuilder = LoadRelationsQueryBuilder
    this.JSONUpdateBuilder = JSONUpdateBuilder

    this.Point = Point
    this.LineString = LineString
    this.Polygon = Polygon
    this.Geometry = Geometry

    this.GeoJSONParser = GeoJSONParser
    this.WKTParser = WKTParser

    this.SpatialReferenceSystem = SpatialReferenceSystem
  }

  of(model) {
    return new Store(model, this)
  }

  async describe(className) {
    className = typeof className === 'string'
      ? className
      : Utils.getClassName(className)

    return this.app.request.get({
      url: this.app.urls.dataTableProps(className),
    })
  }

  async getTableNameById(tableId) {
    return this.app.request.get({
      url: this.app.urls.dataTableNameById(tableId),
    })
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

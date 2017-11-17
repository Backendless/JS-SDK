import Utils from '../utils'
import Query from './query'
import PagingQueryBuilder from './paging-query-builder'

export default class DataQueryBuilder {

  static create() {
    return new DataQueryBuilder()
  }

  constructor() {
    this._query = new Query()
    this._paging = new PagingQueryBuilder()
  }

  setPageSize(pageSize) {
    this._paging.setPageSize(pageSize)

    return this
  }

  setOffset(offset) {
    this._paging.setOffset(offset)

    return this
  }

  prepareNextPage() {
    this._paging.prepareNextPage()

    return this
  }

  preparePreviousPage() {
    this._paging.preparePreviousPage()

    return this
  }

  getProperties() {
    return this._query.properties
  }

  setProperties(properties) {
    this._query.properties = Utils.castArray(properties)

    return this
  }

  addProperty(property) {
    this._query.addProperty(property)

    return this
  }

  getWhereClause() {
    return this._query.condition
  }

  setWhereClause(whereClause) {
    this._query.condition = whereClause

    return this
  }

  getHavingClause() {
    return this._query.havingClause
  }

  setHavingClause(havingClause) {
    this._query.havingClause = havingClause

    return this
  }

  getSortBy() {
    return this._query.getOption('sortBy')
  }

  setSortBy(sortBy) {
    this._query.setOption('sortBy', Utils.castArray(sortBy))

    return this
  }

  getGroupBy() {
    return this._query.getOption('groupBy')
  }

  setGroupBy(groupBy) {
    this._query.setOption('groupBy', Utils.castArray(groupBy))

    return this
  }

  getRelated() {
    return this._query.getOption('relations')
  }

  setRelated(relations) {
    this._query.setOption('relations', Utils.castArray(relations))

    return this
  }

  getRelationsDepth() {
    return this._query.getOption('relationsDepth')
  }

  setRelationsDepth(relationsDepth) {
    this._query.setOption('relationsDepth', relationsDepth)

    return this
  }

  build() {
    this._query.setOptions(this._paging.build())

    return this._query
  }
}
import Query from './query'
import PagingQueryBuilder from './paging-query-builder'
import Utils from '../utils'

export default class LoadRelationsQueryBuilder {

  static create() {
    return new LoadRelationsQueryBuilder()
  }

  static of(RelationModel) {
    return new LoadRelationsQueryBuilder(RelationModel)
  }

  constructor(RelationModel) {
    this._query = new Query()
    this._query.relationModel = RelationModel

    this._paging = new PagingQueryBuilder()
  }

  setRelationName(relationName) {
    this._query.setOption('relationName', relationName)

    return this
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

  getSortBy() {
    return this._query.getOption('sortBy')
  }

  setSortBy(sortBy) {
    this._query.setOption('sortBy', Utils.castArray(sortBy))

    return this
  }

  build() {
    this._query.setOptions(this._paging.build())

    return this._query
  }

  toJSON() {
    const source = {
      pageSize: this._paging.pageSize,
      offset  : this._paging.offset,
      props   : this._query.properties,
      where   : this._query.condition,
      sortBy  : this._query.options && this._query.options.sortBy,
    }

    const target = {}

    if (source.pageSize > 0) {
      target.pageSize = source.pageSize
    }

    if (source.offset > 0) {
      target.offset = source.offset
    }

    if (Array.isArray(source.props) && source.props.length) {
      target.props = source.props
    }

    if (source.where) {
      target.where = source.where
    }

    if (source.sortBy) {
      target.sortBy = source.sortBy
    }

    return target
  }
}

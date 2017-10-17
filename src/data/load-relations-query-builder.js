import Query from './query'
import PagingQueryBuilder from './paging-query-builder'

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

  setWhereClause(whereClause) {
    this._query.condition = whereClause

    return this
  }

  build() {
    this._query.setOptions(this._paging.build())

    return this._query
  }
}

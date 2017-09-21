import DataQuery from './data-query'
import PagingQueryBuilder from './paging-query-builder'

export default class LoadRelationsQueryBuilder {

  static create() {
    return new LoadRelationsQueryBuilder()
  }

  static of(RelationModel) {
    return new LoadRelationsQueryBuilder(RelationModel)
  }

  constructor(RelationModel) {
    this._query = new DataQuery()
    this._query.relationModel = RelationModel

    this._paging = new PagingQueryBuilder()
  }

  /** @deprecated */
  setRelationName(relationName) {
    console.warn('Calling deprecated method!')

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

  addRelation(relation) {
    this._query.addOption('relations', relation)

    return this
  }

  setRelations(relations) {
    this._query.setOption('relations', relations)

    return this
  }

  build() {
    this._query.setOptions(this._paging.build())

    return this._query
  }
}
